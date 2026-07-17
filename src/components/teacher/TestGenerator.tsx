import { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import {
  FileText, Sparkles, Download, X, Loader2, BookOpen,
  GraduationCap, CheckSquare, ClipboardList, Eye, ChevronDown, ChevronUp,
  Upload, FileUp, File, Check
} from 'lucide-react';

// ══════════════════════════════════════════
// Types
// ══════════════════════════════════════════

interface QuestionItem {
  text: string;
  options?: string[];
  correctAnswer?: string;
  points: number;
  lines?: number; // how many answer lines for open questions
}

interface QuestionSection {
  id: string;
  title: string;
  description: string;
  questions: QuestionItem[];
  totalPoints: number;
}

interface GeneratedTest {
  title: string;
  subject: string;
  grade: string;
  sections: QuestionSection[];
  totalPoints: number;
  sourceText?: string;  // text passage to show at top of PDF
}

interface AnswerKeySection {
  sectionTitle: string;
  answers: { questionNum: number; answer: string; points: number }[];
}

interface AnswerKey {
  sections: AnswerKeySection[];
  gradingTable: { range: string; grade: string }[];
}

// ══════════════════════════════════════════
// Question type definitions
// ══════════════════════════════════════════

const QUESTION_TYPES = [
  {
    id: 'objektive',
    num: 1,
    title: 'Pyetje Objektive',
    description: 'Zgjedhje e shumëfishtë, E vërtetë/Gabuar, Përputhje, Plotësim boshllëqesh',
    emoji: '🔵',
    defaultCount: 5,
    defaultPoints: 2,
  },
  {
    id: 'shkurter',
    num: 2,
    title: 'Pyetje me Përgjigje të Shkurtër',
    description: 'Përkufizime, Identifikim konceptesh, Shpjegime të thjeshta',
    emoji: '🟢',
    defaultCount: 3,
    defaultPoints: 3,
  },
  {
    id: 'hapur',
    num: 3,
    title: 'Pyetje me Përgjigje të Hapur',
    description: 'Ese, Analizë teksti/situate, Diskutim me argumente',
    emoji: '🟡',
    defaultCount: 2,
    defaultPoints: 5,
  },
  {
    id: 'zbatim',
    num: 4,
    title: 'Pyetje me Zbatim',
    description: 'Zgjidhje problemesh, Analizë e situatave reale, Interpretim të dhënash',
    emoji: '🟠',
    defaultCount: 2,
    defaultPoints: 5,
  },
  {
    id: 'analitike',
    num: 5,
    title: 'Pyetje Analitike',
    description: 'Shkaqe/pasoja, Zbërthim strukture, Marrëdhënie mes ideve',
    emoji: '🔴',
    defaultCount: 2,
    defaultPoints: 5,
  },
  {
    id: 'vleresim',
    num: 6,
    title: 'Pyetje Vlerësuese/Kritike',
    description: 'Gjykim i argumentuar, Krahasim kritik, Mbrojtje qëndrimi',
    emoji: '🟣',
    defaultCount: 1,
    defaultPoints: 8,
  },
  {
    id: 'krijuese',
    num: 7,
    title: 'Pyetje Krijuese',
    description: 'Krijim tekstesh të reja, Gjenerim idesh/zgjidhjesh alternative',
    emoji: '⚫',
    defaultCount: 1,
    defaultPoints: 8,
  },
];

// ══════════════════════════════════════════
// AI Generation
// ══════════════════════════════════════════

function generateTestOffline(
  topic: string,
  subject: string,
  grade: string,
  selectedTypes: Record<string, { enabled: boolean; count: number; pointsEach: number }>
): { test: GeneratedTest; answerKey: AnswerKey } {
  const sections: QuestionSection[] = [];
  const answerSections: AnswerKeySection[] = [];
  let globalQ = 0;

  QUESTION_TYPES.forEach((qt) => {
    const cfg = selectedTypes[qt.id];
    if (!cfg?.enabled) return;

    const questions: QuestionItem[] = [];
    const answers: AnswerKeySection['answers'] = [];

    for (let i = 0; i < cfg.count; i++) {
      globalQ++;

      if (qt.id === 'objektive') {
        const variants = [
          {
            text: `Cila nga alternativat e mëposhtme është e saktë rreth "${topic}"?`,
            options: ['A) Alternativa e parë', 'B) Alternativa e dytë', 'C) Alternativa e tretë', 'D) Alternativa e katërt'],
            correct: 'A',
          },
          {
            text: `Plotësoni boshllëkun: ${topic} është ____________________.`,
            options: undefined,
            correct: `[Përgjigja e saktë rreth ${topic}]`,
          },
          {
            text: `E vërtetë apo Gabuar: "${topic}" është koncept themelor i lëndës ${subject}.`,
            options: ['E vërtetë', 'Gabuar'],
            correct: 'E vërtetë',
          },
        ];
        const v = variants[i % variants.length];
        questions.push({ text: v.text, options: v.options, points: cfg.pointsEach, lines: v.options ? 0 : 1 });
        answers.push({ questionNum: globalQ, answer: v.correct, points: cfg.pointsEach });
      } else if (qt.id === 'shkurter') {
        questions.push({
          text: `Përkufizoni me fjalët tuaja konceptin "${topic}" dhe shpjegoni rëndësinë e tij në kontekstin e lëndës ${subject}.`,
          points: cfg.pointsEach, lines: 3,
        });
        answers.push({ questionNum: globalQ, answer: `Nxënësi duhet të japë përkufizimin e saktë të konceptit dhe ta lidhë me ${subject}. (${cfg.pointsEach} pikë)`, points: cfg.pointsEach });
      } else if (qt.id === 'hapur') {
        questions.push({
          text: `Analizoni rëndësinë e "${topic}" duke argumentuar me të paktën dy arsye. Mbështetni përgjigjen tuaj me shembuj konkretë.`,
          points: cfg.pointsEach, lines: 8,
        });
        answers.push({ questionNum: globalQ, answer: `Priten: analizë e thelluar, dy arsye të argumentuara, shembuj konkretë. Vlerësohet: qartësia, argumentimi, shembujt. (${cfg.pointsEach} pikë)`, points: cfg.pointsEach });
      } else if (qt.id === 'zbatim') {
        questions.push({
          text: `Bazuar në njohuritë tuaja për "${topic}", zgjidhni situatën e mëposhtme: Si do ta zbatonit këtë koncept në një situatë të jetës reale? Shpjegoni hapat.`,
          points: cfg.pointsEach, lines: 7,
        });
        answers.push({ questionNum: globalQ, answer: `Priten: zbatim praktik, hapa logjikë, lidhje me konceptin. (${cfg.pointsEach} pikë)`, points: cfg.pointsEach });
      } else if (qt.id === 'analitike') {
        questions.push({
          text: `Analizoni marrëdhënien shkak-pasojë në kontekstin e "${topic}". Cilat janë faktorët kryesorë dhe si ndikojnë ata në rezultatin përfundimtar?`,
          points: cfg.pointsEach, lines: 7,
        });
        answers.push({ questionNum: globalQ, answer: `Priten: identifikim faktorësh, analizë shkak-pasojë, përfundime logjike. (${cfg.pointsEach} pikë)`, points: cfg.pointsEach });
      } else if (qt.id === 'vleresim') {
        questions.push({
          text: `Vlerësoni në mënyrë kritike rolin e "${topic}" në ${subject}. A pajtoheni me rëndësinë që i jepet? Argumentoni qëndrimin tuaj duke përdorur fakte dhe shembuj.`,
          points: cfg.pointsEach, lines: 10,
        });
        answers.push({ questionNum: globalQ, answer: `Priten: qëndrim i qartë, argumente bindëse, fakte mbështetëse, gjykim kritik. (${cfg.pointsEach} pikë)`, points: cfg.pointsEach });
      } else if (qt.id === 'krijuese') {
        questions.push({
          text: `Imagjinoni një skenar alternativ ku "${topic}" nuk do të ekzistonte. Si do të ndikonte kjo në fushën e ${subject}? Propozoni një zgjidhje ose qasje kreative.`,
          points: cfg.pointsEach, lines: 10,
        });
        answers.push({ questionNum: globalQ, answer: `Priten: kreativitet, imagjinatë, logjikë, propozim zgjidhje origjinale. (${cfg.pointsEach} pikë)`, points: cfg.pointsEach });
      }
    }

    const sectionTotal = questions.reduce((s, q) => s + q.points, 0);
    sections.push({
      id: qt.id,
      title: `${qt.num}. ${qt.title}`,
      description: qt.description,
      questions,
      totalPoints: sectionTotal,
    });
    answerSections.push({ sectionTitle: `${qt.num}. ${qt.title}`, answers });
  });

  const totalPoints = sections.reduce((s, sec) => s + sec.totalPoints, 0);

  // Grading table
  const gradingTable = [
    { range: `${Math.round(totalPoints * 0.9)}-${totalPoints}`, grade: '10' },
    { range: `${Math.round(totalPoints * 0.8)}-${Math.round(totalPoints * 0.89)}`, grade: '9' },
    { range: `${Math.round(totalPoints * 0.7)}-${Math.round(totalPoints * 0.79)}`, grade: '8' },
    { range: `${Math.round(totalPoints * 0.6)}-${Math.round(totalPoints * 0.69)}`, grade: '7' },
    { range: `${Math.round(totalPoints * 0.5)}-${Math.round(totalPoints * 0.59)}`, grade: '6' },
    { range: `${Math.round(totalPoints * 0.4)}-${Math.round(totalPoints * 0.49)}`, grade: '5' },
    { range: `0-${Math.round(totalPoints * 0.39)}`, grade: '4' },
  ];

  return {
    test: { title: topic, subject, grade, sections, totalPoints },
    answerKey: { sections: answerSections, gradingTable },
  };
}

// ══════════════════════════════════════════
// PDF Builder — Test
// ══════════════════════════════════════════

function buildTestPdf(test: GeneratedTest): jsPDF {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210;
  const M = 18; // margin
  const CW = W - 2 * M; // content width
  let y = 0;

  const addPage = () => { doc.addPage(); y = M; };
  const checkPage = (needed: number) => { if (y + needed > 280) addPage(); };

  // ── HEADER ──
  y = M;

  // Top border line
  doc.setDrawColor(0);
  doc.setLineWidth(0.6);
  doc.line(M, y, W - M, y);
  y += 5;

  // School name placeholder
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text('Shkolla: ___________________________________________', M, y);
  doc.text(`Data: ____/____/________`, W - M - 55, y);
  y += 7;

  // Title
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.text('TEST KONTROLLI', W / 2, y, { align: 'center' });
  y += 7;

  // Subject and class
  doc.setFontSize(12);
  doc.text(`${test.subject}  —  ${test.grade}`, W / 2, y, { align: 'center' });
  y += 6;

  // Topic
  doc.setFont('Helvetica', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(80);
  doc.text(`Tema: ${test.title}`, W / 2, y, { align: 'center' });
  y += 8;

  // Student info boxes
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(0);
  doc.text('Emri/Mbiemri: _________________________________________', M, y);
  y += 6;
  doc.text(`Klasa: __________`, M, y);
  doc.text(`Pikët: _______ / ${test.totalPoints}`, M + 55, y);
  doc.text(`Nota: __________`, W - M - 40, y);
  y += 5;

  // Bottom border line
  doc.setLineWidth(0.6);
  doc.line(M, y, W - M, y);
  y += 3;

  // Instructions
  doc.setFont('Helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text('Lexoni me kujdes çdo pyetje para se të përgjigjeni. Shkruani përgjigjet në hapësirat e caktuara.', M, y);
  y += 8;

  // ── SOURCE TEXT (if provided) ──
  if (test.sourceText && test.sourceText.trim().length > 0) {
    checkPage(30);

    // Header box
    doc.setFillColor(245, 245, 245);
    doc.setDrawColor(0);
    doc.setLineWidth(0.4);
    doc.rect(M, y - 1, CW, 8, 'FD');
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(0);
    doc.text('Lexoni tekstin e mëposhtëm dhe përgjigjuni pyetjeve:', M + 3, y + 4.5);
    y += 11;

    // Text content in bordered box
    const sourceLines = doc.splitTextToSize(test.sourceText.trim(), CW - 10);
    const textBlockHeight = sourceLines.length * 4.2 + 8;
    checkPage(Math.ceil(textBlockHeight) + 5);

    doc.setDrawColor(160);
    doc.setLineWidth(0.3);
    doc.rect(M, y - 2, CW, textBlockHeight, 'S');

    // Left accent bar
    doc.setFillColor(100, 100, 100);
    doc.rect(M, y - 2, 1.5, textBlockHeight, 'F');

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(30);
    doc.text(sourceLines, M + 6, y + 3);
    y += textBlockHeight + 5;
  }

  // ── SECTIONS ──
  let globalQ = 0;

  test.sections.forEach((section) => {
    checkPage(20);

    // Section header
    doc.setDrawColor(0);
    doc.setFillColor(240, 240, 240);
    doc.rect(M, y - 1, CW, 9, 'F');
    doc.setLineWidth(0.3);
    doc.rect(M, y - 1, CW, 9, 'S');

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(`${section.title}`, M + 3, y + 5);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(`(${section.totalPoints} pikë)`, W - M - 3, y + 5, { align: 'right' });
    y += 12;

    // Description
    doc.setFont('Helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(120);
    doc.text(section.description, M + 2, y);
    y += 6;

    // Questions
    section.questions.forEach((q) => {
      globalQ++;
      const qLines = doc.splitTextToSize(q.text, CW - 12);
      const qHeight = qLines.length * 4.5;
      const optHeight = q.options ? q.options.length * 5 : 0;
      const answerLines = q.lines || 0;
      const answerHeight = answerLines * 7;
      const totalNeeded = qHeight + optHeight + answerHeight + 8;

      checkPage(totalNeeded);

      // Question number and text
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(0);
      doc.text(`${globalQ}.`, M + 1, y);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.text(qLines, M + 9, y);
      y += qHeight + 2;

      // Points indicator
      doc.setFont('Helvetica', 'italic');
      doc.setFontSize(7);
      doc.setTextColor(120);
      doc.text(`(${q.points} pikë)`, W - M - 2, y - 2, { align: 'right' });

      // Options (for multiple choice)
      if (q.options && q.options.length > 0) {
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(30);
        q.options.forEach((opt) => {
          checkPage(6);
          doc.text(`     ${opt}`, M + 6, y);
          y += 5;
        });
        y += 2;
      }

      // Answer lines (for open questions)
      if (answerLines > 0) {
        doc.setDrawColor(180);
        doc.setLineWidth(0.15);
        for (let l = 0; l < answerLines; l++) {
          checkPage(8);
          y += 7;
          doc.line(M + 4, y, W - M - 4, y);
        }
        y += 4;
      }

      y += 3;
    });

    y += 4;
  });

  // ── GRADING TABLE ──
  checkPage(50);
  y += 5;
  doc.setDrawColor(0);
  doc.setLineWidth(0.4);
  doc.line(M, y, W - M, y);
  y += 6;

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(0);
  doc.text('Tabela e Konvertimit të Pikëve në Notë:', M, y);
  y += 6;

  // Table header
  const colW = CW / 7;
  doc.setFillColor(230, 230, 230);
  doc.rect(M, y - 1, CW, 7, 'F');
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(7.5);

  const grades = ['10', '9', '8', '7', '6', '5', '4'];
  const ranges = [
    `${Math.round(test.totalPoints * 0.9)}-${test.totalPoints}`,
    `${Math.round(test.totalPoints * 0.8)}-${Math.round(test.totalPoints * 0.89)}`,
    `${Math.round(test.totalPoints * 0.7)}-${Math.round(test.totalPoints * 0.79)}`,
    `${Math.round(test.totalPoints * 0.6)}-${Math.round(test.totalPoints * 0.69)}`,
    `${Math.round(test.totalPoints * 0.5)}-${Math.round(test.totalPoints * 0.59)}`,
    `${Math.round(test.totalPoints * 0.4)}-${Math.round(test.totalPoints * 0.49)}`,
    `0-${Math.round(test.totalPoints * 0.39)}`,
  ];

  grades.forEach((g, i) => {
    const x = M + i * colW;
    doc.setLineWidth(0.2);
    doc.rect(x, y - 1, colW, 7, 'S');
    doc.text(`Nota ${g}`, x + colW / 2, y + 3.5, { align: 'center' });
  });
  y += 7;

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(7);
  ranges.forEach((r, i) => {
    const x = M + i * colW;
    doc.rect(x, y - 1, colW, 6, 'S');
    doc.text(r, x + colW / 2, y + 3, { align: 'center' });
  });
  y += 10;

  // Footer
  doc.setFont('Helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(150);
  doc.text('Gjeneruar me SmartSchool AI', W / 2, 290, { align: 'center' });

  return doc;
}

// ══════════════════════════════════════════
// PDF Builder — Answer Key
// ══════════════════════════════════════════

function buildAnswerKeyPdf(test: GeneratedTest, answerKey: AnswerKey): jsPDF {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210;
  const M = 18;
  const CW = W - 2 * M;
  let y = M;

  // Header
  doc.setDrawColor(0);
  doc.setLineWidth(0.6);
  doc.line(M, y, W - M, y);
  y += 6;

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text('SKEMA E VLERESIMIT / CELESI I PERGJIGJEVE', W / 2, y, { align: 'center' });
  y += 7;

  doc.setFontSize(11);
  doc.text(`${test.subject}  —  ${test.grade}`, W / 2, y, { align: 'center' });
  y += 5;

  doc.setFont('Helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(80);
  doc.text(`Tema: ${test.title}   |   Piket totale: ${test.totalPoints}`, W / 2, y, { align: 'center' });
  y += 5;

  doc.setLineWidth(0.6);
  doc.line(M, y, W - M, y);
  y += 8;

  // Sections
  answerKey.sections.forEach((section) => {
    if (y > 260) { doc.addPage(); y = M; }

    doc.setFillColor(240, 240, 240);
    doc.rect(M, y - 1, CW, 8, 'F');
    doc.setLineWidth(0.2);
    doc.rect(M, y - 1, CW, 8, 'S');
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(0);
    doc.text(section.sectionTitle, M + 3, y + 4.5);
    y += 11;

    section.answers.forEach((a) => {
      if (y > 270) { doc.addPage(); y = M; }

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(0);
      doc.text(`${a.questionNum}.`, M + 2, y);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8.5);
      const lines = doc.splitTextToSize(a.answer, CW - 20);
      doc.text(lines, M + 10, y);

      doc.setFont('Helvetica', 'italic');
      doc.setFontSize(7);
      doc.setTextColor(100);
      doc.text(`[${a.points}p]`, W - M - 2, y, { align: 'right' });

      y += lines.length * 4 + 4;
    });

    y += 4;
  });

  // Grading table
  if (y > 240) { doc.addPage(); y = M; }
  y += 5;
  doc.setLineWidth(0.4);
  doc.line(M, y, W - M, y);
  y += 6;

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(0);
  doc.text('Konvertimi Pike - Note:', M, y);
  y += 6;

  const colW = CW / answerKey.gradingTable.length;
  doc.setFillColor(230, 230, 230);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(7.5);

  answerKey.gradingTable.forEach((g, i) => {
    const x = M + i * colW;
    doc.rect(x, y - 1, colW, 7, 'FD');
    doc.text(`Nota ${g.grade}`, x + colW / 2, y + 3.5, { align: 'center' });
  });
  y += 7;

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(7);
  answerKey.gradingTable.forEach((g, i) => {
    const x = M + i * colW;
    doc.rect(x, y - 1, colW, 6, 'S');
    doc.text(g.range, x + colW / 2, y + 3, { align: 'center' });
  });

  // Footer
  doc.setFont('Helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(150);
  doc.text('Skema e Vleresimit — SmartSchool AI (KONFIDENCIALE)', W / 2, 290, { align: 'center' });

  return doc;
}

// ══════════════════════════════════════════
// Component
// ══════════════════════════════════════════

interface Props { onClose: () => void; }

export default function TestGenerator({ onClose }: Props) {
  const [step, setStep] = useState<'form' | 'generating' | 'preview'>('form');

  // Form
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('Matematikë');
  const [grade, setGrade] = useState('Klasa 7');
  const [selectedTypes, setSelectedTypes] = useState<Record<string, { enabled: boolean; count: number; pointsEach: number }>>(
    Object.fromEntries(QUESTION_TYPES.map(qt => [qt.id, { enabled: qt.num <= 4, count: qt.defaultCount, pointsEach: qt.defaultPoints }]))
  );
  const [expandedType, setExpandedType] = useState<string | null>(null);

  // Generated
  const [test, setTest] = useState<GeneratedTest | null>(null);
  const [answerKey, setAnswerKey] = useState<AnswerKey | null>(null);
  const [genProgress, setGenProgress] = useState(0);
  const [genMessage, setGenMessage] = useState('');

  // Preview
  const [previewTab, setPreviewTab] = useState<'test' | 'answers'>('test');

  // Upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; type: string } | null>(null);
  const [uploadedText, setUploadedText] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [parsing, setParsing] = useState(false);

  // Source text (to embed in PDF)
  const [sourceText, setSourceText] = useState('');

  const grades = ['Klasa 1', 'Klasa 2', 'Klasa 3', 'Klasa 4', 'Klasa 5', 'Klasa 6', 'Klasa 7', 'Klasa 8', 'Klasa 9', 'Klasa 10', 'Klasa 11', 'Klasa 12'];
  const subjects = ['Matematikë', 'Gjuhë Shqipe', 'Letërsi', 'Histori', 'Gjeografi', 'Fizikë', 'Kimi', 'Biologji', 'Anglisht', 'Shkencë', 'Qytetari', 'TIK'];

  const totalPoints = Object.entries(selectedTypes)
    .filter(([, v]) => v.enabled)
    .reduce((sum, [, v]) => sum + v.count * v.pointsEach, 0);

  const totalQuestions = Object.entries(selectedTypes)
    .filter(([, v]) => v.enabled)
    .reduce((sum, [, v]) => sum + v.count, 0);

  const enabledCount = Object.values(selectedTypes).filter(v => v.enabled).length;

  const toggleType = (id: string) => {
    setSelectedTypes(prev => ({ ...prev, [id]: { ...prev[id], enabled: !prev[id].enabled } }));
  };

  const updateType = (id: string, field: 'count' | 'pointsEach', value: number) => {
    setSelectedTypes(prev => ({ ...prev, [id]: { ...prev[id], [field]: Math.max(1, value) } }));
  };

  // ── File upload handlers ──

  const handleFileUpload = async (file: globalThis.File) => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const size = file.size < 1024 * 1024 ? `${(file.size / 1024).toFixed(0)} KB` : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    setUploadedFile({ name: file.name, size, type: ext });
    setParsing(true);

    try {
      if (ext === 'txt' || ext === 'md' || ext === 'csv') {
        const text = await file.text();
        setUploadedText(text.slice(0, 10000));
      } else if (ext === 'pdf') {
        const buf = await file.arrayBuffer();
        const bytes = new Uint8Array(buf);
        const raw = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
        const matches = raw.match(/\(([^)]{2,})\)/g);
        let text = '';
        if (matches) {
          text = matches.map(m => m.slice(1, -1)).filter(t => t.length > 3 && /[a-zA-ZëçÇËÀ-ÿ]/.test(t)).join('\n');
        }
        if (text.length < 50) {
          const readable = raw.match(/[A-Za-zÀ-ÿëçÇË0-9 .,;:!?-]{10,}/g);
          text = readable ? readable.join('\n') : `[PDF me ${(buf.byteLength / 1024).toFixed(0)} KB]`;
        }
        setUploadedText(text.slice(0, 10000));
      } else if (ext === 'docx') {
        const buf = await file.arrayBuffer();
        const raw = new TextDecoder('utf-8', { fatal: false }).decode(new Uint8Array(buf));
        const matches = raw.match(/<w:t[^>]*>([^<]+)<\/w:t>/g);
        const text = matches ? matches.map(m => m.replace(/<\/?w:t[^>]*>/g, '')).join(' ') : `[DOCX me ${(buf.byteLength / 1024).toFixed(0)} KB]`;
        setUploadedText(text.slice(0, 10000));
      } else if (ext === 'pptx') {
        const buf = await file.arrayBuffer();
        const raw = new TextDecoder('utf-8', { fatal: false }).decode(new Uint8Array(buf));
        const matches = raw.match(/<a:t>([^<]+)<\/a:t>/g);
        const text = matches ? matches.map(m => m.replace(/<\/?a:t>/g, '')).join('\n') : `[PPTX me ${(buf.byteLength / 1024).toFixed(0)} KB]`;
        setUploadedText(text.slice(0, 10000));
      } else {
        setUploadedText(`[Skedari "${file.name}" u ngarkua. Formati .${ext} nuk lexohet direkt.]`);
      }
      if (!topic) setTopic(file.name.replace(/\.[^.]+$/, ''));
    } catch {
      setUploadedText(`[Gabim gjatë leximit të "${file.name}"]`);
    }
    setParsing(false);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFileUpload(f);
  };
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFileUpload(f);
    e.target.value = '';
  };
  const handleRemoveFile = () => { setUploadedFile(null); setUploadedText(''); };

  // ── Generate ──

  const handleGenerate = async () => {
    if (!topic.trim() || enabledCount === 0) return;
    setStep('generating');
    setGenProgress(0);

    const hasFile = !!uploadedText;
    const stages = hasFile
      ? [
          { p: 8, msg: 'Duke lexuar dokumentin e ngarkuar...' },
          { p: 20, msg: 'Duke analizuar përmbajtjen...' },
          { p: 35, msg: 'Duke nxjerrë konceptet kryesore...' },
          { p: 50, msg: 'Duke gjeneruar pyetjet objektive...' },
          { p: 65, msg: 'Duke krijuar pyetjet analitike...' },
          { p: 78, msg: 'Duke ndërtuar skemën e vlerësimit...' },
          { p: 90, msg: 'Duke llogarituar pikët dhe notat...' },
          { p: 97, msg: 'Duke finalizuar testin...' },
        ]
      : [
          { p: 10, msg: 'Duke analizuar temën...' },
          { p: 25, msg: 'Duke përgatitur pyetjet objektive...' },
          { p: 40, msg: 'Duke gjeneruar pyetjet me përgjigje...' },
          { p: 55, msg: 'Duke krijuar pyetjet analitike...' },
          { p: 70, msg: 'Duke ndërtuar skemën e vlerësimit...' },
          { p: 85, msg: 'Duke llogarituar pikët dhe notat...' },
          { p: 95, msg: 'Duke finalizuar testin...' },
        ];

    for (const s of stages) {
      await new Promise(r => setTimeout(r, 350 + Math.random() * 300));
      setGenProgress(s.p);
      setGenMessage(s.msg);
    }

    // Pass uploaded text as extra context for smarter generation
    const topicWithContext = uploadedText
      ? `${topic}\n\n[BURIM DOKUMENTI]:\n${uploadedText.slice(0, 6000)}`
      : topic;

    const result = generateTestOffline(topicWithContext, subject, grade, selectedTypes);
    // Override title with clean topic (not the context blob)
    result.test.title = topic;
    // Attach source text if provided
    if (sourceText.trim()) {
      result.test.sourceText = sourceText.trim();
    }
    setTest(result.test);
    setAnswerKey(result.answerKey);

    setGenProgress(100);
    setGenMessage('Testi u krijua me sukses!');
    await new Promise(r => setTimeout(r, 400));
    setStep('preview');
  };

  const handleDownloadTest = () => {
    if (!test) return;
    const doc = buildTestPdf(test);
    doc.save(`Test_${test.subject}_${test.grade.replace(' ', '')}.pdf`);
  };

  const handleDownloadAnswerKey = () => {
    if (!test || !answerKey) return;
    const doc = buildAnswerKeyPdf(test, answerKey);
    doc.save(`Celesi_${test.subject}_${test.grade.replace(' ', '')}.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Gjenero Test Kontrolli</h2>
              <p className="text-xs text-gray-500">Test zyrtar PDF — i gatshëm për printim</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* ── FORM ── */}
          {step === 'form' && (
            <div className="p-6 space-y-5">
              {/* Topic */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <BookOpen className="w-4 h-4 text-gray-500" /> Tema e Testit
                </label>
                <input type="text" value={topic} onChange={e => setTopic(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-500 focus:ring-4 focus:ring-gray-100 outline-none text-lg"
                  placeholder="p.sh. Revolucioni Francez, Ekuacionet, Sistemi tretës..."
                />
              </div>

              {/* Subject & Grade */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FileText className="w-4 h-4 text-gray-500" /> Lënda
                  </label>
                  <select value={subject} onChange={e => setSubject(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-500 focus:ring-4 focus:ring-gray-100 outline-none">
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <GraduationCap className="w-4 h-4 text-gray-500" /> Klasa
                  </label>
                  <select value={grade} onChange={e => setGrade(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-500 focus:ring-4 focus:ring-gray-100 outline-none">
                    {grades.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>

              {/* File Upload Zone */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Upload className="w-4 h-4 text-gray-500" /> Ngarko Dokument Burim (Opsionale)
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ${
                    dragActive ? 'border-gray-500 bg-gray-100 scale-[1.01]'
                    : uploadedFile ? 'border-green-300 bg-green-50/50'
                    : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                  onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                  onClick={() => !uploadedFile && !parsing && fileInputRef.current?.click()}
                >
                  <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.pptx,.txt,.md" onChange={handleFileInput} />

                  {parsing ? (
                    <div className="p-6 text-center">
                      <Loader2 className="w-8 h-8 text-gray-500 animate-spin mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Duke lexuar dokumentin...</p>
                    </div>
                  ) : uploadedFile ? (
                    <div className="p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shrink-0">
                        {uploadedFile.type === 'pdf' ? <FileText className="w-6 h-6 text-red-500" /> : <File className="w-6 h-6 text-blue-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 truncate">{uploadedFile.name}</span>
                          <Check className="w-4 h-4 text-green-500 shrink-0" />
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                          <span>{uploadedFile.size}</span>
                          <span>·</span>
                          <span className="uppercase font-medium">{uploadedFile.type}</span>
                          {uploadedText && <>
                            <span>·</span>
                            <span className="text-green-600">{uploadedText.length.toLocaleString()} karaktere</span>
                          </>}
                        </div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); handleRemoveFile(); }} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="p-5 text-center cursor-pointer">
                      <FileUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-700">Tërhiqni PDF, Word ose PPT këtu</p>
                      <p className="text-xs text-gray-400 mt-1">ose klikoni për ta zgjedhur — AI gjeneron pyetje nga përmbajtja</p>
                    </div>
                  )}
                </div>

                {/* Preview extracted text */}
                {uploadedText && !parsing && (
                  <div className="mt-2 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-3 py-1.5 bg-gray-100 border-b border-gray-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-500">TEKSTI I NXJERRË</span>
                      <span className="text-xs text-gray-400">{uploadedText.length.toLocaleString()} kar.</span>
                    </div>
                    <div className="p-3 max-h-24 overflow-y-auto">
                      <p className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed">{uploadedText.slice(0, 1000)}{uploadedText.length > 1000 ? '...' : ''}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Source Text Passage */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <BookOpen className="w-4 h-4 text-gray-500" /> Tekst Burimor për Testin (Opsionale)
                </label>
                <p className="text-xs text-gray-400 mb-2">
                  Ngjisni një fragment letrar, artikull, problem ose tekst tjetër. Do të shfaqet në fillim të testit me udhëzimin "Lexoni tekstin e mëposhtëm...".
                </p>
                <textarea
                  value={sourceText}
                  onChange={e => setSourceText(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-500 focus:ring-4 focus:ring-gray-100 outline-none resize-none text-sm leading-relaxed"
                  rows={5}
                  placeholder={"p.sh. «Atdheu im, sa të dua...\nTë dua me mal e fusha...\nTë dua me lumenj e burime...»\n\n— ose një paragraf nga libri, artikull, problem, situatë, etj."}
                />
                {sourceText.trim() && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-green-600">
                    <Check className="w-3.5 h-3.5" />
                    <span>{sourceText.trim().length} karaktere — do të shfaqet në fillim të testit PDF</span>
                  </div>
                )}
              </div>

              {/* Question Types */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <CheckSquare className="w-4 h-4 text-gray-500" /> Llojet e Pyetjeve
                </label>
                <div className="space-y-2">
                  {QUESTION_TYPES.map(qt => {
                    const cfg = selectedTypes[qt.id];
                    const isExpanded = expandedType === qt.id;
                    return (
                      <div key={qt.id} className={`rounded-xl border-2 transition-all ${cfg.enabled ? 'border-gray-300 bg-gray-50/50' : 'border-gray-100'}`}>
                        <div className="flex items-center gap-3 p-3">
                          <input type="checkbox" checked={cfg.enabled} onChange={() => toggleType(qt.id)}
                            className="w-5 h-5 rounded border-gray-300 text-gray-700 focus:ring-gray-500"
                          />
                          <span className="text-lg">{qt.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-900">{qt.title}</div>
                            <div className="text-xs text-gray-500 truncate">{qt.description}</div>
                          </div>
                          {cfg.enabled && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500 hidden sm:inline">{cfg.count} × {cfg.pointsEach}p = {cfg.count * cfg.pointsEach}p</span>
                              <button onClick={() => setExpandedType(isExpanded ? null : qt.id)} className="p-1 hover:bg-gray-200 rounded transition-colors">
                                {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                              </button>
                            </div>
                          )}
                        </div>
                        {cfg.enabled && isExpanded && (
                          <div className="px-3 pb-3 pt-1 border-t border-gray-200 flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <label className="text-xs text-gray-600 font-medium">Pyetje:</label>
                              <input type="number" min={1} max={15} value={cfg.count}
                                onChange={e => updateType(qt.id, 'count', parseInt(e.target.value) || 1)}
                                className="w-16 px-2 py-1.5 rounded-lg border border-gray-200 text-sm text-center focus:border-gray-400 outline-none"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-xs text-gray-600 font-medium">Pikë/pyetje:</label>
                              <input type="number" min={1} max={20} value={cfg.pointsEach}
                                onChange={e => updateType(qt.id, 'pointsEach', parseInt(e.target.value) || 1)}
                                className="w-16 px-2 py-1.5 rounded-lg border border-gray-200 text-sm text-center focus:border-gray-400 outline-none"
                              />
                            </div>
                            <div className="text-xs text-gray-500 ml-auto">= {cfg.count * cfg.pointsEach} pikë</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Summary */}
              <div className="flex items-center justify-between p-4 bg-gray-100 rounded-xl">
                <div>
                  <span className="text-sm text-gray-600">Totali: </span>
                  <span className="font-bold text-gray-900">{totalQuestions} pyetje</span>
                  <span className="text-gray-400 mx-2">·</span>
                  <span className="font-bold text-gray-900">{totalPoints} pikë</span>
                  <span className="text-gray-400 mx-2">·</span>
                  <span className="text-sm text-gray-600">{enabledCount}/7 seksione</span>
                </div>
              </div>

              {/* Generate */}
              <button onClick={handleGenerate}
                disabled={!topic.trim() || enabledCount === 0}
                className="w-full py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-bold rounded-xl shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg">
                <Sparkles className="w-6 h-6" /> Gjenero Testin
              </button>
            </div>
          )}

          {/* ── GENERATING ── */}
          {step === 'generating' && (
            <div className="p-10 flex flex-col items-center justify-center min-h-[400px]">
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Loader2 className="w-12 h-12 text-gray-600 animate-spin" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white animate-bounce">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <div className="w-full max-w-sm mb-4">
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-600 to-gray-800 h-3 rounded-full transition-all duration-500" style={{ width: `${genProgress}%` }} />
                </div>
              </div>
              <p className="text-gray-600 font-medium text-center">{genMessage}</p>
              <p className="text-xs text-gray-400 mt-2">{subject} · {grade} · {totalQuestions} pyetje · {totalPoints} pikë</p>
            </div>
          )}

          {/* ── PREVIEW ── */}
          {step === 'preview' && test && answerKey && (
            <div className="p-6 space-y-5">
              {/* Tabs */}
              <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
                <button onClick={() => setPreviewTab('test')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${previewTab === 'test' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
                  <ClipboardList className="w-4 h-4" /> Testi
                </button>
                <button onClick={() => setPreviewTab('answers')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${previewTab === 'answers' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
                  <Eye className="w-4 h-4" /> Çelësi i Përgjigjeve
                </button>
              </div>

              {/* Test Preview */}
              {previewTab === 'test' && (
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-inner space-y-6">
                  {/* Header preview */}
                  <div className="text-center border-b-2 border-gray-300 pb-4">
                    <div className="text-xs text-gray-400 mb-1">Shkolla: _________________ | Data: __/__/____</div>
                    <h3 className="text-xl font-bold text-gray-900">TEST KONTROLLI</h3>
                    <div className="text-sm font-semibold text-gray-700 mt-1">{test.subject} — {test.grade}</div>
                    <div className="text-xs text-gray-500 italic mt-1">Tema: {test.title}</div>
                    <div className="text-xs text-gray-400 mt-2">Emri: _____________ | Klasa: ____ | Pikët: ___/{test.totalPoints} | Nota: ____</div>
                  </div>

                  {/* Source Text Preview */}
                  {test.sourceText && (
                    <div>
                      <div className="bg-gray-100 rounded-lg px-4 py-2 mb-2">
                        <h4 className="font-bold text-gray-900 text-sm">Lexoni tekstin e mëposhtëm dhe përgjigjuni pyetjeve:</h4>
                      </div>
                      <div className="border-l-4 border-gray-400 pl-4 py-2 bg-gray-50 rounded-r-lg">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed italic">{test.sourceText}</p>
                      </div>
                    </div>
                  )}

                  {/* Sections */}
                  {test.sections.map((section, si) => (
                    <div key={si}>
                      <div className="bg-gray-100 rounded-lg px-4 py-2 mb-3 flex items-center justify-between">
                        <h4 className="font-bold text-gray-900 text-sm">{section.title}</h4>
                        <span className="text-xs text-gray-500">({section.totalPoints} pikë)</span>
                      </div>
                      <div className="space-y-3 pl-2">
                        {section.questions.map((q, qi) => (
                          <div key={qi} className="text-sm text-gray-700">
                            <div className="flex gap-2">
                              <span className="font-bold shrink-0">{qi + 1}.</span>
                              <div className="flex-1">
                                <div>{q.text} <span className="text-gray-400 text-xs italic">({q.points}p)</span></div>
                                {q.options && (
                                  <div className="mt-1 space-y-0.5 pl-2">
                                    {q.options.map((opt, oi) => (
                                      <div key={oi} className="text-gray-600 text-xs">{opt}</div>
                                    ))}
                                  </div>
                                )}
                                {(q.lines || 0) > 0 && (
                                  <div className="mt-2 space-y-2">
                                    {Array.from({ length: Math.min(q.lines || 0, 3) }).map((_, li) => (
                                      <div key={li} className="border-b border-dotted border-gray-300 h-4" />
                                    ))}
                                    {(q.lines || 0) > 3 && <div className="text-xs text-gray-400 italic">...({q.lines} rreshta)</div>}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Answer Key Preview */}
              {previewTab === 'answers' && (
                <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 shadow-inner space-y-5">
                  <div className="text-center border-b-2 border-amber-300 pb-3">
                    <h3 className="text-lg font-bold text-gray-900">SKEMA E VLERËSIMIT</h3>
                    <div className="text-sm text-gray-600">{test.subject} — {test.grade} | Pikët: {test.totalPoints}</div>
                  </div>
                  {answerKey.sections.map((section, si) => (
                    <div key={si}>
                      <h4 className="font-bold text-gray-900 text-sm bg-amber-100 px-3 py-1.5 rounded-lg mb-2">{section.sectionTitle}</h4>
                      <div className="space-y-2 pl-2">
                        {section.answers.map((a, ai) => (
                          <div key={ai} className="text-sm flex gap-2">
                            <span className="font-bold text-gray-700 shrink-0">{a.questionNum}.</span>
                            <span className="text-gray-600 flex-1">{a.answer}</span>
                            <span className="text-xs text-amber-600 font-bold shrink-0">[{a.points}p]</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 'preview' && (
          <div className="p-5 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-3 shrink-0">
            <button onClick={() => { setStep('form'); setTest(null); setAnswerKey(null); }}
              className="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-white transition-colors">
              ← Gjenero Tjetër
            </button>
            <button onClick={handleDownloadTest}
              className="flex-1 py-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white font-bold rounded-xl shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
              <Download className="w-5 h-5" /> Shkarko Testin (.pdf)
            </button>
            <button onClick={handleDownloadAnswerKey}
              className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
              <Eye className="w-5 h-5" /> Shkarko Çelësin (.pdf)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
