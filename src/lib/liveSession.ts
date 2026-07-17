// ══════════════════════════════════════════════
// SmartSchool Live Session Engine
// localStorage + BroadcastChannel real-time sync
// ══════════════════════════════════════════════

export interface QuestionOption {
  id: string;      // 'A' | 'B' | 'C' | 'D'
  text: string;
}

export interface QuestionSlide {
  type: 'question';
  id: string;
  title: string;
  options: QuestionOption[];
  correctId: string;        // e.g. 'B'
  teacher_notes: string;
  timeLimit: number;         // seconds
}

export interface ContentSlide {
  type: 'content';
  title: string;
  bullets: string[];
  teacher_notes: string;
}

export interface LeaderboardSlide {
  type: 'leaderboard';
  title: string;
  teacher_notes: string;
}

export type LiveSlide = ContentSlide | QuestionSlide | LeaderboardSlide;

export interface Participant {
  id: string;
  name: string;
  joinedAt: number;
  score: number;
  responses: { questionId: string; chosenId: string; correct: boolean }[];
}

export interface QuestionResults {
  questionId: string;
  votes: Record<string, number>;   // { A: 5, B: 12, C: 2, D: 1 }
  totalResponses: number;
  revealed: boolean;
}

export interface LiveSession {
  id: string;
  pinCode: string;
  title: string;
  slides: LiveSlide[];
  currentSlideIndex: number;
  status: 'active' | 'inactive';
  participants: Participant[];
  questionResults: Record<string, QuestionResults>;
  questionLocked: Record<string, boolean>;   // questionId -> true when locked
  createdAt: number;
}

// ─── Helpers ───

const SESSION_KEY = 'ss_live_sessions';
const CHANNEL_NAME = 'ss_live_ch';

export function generatePin(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function getSessions(): LiveSession[] {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || '[]'); }
  catch { return []; }
}

function save(sessions: LiveSession[]) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessions));
  broadcast('update', {});
}

function broadcast(type: string, payload: any) {
  try {
    const bc = new BroadcastChannel(CHANNEL_NAME);
    bc.postMessage({ type, payload, ts: Date.now() });
    bc.close();
  } catch {
    // fallback
    localStorage.setItem('ss_bc', JSON.stringify({ type, payload, ts: Date.now() }));
  }
}

// ─── Read ───

export function getSession(id: string): LiveSession | null {
  return getSessions().find(s => s.id === id) || null;
}

export function getSessionByPin(pin: string): LiveSession | null {
  return getSessions().find(s => s.pinCode === pin && s.status === 'active') || null;
}

export function getActiveSession(): LiveSession | null {
  return getSessions().find(s => s.status === 'active') || null;
}

// ─── Teacher: Create ───

export function createLiveSession(title: string, slides: LiveSlide[]): LiveSession {
  const session: LiveSession = {
    id: uid(),
    pinCode: generatePin(),
    title,
    slides,
    currentSlideIndex: 0,
    status: 'active',
    participants: [],
    questionResults: {},
    questionLocked: {},
    createdAt: Date.now(),
  };

  const all = getSessions();
  all.forEach(s => (s.status = 'inactive'));
  all.push(session);
  save(all);
  return session;
}

// ─── Teacher: Navigate ───

export function navigateSlide(sessionId: string, newIndex: number) {
  const all = getSessions();
  const s = all.find(x => x.id === sessionId);
  if (!s) return;
  s.currentSlideIndex = Math.max(0, Math.min(newIndex, s.slides.length - 1));

  // If moving to a question slide, make sure results entry exists
  const slide = s.slides[s.currentSlideIndex];
  if (slide.type === 'question' && !s.questionResults[slide.id]) {
    s.questionResults[slide.id] = { questionId: slide.id, votes: { A: 0, B: 0, C: 0, D: 0 }, totalResponses: 0, revealed: false };
    s.questionLocked[slide.id] = false;
  }

  save(all);
}

// ─── Teacher: Lock question (stop accepting answers) ───

export function lockQuestion(sessionId: string, questionId: string) {
  const all = getSessions();
  const s = all.find(x => x.id === sessionId);
  if (!s) return;
  s.questionLocked[questionId] = true;
  save(all);
}

// ─── Teacher: Reveal answer ───

export function revealAnswer(sessionId: string, questionId: string) {
  const all = getSessions();
  const s = all.find(x => x.id === sessionId);
  if (!s) return;
  const qr = s.questionResults[questionId];
  if (qr) qr.revealed = true;
  s.questionLocked[questionId] = true;
  save(all);
}

// ─── Teacher: End ───

export function endSession(sessionId: string) {
  const all = getSessions();
  const s = all.find(x => x.id === sessionId);
  if (!s) return;
  s.status = 'inactive';
  save(all);
}

// ─── Student: Join ───

export function joinByPin(pin: string, name: string): { ok: boolean; session?: LiveSession; participantId?: string; error?: string } {
  const all = getSessions();
  const s = all.find(x => x.pinCode === pin && x.status === 'active');
  if (!s) return { ok: false, error: 'Kodi nuk u gjet ose prezantimi ka përfunduar.' };

  let participant = s.participants.find(p => p.name.toLowerCase() === name.toLowerCase());
  if (!participant) {
    participant = { id: uid(), name, joinedAt: Date.now(), score: 0, responses: [] };
    s.participants.push(participant);
    save(all);
  }

  return { ok: true, session: s, participantId: participant.id };
}

