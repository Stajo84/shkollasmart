export type QuestionType = 'multiple-choice' | 'true-false' | 'multiple-correct';

export interface QuizAnswer { id: string; text: string; isCorrect: boolean }
export interface QuizQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  explanation: string;
  answers: QuizAnswer[];
  points: number;
}
export interface Quiz {
  id: string;
  code: string;
  title: string;
  subject: string;
  grade: string;
  difficulty: 'E lehtë' | 'Mesatare' | 'E vështirë';
  duration: number;
  questions: QuizQuestion[];
  color: string;
  icon: string;
}

export const quizzes: Quiz[] = [
  {
    id: 'math-7', code: 'AB1234', title: 'Aventurë me thyesat', subject: 'Matematikë', grade: 'Klasa 7', difficulty: 'Mesatare', duration: 8, color: 'violet', icon: '∑',
    questions: [
      { id: 'm1', type: 'multiple-choice', prompt: 'Sa bën 3/4 + 1/4?', explanation: 'Emëruesit janë të njëjtë, prandaj mbledhim numëruesit: 4/4 = 1.', answers: [{ id: 'a', text: '1/2', isCorrect: false }, { id: 'b', text: '1', isCorrect: true }, { id: 'c', text: '4/8', isCorrect: false }, { id: 'd', text: '3/8', isCorrect: false }], points: 100 },
      { id: 'm2', type: 'true-false', prompt: 'Numri 0 është numër natyror.', explanation: 'Në këtë kuiz përdorim përkufizimin ku numrat natyrorë fillojnë nga 0.', answers: [{ id: 'a', text: 'E vërtetë', isCorrect: true }, { id: 'b', text: 'E gabuar', isCorrect: false }], points: 100 },
      { id: 'm3', type: 'multiple-correct', prompt: 'Cilat nga këto janë thyesa të barabarta me 1/2?', explanation: '2/4 dhe 5/10 thjeshtohen në 1/2.', answers: [{ id: 'a', text: '2/4', isCorrect: true }, { id: 'b', text: '3/5', isCorrect: false }, { id: 'c', text: '5/10', isCorrect: true }, { id: 'd', text: '4/6', isCorrect: false }], points: 150 },
      { id: 'm4', type: 'multiple-choice', prompt: 'Sa është 6 × 7?', explanation: '6 grupe me nga 7 bëjnë 42.', answers: [{ id: 'a', text: '36', isCorrect: false }, { id: 'b', text: '40', isCorrect: false }, { id: 'c', text: '42', isCorrect: true }, { id: 'd', text: '48', isCorrect: false }], points: 100 },
      { id: 'm5', type: 'multiple-choice', prompt: 'Cili është perimetri i një katrori me brinjë 5 cm?', explanation: 'Perimetri i katrorit është 4 × brinja = 20 cm.', answers: [{ id: 'a', text: '10 cm', isCorrect: false }, { id: 'b', text: '15 cm', isCorrect: false }, { id: 'c', text: '20 cm', isCorrect: true }, { id: 'd', text: '25 cm', isCorrect: false }], points: 100 },
    ],
  },
  {
    id: 'science-8', code: 'SH5678', title: 'Laboratori i natyrës', subject: 'Shkencë', grade: 'Klasa 8', difficulty: 'E lehtë', duration: 6, color: 'emerald', icon: '✦',
    questions: [
      { id: 's1', type: 'multiple-choice', prompt: 'Cili planet njihet si Planeti i Kuq?', explanation: 'Sipërfaqja e Marsit ka shumë oksid hekuri, që i jep ngjyrën e kuqe.', answers: [{ id: 'a', text: 'Venusi', isCorrect: false }, { id: 'b', text: 'Marsi', isCorrect: true }, { id: 'c', text: 'Jupiteri', isCorrect: false }, { id: 'd', text: 'Toka', isCorrect: false }], points: 100 },
      { id: 's2', type: 'true-false', prompt: 'Bimët prodhojnë oksigjen gjatë fotosintezës.', explanation: 'Fotosinteza përdor dritën për të prodhuar ushqim dhe çliron oksigjen.', answers: [{ id: 'a', text: 'E vërtetë', isCorrect: true }, { id: 'b', text: 'E gabuar', isCorrect: false }], points: 100 },
    ],
  },
  {
    id: 'history-9', code: 'HI9012', title: 'Udhëtim në histori', subject: 'Histori', grade: 'Klasa 9', difficulty: 'E vështirë', duration: 10, color: 'amber', icon: '◈',
    questions: [
      { id: 'h1', type: 'multiple-choice', prompt: 'Në cilin vit u shpall Pavarësia e Shqipërisë?', explanation: 'Pavarësia u shpall më 28 nëntor 1912 në Vlorë.', answers: [{ id: 'a', text: '1878', isCorrect: false }, { id: 'b', text: '1912', isCorrect: true }, { id: 'c', text: '1944', isCorrect: false }, { id: 'd', text: '1991', isCorrect: false }], points: 100 },
      { id: 'h2', type: 'multiple-correct', prompt: 'Cilat janë qytete historike të Shqipërisë?', explanation: 'Berati dhe Gjirokastra janë qytete muze dhe pjesë e trashëgimisë kulturore.', answers: [{ id: 'a', text: 'Berati', isCorrect: true }, { id: 'b', text: 'Gjirokastra', isCorrect: true }, { id: 'c', text: 'Parisi', isCorrect: false }, { id: 'd', text: 'Roma', isCorrect: false }], points: 150 },
    ],
  },
];

export const getQuizByCode = (code: string) => quizzes.find((quiz) => quiz.code === code.toUpperCase());
export const getQuizById = (id: string) => quizzes.find((quiz) => quiz.id === id);

export interface QuizAttempt { quizId: string; answers: Record<string, string[]>; score: number; xp: number; streak: number; timeUsed: number }
export interface StudentProgress { level: number; xp: number; streak: number; badges: string[] }

export const initialProgress: StudentProgress = { level: 7, xp: 1280, streak: 4, badges: ['Fillestar i shpejtë', 'Mendje e mprehtë'] };