// ─── Student: Submit Answer ───

export function submitAnswer(sessionId: string, participantId: string, questionId: string, chosenId: string): { ok: boolean; correct: boolean; points: number } {
  const all = getSessions();
  const s = all.find(x => x.id === sessionId);
  if (!s) return { ok: false, correct: false, points: 0 };

  // Check if locked
  if (s.questionLocked[questionId]) return { ok: false, correct: false, points: 0 };

  const participant = s.participants.find(p => p.id === participantId);
  if (!participant) return { ok: false, correct: false, points: 0 };

  // Already answered?
  if (participant.responses.find(r => r.questionId === questionId)) {
    return { ok: false, correct: false, points: 0 };
  }

  // Find question slide
  const qSlide = s.slides.find(sl => sl.type === 'question' && sl.id === questionId) as QuestionSlide | undefined;
  if (!qSlide) return { ok: false, correct: false, points: 0 };

  const correct = chosenId === qSlide.correctId;
  const points = correct ? 100 : 0;

  // Record response
  participant.responses.push({ questionId, chosenId, correct });
  participant.score += points;

  // Update vote counts
  if (!s.questionResults[questionId]) {
    s.questionResults[questionId] = { questionId, votes: { A: 0, B: 0, C: 0, D: 0 }, totalResponses: 0, revealed: false };
  }
  const qr = s.questionResults[questionId];
  qr.votes[chosenId] = (qr.votes[chosenId] || 0) + 1;
  qr.totalResponses += 1;

  save(all);
  return { ok: true, correct, points };
}

// ─── Leaderboard ───

export function getLeaderboard(sessionId: string): Participant[] {
  const s = getSession(sessionId);
  if (!s) return [];
  return [...s.participants].sort((a, b) => b.score - a.score);
}

// ─── Realtime Listener ───

export function onLiveUpdate(callback: () => void): () => void {
  let bc: BroadcastChannel | null = null;
  try {
    bc = new BroadcastChannel(CHANNEL_NAME);
    bc.onmessage = () => callback();
  } catch {}

  const onStorage = (e: StorageEvent) => {
    if (e.key === SESSION_KEY || e.key === 'ss_bc') callback();
  };
  window.addEventListener('storage', onStorage);

  const poll = setInterval(callback, 600);

  return () => {
    bc?.close();
    window.removeEventListener('storage', onStorage);
    clearInterval(poll);
  };
}

// ─── Convert old-format slides to LiveSlide[] with questions ───

export function convertSlidesToLive(
  rawSlides: { title: string; bullets: string[]; teacher_notes: string }[]
): LiveSlide[] {
  const result: LiveSlide[] = [];

  rawSlides.forEach((s, i) => {
    // Add content slide
    result.push({ type: 'content', title: s.title, bullets: s.bullets, teacher_notes: s.teacher_notes });

    // After every 3rd content slide (not first, not last), inject a question
    if (i > 0 && i < rawSlides.length - 1 && i % 3 === 0) {
      result.push(generateQuestionFromSlide(s, i));
    }
  });

  // Add leaderboard as final slide
  result.push({ type: 'leaderboard', title: 'Tabela e Rezultateve 🏆', teacher_notes: 'Shfaqni rezultatet dhe festoni fituesit!' });

  return result;
}

function generateQuestionFromSlide(slide: { title: string; bullets: string[] }, index: number): QuestionSlide {
  // Generate a question from the slide content
  const cleanTitle = slide.title.replace(/[:\-–]/g, '').trim();

  const questionTemplates = [
    `Cila nga këto përgjigje është e saktë rreth "${cleanTitle}"?`,
    `Bazuar në informacionin e mësipërm, cila është e vërtetë?`,
    `Çfarë mësuam rreth "${cleanTitle}"?`,
  ];

  const correctBullet = slide.bullets[0] || 'Përgjigja e saktë';
  const wrongOptions = [
    'Asnjëra nga sa u tha më sipër',
    'Kjo temë nuk u trajtua',
    'Të gjitha janë gabim',
  ];

  // Shuffle correct answer position
  const correctPos = index % 4;
  const options: QuestionOption[] = [];
  const ids = ['A', 'B', 'C', 'D'];
  let wrongIdx = 0;

  for (let i = 0; i < 4; i++) {
    if (i === correctPos) {
      options.push({ id: ids[i], text: correctBullet });
    } else {
      // Try to use other bullets as distractors
      const distractor = slide.bullets[wrongIdx + 1] || wrongOptions[wrongIdx % wrongOptions.length];
      options.push({ id: ids[i], text: distractor });
      wrongIdx++;
    }
  }

  return {
    type: 'question',
    id: `q_${index}_${Date.now().toString(36)}`,
    title: questionTemplates[index % questionTemplates.length],
    options,
    correctId: ids[correctPos],
    teacher_notes: `Përgjigja e saktë: ${ids[correctPos]}. ${correctBullet}`,
    timeLimit: 30,
  };
}
