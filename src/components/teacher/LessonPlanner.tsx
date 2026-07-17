import { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { X, Sparkles, Loader2, GraduationCap, FileText, Download, Copy, Check, Calendar, Target, Layers, ClipboardCheck, BookOpen, Upload, FileUp, File } from 'lucide-react';

// ══════════════════════════════════════════
// Types & Data
// ══════════════════════════════════════════

interface PlanMeta {
  fusha: string;
  lenda: string;
  shkalla: string;
  klasa: string;
  tema: string;
  rezultatet: string[];
  situata: string;
  fjaleKyce: string[];
  burimet: string[];
  lidhjeNderkurrikulare: string;
  metodologjia: string;
  kohezgjatja: string;
}

interface PlanPhase {
  title: string;
  emoji: string;
  duration: string;
  content: string;
  color: string;
}

interface Assessment {
  level: string;
  description: string;
}

interface LessonPlan {
  meta: PlanMeta;
  phases: PlanPhase[];
  assessment: Assessment[];
}

// Subject → Field mapping
const SUBJECT_FIELDS: Record<string, string> = {
  'Matematikë': 'Matematika',
  'Gjuhë Shqipe': 'Gjuhët dhe Komunikimi',
  'Letërsi': 'Gjuhët dhe Komunikimi',
  'Anglisht': 'Gjuhët dhe Komunikimi',
  'Histori': 'Shoqëria dhe Mjedisi',
  'Gjeografi': 'Shoqëria dhe Mjedisi',
  'Qytetari': 'Shoqëria dhe Mjedisi',
  'Fizikë': 'Shkencat e Natyrës',
  'Kimi': 'Shkencat e Natyrës',
  'Biologji': 'Shkencat e Natyrës',
  'Shkencë': 'Shkencat e Natyrës',
  'TIK': 'Teknologjia dhe TIK',
  'Edukim Fizik': 'Jeta dhe Puna',
  'Art': 'Artet',
};

// Grade → Scale mapping
function getShkalla(grade: string): string {
  const num = parseInt(grade.replace(/\D/g, ''));
  if (num <= 2) return 'Shkalla I (Klasa 1-2)';
  if (num <= 5) return 'Shkalla II (Klasa 3-5)';
  if (num <= 7) return 'Shkalla III (Klasa 6-7)';
  if (num <= 9) return 'Shkalla IV (Klasa 8-9)';
  return 'Shkalla V (Klasa 10-12)';
}

// Cross-curricular links
function getCrossLinks(subject: string): string {
  const links: Record<string, string> = {
    'Matematikë': 'Fizikë (zbatim formulash), TIK (llogaritje dixhitale), Gjeografi (statistika)',
    'Gjuhë Shqipe': 'Letërsi (analizë tekstesh), Histori (konteksti historik), Art (shprehja krijuese)',
    'Histori': 'Gjeografi (harta dhe vendndodhje), Qytetari (vlerat demokratike), Letërsi (burime letrare)',
    'Gjeografi': 'Histori (ngjarje gjeopolitike), Shkencë (mjedisi), Matematikë (statistika)',
    'Fizikë': 'Matematikë (formulat), Kimi (ndërveprime), TIK (simulime)',
    'Kimi': 'Fizikë (energjia), Biologji (procese biokimike), Mjedisi (ndotja)',
    'Biologji': 'Kimi (procese kimike), Edukim Fizik (trupi), Mjedisi (ekologjia)',
    'Anglisht': 'Gjuhë Shqipe (krahasim gjuhësor), TIK (burime online), Gjeografi (kultura botërore)',
  };
  return links[subject] || 'Lidhje ndërkurrikulare me fushat përkatëse';
}

// ══════════════════════════════════════════
// AI Generation
// ══════════════════════════════════════════

function generatePlan(
  topic: string,
  subject: string,
  grade: string,
  duration: string,
  teacherMethodology: string,
  sourceText: string
): LessonPlan {
  const fusha = SUBJECT_FIELDS[subject] || 'Fusha Përkatëse';
  const shkalla = getShkalla(grade);
  const crossLinks = getCrossLinks(subject);
  const hasSource = sourceText.trim().length > 20;

  // Extract keywords and concepts from source text
  const sourceWords = hasSource
    ? sourceText.split(/[\s.,;:!?()]+/).filter(w => w.length > 4 && /^[A-ZÇË]/.test(w)).slice(0, 5)
    : [];
  const sourceSentences = hasSource
    ? sourceText.split(/[.!?\n]+/).map(s => s.trim()).filter(s => s.length > 15).slice(0, 6)
    : [];

  const fjaleKyce = hasSource && sourceWords.length > 0
    ? [...new Set([topic.split(' ')[0], ...sourceWords.slice(0, 4)])]
    : [topic.split(' ')[0] || 'Koncepti', 'Analizë', 'Zbatim', 'Vlerësim', subject];

  const rezultatet = hasSource
    ? [
        `Nxënësi identifikon konceptet kryesore që gjenden në tekstin burimor rreth "${topic}"`,
        `Nxënësi analizon informacionin e dhënë në material dhe nxjerr përfundime të argumentuara`,
        `Nxënësi zbatonë njohuritë nga teksti në situata të reja praktike`,
        `Nxënësi vlerëson faktet e paraqitura në burim duke përdorur mendimin kritik`,
      ]
    : [
        `Nxënësi identifikon dhe shpjegon konceptet kryesore të "${topic}" sipas standardeve të ${shkalla}`,
        `Nxënësi analizon dhe krahason informacionin duke përdorur të menduarit kritik`,
        `Nxënësi zbatonë njohuritë e fituara në situata praktike dhe probleme reale`,
        `Nxënësi vlerëson dhe argumenton qëndrimin e tij me fakte dhe shembuj konkretë`,
      ];

  const situata = hasSource && sourceSentences.length > 0
    ? `Bazuar në materialin burimor: "${sourceSentences[0]}..." — diskutoni në çifte: Çfarë konceptesh kryesore gjeni? Si lidhen ato me jetën e përditshme?`
    : `"Imagjinoni që jeni duke punuar si ekspertë të ${subject.toLowerCase()} dhe duhet t'i shpjegoni konceptin e "${topic}" një grupi nxënësish më të vegjël. Si do ta bënit?"`;

  const burimet = [
    `Teksti shkollor — ${subject}, ${grade}`,
    ...(hasSource ? ['Materiali burimor i ngarkuar nga mësuesi'] : []),
    'Materiale plotësuese nga interneti',
    'Fletë pune e përgatitur nga mësuesi',
    'Prezantim PowerPoint / SmartSchool AI',
    'Projector ose tabelë interaktive',
  ];

  const meta: PlanMeta = {
    fusha,
    lenda: subject,
    shkalla,
    klasa: grade,
    tema: topic,
    rezultatet,
    situata,
    fjaleKyce,
    burimet,
    lidhjeNderkurrikulare: crossLinks,
    metodologjia: teacherMethodology || 'ERR (Evokimi — Realizimi i Kuptimit — Reflektimi)',
    kohezgjatja: duration,
  };

  const isDuration90 = duration.includes('90');
  const evokimMin = isDuration90 ? '15' : '10';
  const realizimMin = isDuration90 ? '45' : '25';
  const reflektimMin = isDuration90 ? '20' : '10';
  const vleresimMin = isDuration90 ? '10' : '5';

  const phases: PlanPhase[] = [
    {
      title: `Evokimi (${evokimMin} min)`,
      emoji: '💡',
      duration: `${evokimMin} minuta`,
      content: `• Situata e të nxënit: ${meta.situata}\n• Stuhi mendimesh në çifte — nxënësit diskutojnë 2 minuta\n• Pyetje nxitëse frontale: "Çfarë dini tashmë për ${topic}?"\n• Parashikime — nxënësit shkruajnë 3 gjëra që presin të mësojnë\n• Lidhja me njohuritë paraprake të nxënësve\n• Aktivizimi i kuriozitetit përmes një fakti interesant`,
      color: 'border-amber-200 bg-amber-50',
    },
    {
      title: `Realizimi i Kuptimit (${realizimMin} min)`,
      emoji: '📖',
      duration: `${realizimMin} minuta`,
      content: hasSource
        ? `• Shpërndarje e materialit burimor — nxënësit lexojnë individualish\n• Nënvizimi i koncepteve kryesore në tekst\n• Shpjegim i termave kyçe: ${meta.fjaleKyce.join(', ')}\n• Punë në grupe (4-5 nxënës) — detyrë e bazuar në burim:\n  - Grupi 1-2: Nxirrni faktet kryesore nga teksti\n  - Grupi 3-4: Gjeni shembuj dhe zbatim praktik\n  - Grupi 5: Vlerësoni informacionin e dhënë\n• Çdo grup prezanton gjetjet\n• Diskutim frontal dhe pyetje-përgjigje`
        : `• Prezantim i materialit të ri rreth "${topic}"\n• Lexim i drejtuar — nxënësit lexojnë dhe nënvizojnë pikat kryesore\n• Shpjegim i termave kyçe: ${meta.fjaleKyce.join(', ')}\n• Punë në grupe (4-5 nxënës) — detyrë e strukturuar:\n  - Grupi 1-2: Identifikoni konceptet kryesore\n  - Grupi 3-4: Gjeni shembuj praktikë\n  - Grupi 5: Krahasoni me koncepte të ngjashme\n• Diskutim frontal — çdo grup prezanton gjetjet\n• Pyetje-përgjigje për qartësim`,
      color: 'border-blue-200 bg-blue-50',
    },
    {
      title: `Reflektimi (${reflektimMin} min)`,
      emoji: '🔄',
      duration: `${reflektimMin} minuta`,
      content: `• Përmbledhje e pikave kryesore — bëhet nga nxënësit\n• Ditari i të mësuarit (INSERT):\n  - ✓ E dija tashmë\n  - + E mësova sot\n  - ? Dua ta di ende\n  - ! Më befasoi\n• Reflektim individual — "3 gjëra që mësova, 2 pyetje që kam, 1 gjë që do zbatoj"\n• Diskutim i hapur — pyetje reflektuese`,
      color: 'border-emerald-200 bg-emerald-50',
    },
    {
      title: `Vlerësimi (${vleresimMin} min)`,
      emoji: '✅',
      duration: `${vleresimMin} minuta`,
      content: `• Kuiz i shkurtër (3-5 pyetje — SmartSchool Live)\n• Detyrë shtëpie e strukturuar\n• Vetëvlerësim me rubrikë\n\n📋 Vlerësimi sipas niveleve:\n(Shih tabelën e vlerësimit më poshtë)`,
      color: 'border-violet-200 bg-violet-50',
    },
  ];

  const assessment: Assessment[] = hasSource
    ? [
        { level: 'N2 — Kuptimi', description: `Nxënësi identifikon faktet kryesore nga teksti burimor rreth "${topic}". Përshkruan konceptet bazë me fjalë të thjeshta pa i analizuar.` },
        { level: 'N3 — Zbatimi', description: `Nxënësi shpjegon informacionin e nxjerrë nga burimi duke dhënë shembuj. Zbatonë konceptet në situata të reja dhe krahason me njohuri paraprake.` },
        { level: 'N4 — Analiza & Vlerësimi', description: `Nxënësi analizon materialin burimor në thellësi, vlerëson faktet e paraqitura në mënyrë kritike, propozon interpretime alternative dhe argumenton me fakte nga teksti.` },
      ]
    : [
        { level: 'N2 — Kuptimi', description: `Nxënësi përshkruan konceptet bazë të "${topic}" dhe jep përkufizime të thjeshta. Identifikon elementet kryesore pa i analizuar.` },
        { level: 'N3 — Zbatimi', description: `Nxënësi shpjegon "${topic}" duke dhënë shembuj. Zbatonë njohuritë në situata të njohura dhe krahason koncepte. Argumenton me fakte.` },
        { level: 'N4 — Analiza & Vlerësimi', description: `Nxënësi analizon "${topic}" në thellësi, vlerëson informacionin në mënyrë kritike, propozon zgjidhje krijuese dhe argumenton me fakte nga burime të shumta.` },
      ];

  return { meta, phases, assessment };
}

// ══════════════════════════════════════════
// PDF Builder
// ══════════════════════════════════════════

function buildPlanPdf(plan: LessonPlan): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const M = 14, W = 210, CW = W - 2 * M;
  let y = M;
  const check = (n: number) => { if (y + n > 278) { doc.addPage(); y = M; } };

  // ── Title ──
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text('PLAN DITAR MESIMOR', W / 2, y, { align: 'center' });
  y += 8;

  // ── Meta Table ──
  const metaRows: [string, string][] = [
    ['Fusha:', plan.meta.fusha],
    ['Lenda:', plan.meta.lenda],
    ['Shkalla:', plan.meta.shkalla],
    ['Klasa:', plan.meta.klasa],
    ['Tema mesimore:', plan.meta.tema],
    ['Kohezgjatja:', plan.meta.kohezgjatja],
    ['Metodologjia:', plan.meta.metodologjia],
  ];

  doc.setFontSize(9);
  metaRows.forEach(([label, value]) => {
    check(6);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(0);
    doc.text(label, M, y);
    doc.setFont('Helvetica', 'normal');
    doc.text(value, M + 38, y);
    y += 5.5;
  });
  y += 3;

  // ── Rezultatet ──
  check(25);
  doc.setFillColor(240, 240, 240);
  doc.rect(M, y - 1, CW, 7, 'FD');
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Rezultatet e te nxenit te kompetencave te lendes:', M + 2, y + 4);
  y += 10;

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  plan.meta.rezultatet.forEach(r => {
    check(5);
    const lines = doc.splitTextToSize(`• ${r}`, CW - 6);
    doc.text(lines, M + 3, y);
    y += lines.length * 4.2;
  });
  y += 4;

  // ── Situata ──
  check(15);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Situata e te nxenit:', M, y);
  y += 5;
  doc.setFont('Helvetica', 'italic');
  doc.setFontSize(8.5);
  const sitLines = doc.splitTextToSize(plan.meta.situata, CW - 6);
  doc.text(sitLines, M + 3, y);
  y += sitLines.length * 4.2 + 3;

  // ── Fjale kyce ──
  check(8);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Fjale kyce:', M, y);
  doc.setFont('Helvetica', 'normal');
  doc.text(plan.meta.fjaleKyce.join(', '), M + 25, y);
  y += 6;

  // ── Burimet ──
  check(20);
  doc.setFont('Helvetica', 'bold');
  doc.text('Burimet dhe mjetet mesimore:', M, y);
  y += 5;
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  plan.meta.burimet.forEach(b => {
    check(4.5);
    doc.text(`• ${b}`, M + 3, y);
    y += 4.2;
  });
  y += 3;

  // ── Lidhje nderkurrikulare ──
  check(8);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Lidhja me fushat e tjera/temat nderkurrikulare:', M, y);
  y += 5;
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  const crossLines = doc.splitTextToSize(plan.meta.lidhjeNderkurrikulare, CW - 6);
  doc.text(crossLines, M + 3, y);
  y += crossLines.length * 4.2 + 5;

  // ── Phases ──
  plan.phases.forEach(phase => {
    check(20);
    doc.setFillColor(240, 240, 240);
    doc.rect(M, y - 1, CW, 7, 'FD');
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(0);
    doc.text(phase.title, M + 2, y + 4);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(phase.duration, W - M - 2, y + 4, { align: 'right' });
    y += 10;

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(30);
    const lines = doc.splitTextToSize(phase.content, CW - 8);
    lines.forEach((l: string) => { check(4.5); doc.text(l, M + 3, y); y += 4.2; });
    y += 5;
  });

  // ── Assessment Table ──
  check(35);
  doc.setFillColor(50, 50, 50);
  doc.setTextColor(255);
  doc.rect(M, y - 1, CW, 7, 'F');
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('VLERESIMI SIPAS NIVELEVE', M + 2, y + 4);
  y += 9;

  doc.setTextColor(0);
  plan.assessment.forEach((a, i) => {
    check(20);
    const bg = i % 2 === 0 ? 248 : 255;
    doc.setFillColor(bg, bg, bg);

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8.5);
    const labelW = 40;
    const descW = CW - labelW - 2;

    // Level label
    doc.rect(M, y - 1, labelW, 14, 'FD');
    doc.text(a.level, M + 2, y + 5, { maxWidth: labelW - 4 });

    // Description
    doc.rect(M + labelW, y - 1, descW, 14, 'S');
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(7.5);
    const dLines = doc.splitTextToSize(a.description, descW - 4);
    doc.text(dLines, M + labelW + 2, y + 3);

    y += 14;
  });

  // ── Footer ──
  doc.setFont('Helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(150);
  doc.text('Gjeneruar me SmartSchool AI — Plan ditar sipas programeve lendore zyrtare', W / 2, 290, { align: 'center' });

  return doc;
}

// ══════════════════════════════════════════
// Component
// ══════════════════════════════════════════

interface Props { onClose: () => void }

const SUBJECTS = ['Matematikë','Gjuhë Shqipe','Letërsi','Histori','Gjeografi','Fizikë','Kimi','Biologji','Anglisht','Shkencë','Qytetari','TIK','Edukim Fizik','Art'];
const GRADES = Array.from({ length: 12 }, (_, i) => `Klasa ${i + 1}`);

export default function LessonPlanner({ onClose }: Props) {
  const [step, setStep] = useState<'form' | 'gen' | 'preview'>('form');
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('Matematikë');
  const [grade, setGrade] = useState('Klasa 7');
  const [duration, setDuration] = useState('45 min');
  const [teacherMethodology, setTeacherMethodology] = useState('');
  const [sourceText, setSourceText] = useState('');
  const [plan, setPlan] = useState<LessonPlan | null>(null);
  const [progress, setProgress] = useState(0);
  const [msg, setMsg] = useState('');
  const [copied, setCopied] = useState(false);

  // File upload
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [parsing, setParsing] = useState(false);

  const handleFile = async (file: globalThis.File) => {
    setUploadedFileName(file.name);
    setParsing(true);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'txt' || ext === 'md') {
        setSourceText(await file.text());
      } else if (ext === 'pdf') {
        const buf = await file.arrayBuffer();
        const raw = new TextDecoder('utf-8', { fatal: false }).decode(new Uint8Array(buf));
        // Extract text from PDF
        const textMatches = raw.match(/\(([^)]{2,})\)/g);
        let text = '';
        if (textMatches) {
          text = textMatches
            .map(m => m.slice(1, -1))
            .filter(t => t.length > 3 && /[a-zA-ZëçÇËÀ-ÿ]/.test(t))
            .join('\n');
        }
        if (text.length < 50) {
          const readable = raw.match(/[A-Za-zÀ-ÿëçÇË0-9 .,;:!?-]{10,}/g);
          text = readable ? readable.join('\n') : `[PDF me ${(buf.byteLength / 1024).toFixed(0)} KB]`;
        }
        setSourceText(text.slice(0, 10000));
      } else {
        setSourceText(`[Formati .${ext} nuk mbështetet plotësisht]`);
      }
      if (!topic) setTopic(file.name.replace(/\.[^.]+$/, ''));
    } catch {
      setSourceText('[Gabim gjatë leximit të skedarit]');
    }
    setParsing(false);
  };

  const handleRemoveFile = () => {
    setUploadedFileName('');
    setSourceText('');
  };

  const shkalla = getShkalla(grade);
  const fusha = SUBJECT_FIELDS[subject] || 'Fusha Përkatëse';

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setStep('gen'); setProgress(0);

    const hasFile = sourceText.trim().length > 20;
    const stages = hasFile
      ? [
          { p: 8, m: 'Duke lexuar materialin burimor...' },
          { p: 18, m: 'Duke nxjerrë konceptet nga dokumenti...' },
          { p: 30, m: 'Duke analizuar programin lëndor...' },
          { p: 42, m: `Duke përcaktuar ${shkalla}...` },
          { p: 54, m: 'Duke hartuar rezultatet bazuar në burim...' },
          { p: 66, m: 'Duke krijuar situatën e të nxënit...' },
          { p: 76, m: 'Duke strukturuar fazat ERR me materialin...' },
          { p: 86, m: 'Duke ndërtuar rubrikën N2-N4...' },
          { p: 95, m: 'Duke finalizuar planin ditar...' },
        ]
      : [
          { p: 10, m: 'Duke analizuar programin lëndor...' },
          { p: 25, m: `Duke përcaktuar ${shkalla}...` },
          { p: 40, m: 'Duke hartuar rezultatet e të nxënit...' },
          { p: 55, m: 'Duke krijuar situatën e të nxënit...' },
          { p: 68, m: 'Duke strukturuar fazat ERR...' },
          { p: 80, m: 'Duke ndërtuar rubrikën N2-N4...' },
          { p: 92, m: 'Duke finalizuar planin ditar...' },
        ];

    for (const s of stages) {
      await new Promise(r => setTimeout(r, 350 + Math.random() * 300));
      setProgress(s.p); setMsg(s.m);
    }
    setPlan(generatePlan(topic, subject, grade, duration, teacherMethodology, sourceText));
    setProgress(100); setMsg('Plani u krijua!');
    await new Promise(r => setTimeout(r, 400)); setStep('preview');
  };

  const handleCopy = () => {
    if (!plan) return;
    const m = plan.meta;
    const txt = [
      `PLAN DITAR MËSIMOR`,
      `${'═'.repeat(50)}`,
      `Fusha: ${m.fusha}`, `Lënda: ${m.lenda}`, `Shkalla: ${m.shkalla}`, `Klasa: ${m.klasa}`,
      `Tema: ${m.tema}`, `Kohëzgjatja: ${m.kohezgjatja}`, `Metodologjia: ${m.metodologjia}`,
      `\nRezultatet e të nxënit:`, ...m.rezultatet.map(r => `• ${r}`),
      `\nSituata e të nxënit:\n${m.situata}`,
      `\nFjalë kyçe: ${m.fjaleKyce.join(', ')}`,
      `\nBurimet: ${m.burimet.join('; ')}`,
      `\nLidhje ndërkurrikulare: ${m.lidhjeNderkurrikulare}`,
      ...plan.phases.map(p => `\n${p.title}\n${'─'.repeat(40)}\n${p.content}`),
      `\nVLERËSIMI:`, ...plan.assessment.map(a => `${a.level}: ${a.description}`),
    ].join('\n');
    navigator.clipboard.writeText(txt); setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center"><Calendar className="w-5 h-5 text-white" /></div>
            <div><h2 className="text-lg font-bold text-gray-900">Planifikuesi i Orës Mësimore</h2><p className="text-xs text-gray-500">Plan ditar sipas programeve lëndore zyrtare</p></div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* ── FORM ── */}
          {step === 'form' && (
            <div className="p-6 space-y-5">
              {/* Topic */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"><Target className="w-4 h-4 text-emerald-500" /> Tema Mësimore</label>
                <input type="text" value={topic} onChange={e => setTopic(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none text-lg" placeholder="p.sh. Teorema e Pitagorës, Rilindja Kombëtare..." />
              </div>

              {/* Subject, Grade, Duration */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"><FileText className="w-4 h-4 text-emerald-500" /> Lënda</label>
                  <select value={subject} onChange={e => setSubject(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none">{SUBJECTS.map(s => <option key={s}>{s}</option>)}</select>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"><GraduationCap className="w-4 h-4 text-emerald-500" /> Klasa</label>
                  <select value={grade} onChange={e => setGrade(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none">{GRADES.map(g => <option key={g}>{g}</option>)}</select>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"><Layers className="w-4 h-4 text-emerald-500" /> Kohëzgjatja</label>
                  <select value={duration} onChange={e => setDuration(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none">
                    <option>45 min</option><option>60 min</option><option>90 min (2 orë)</option>
                  </select>
                </div>
              </div>

              {/* Auto-detected info */}
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div><span className="font-bold text-emerald-800">Fusha:</span> <span className="text-emerald-700">{fusha}</span></div>
                  <div><span className="font-bold text-emerald-800">Shkalla:</span> <span className="text-emerald-700">{shkalla}</span></div>
                </div>
              </div>

              {/* Methodology — free text */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"><BookOpen className="w-4 h-4 text-emerald-500" /> Metodologjia (Opsionale — shkruani teknikat tuaja)</label>
                <textarea value={teacherMethodology} onChange={e => setTeacherMethodology(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 outline-none resize-none text-sm" rows={3}
                  placeholder="p.sh. ERR, Mendimi Kritik, Punë në grup, Debat, Projekt-bazuar...\nLëreni bosh për ERR automatik." />
              </div>

              {/* ── SOURCE TEXT & FILE UPLOAD ── */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Upload className="w-4 h-4 text-emerald-500" /> Burimi i Leksionit (Opsionale)
                </label>
                <p className="text-xs text-gray-400 -mt-1">
                  Ngjisni tekstin nga libri ose ngarkoni PDF — AI do ta bazojë planin te ky material.
                </p>

                {/* Textarea */}
                <textarea
                  value={sourceText}
                  onChange={e => setSourceText(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none resize-none text-sm leading-relaxed"
                  rows={4}
                  placeholder="Ngjisni këtu tekstin e mësimit nga libri digjital ose burime të tjera..."
                />

                {/* File Upload */}
                <div
                  className={`border-2 border-dashed rounded-xl transition-all ${
                    uploadedFileName
                      ? 'border-green-300 bg-green-50/50'
                      : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/30 cursor-pointer'
                  }`}
                  onClick={() => !uploadedFileName && !parsing && fileRef.current?.click()}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.txt,.md"
                    onChange={e => {
                      const f = e.target.files?.[0];
                      if (f) handleFile(f);
                      e.target.value = '';
                    }}
                  />

                  {parsing ? (
                    <div className="p-4 text-center">
                      <Loader2 className="w-6 h-6 text-emerald-500 animate-spin mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Duke lexuar dokumentin...</p>
                    </div>
                  ) : uploadedFileName ? (
                    <div className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <File className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-gray-900">{uploadedFileName}</span>
                        <Check className="w-4 h-4 text-green-500" />
                        {sourceText.length > 0 && (
                          <span className="text-xs text-green-600">{sourceText.length.toLocaleString()} karaktere</span>
                        )}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRemoveFile(); }}
                        className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-gray-500">
                        <FileUp className="w-5 h-5" />
                        <span className="text-sm">Ngarko PDF ose TXT</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Extracted text preview */}
                {sourceText && !parsing && sourceText.length > 30 && (
                  <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-3 py-1.5 bg-gray-100 border-b border-gray-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-500">TEKSTI BURIMOR</span>
                      <span className="text-xs text-gray-400">{sourceText.length.toLocaleString()} karaktere</span>
                    </div>
                    <div className="p-3 max-h-28 overflow-y-auto">
                      <p className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed">
                        {sourceText.slice(0, 1200)}{sourceText.length > 1200 ? '...' : ''}
                      </p>
                    </div>
                  </div>
                )}

                {sourceText.trim().length > 20 && (
                  <div className="flex items-center gap-2 text-xs text-emerald-600">
                    <Check className="w-3.5 h-3.5" />
                    <span>AI do ta bazojë planin ditar mbi këtë material burimor</span>
                  </div>
                )}
              </div>

              {/* Generate */}
              <button onClick={handleGenerate} disabled={!topic.trim()} className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl shadow-xl disabled:opacity-40 flex items-center justify-center gap-3 text-lg hover:-translate-y-0.5 transition-all">
                <Sparkles className="w-6 h-6" /> Gjenero Planin Ditar
              </button>
            </div>
          )}

          {/* ── GENERATING ── */}
          {step === 'gen' && (
            <div className="p-10 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-8"><Loader2 className="w-12 h-12 text-emerald-600 animate-spin" /></div>
              <div className="w-full max-w-sm mb-4"><div className="w-full bg-gray-100 rounded-full h-3"><div className="bg-gradient-to-r from-emerald-500 to-teal-600 h-3 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} /></div></div>
              <p className="text-gray-600 font-medium">{msg}</p>
            </div>
          )}

          {/* ── PREVIEW ── */}
          {step === 'preview' && plan && (
            <div className="p-6 space-y-5">
              {/* Title */}
              <div className="text-center border-b-2 border-gray-300 pb-4">
                <h3 className="text-xl font-bold text-gray-900">PLAN DITAR MËSIMOR</h3>
              </div>

              {/* Meta Table */}
              <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      ['Fusha', plan.meta.fusha],
                      ['Lënda', plan.meta.lenda],
                      ['Shkalla', plan.meta.shkalla],
                      ['Klasa', plan.meta.klasa],
                      ['Tema mësimore', plan.meta.tema],
                      ['Kohëzgjatja', plan.meta.kohezgjatja],
                      ['Metodologjia', plan.meta.metodologjia],
                    ].map(([label, value], i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-2.5 font-bold text-gray-900 border-b border-gray-100 w-[180px]">{label}:</td>
                        <td className="px-4 py-2.5 text-gray-700 border-b border-gray-100">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Rezultatet */}
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200">
                <div className="flex items-center gap-2 mb-3"><ClipboardCheck className="w-5 h-5 text-emerald-600" /><h4 className="font-bold text-gray-900">Rezultatet e të nxënit të kompetencave të lëndës:</h4></div>
                <ul className="space-y-2">{plan.meta.rezultatet.map((r, i) => <li key={i} className="flex items-start gap-2 text-sm text-gray-700"><span className="text-emerald-500 mt-0.5 shrink-0">✓</span>{r}</li>)}</ul>
              </div>

              {/* Situata */}
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-200">
                <h4 className="font-bold text-gray-900 mb-2">💡 Situata e të nxënit:</h4>
                <p className="text-sm text-gray-700 italic leading-relaxed">{plan.meta.situata}</p>
              </div>

              {/* Fjale kyce + Burimet + Lidhje */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
                  <h4 className="font-bold text-gray-900 text-sm mb-2">🔑 Fjalë kyçe:</h4>
                  <div className="flex flex-wrap gap-1.5">{plan.meta.fjaleKyce.map((f, i) => <span key={i} className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">{f}</span>)}</div>
                </div>
                <div className="bg-violet-50 rounded-2xl p-4 border border-violet-200">
                  <h4 className="font-bold text-gray-900 text-sm mb-2">🔗 Lidhje ndërkurrikulare:</h4>
                  <p className="text-xs text-gray-700 leading-relaxed">{plan.meta.lidhjeNderkurrikulare}</p>
                </div>
              </div>

              {/* Burimet */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm mb-2">📚 Burimet dhe mjetet mësimore:</h4>
                <ul className="space-y-1">{plan.meta.burimet.map((b, i) => <li key={i} className="text-sm text-gray-700">• {b}</li>)}</ul>
              </div>

              {/* Phases */}
              {plan.phases.map((phase, i) => (
                <div key={i} className={`rounded-2xl border-2 ${phase.color} p-5`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2"><span className="text-xl">{phase.emoji}</span><h4 className="font-bold text-gray-900">{phase.title}</h4></div>
                    <span className="text-xs text-gray-500 bg-white/80 px-2 py-1 rounded-full">{phase.duration}</span>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{phase.content}</p>
                </div>
              ))}

              {/* Assessment Table */}
              <div className="rounded-2xl border-2 border-gray-200 overflow-hidden">
                <div className="bg-gray-800 text-white px-5 py-3 flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5" />
                  <h4 className="font-bold">VLERËSIMI SIPAS NIVELEVE</h4>
                </div>
                <div className="divide-y divide-gray-200">
                  {plan.assessment.map((a, i) => (
                    <div key={i} className={`flex ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <div className="w-[140px] shrink-0 p-4 border-r border-gray-200">
                        <span className={`inline-block px-2 py-1 rounded-lg text-xs font-bold ${
                          i === 0 ? 'bg-amber-100 text-amber-800' : i === 1 ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>{a.level}</span>
                      </div>
                      <div className="flex-1 p-4 text-sm text-gray-700 leading-relaxed">{a.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 'preview' && (
          <div className="p-5 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-3 shrink-0">
            <button onClick={() => { setStep('form'); setPlan(null); }} className="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-white">← Gjenero Tjetër</button>
            <button onClick={handleCopy} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200">
              {copied ? <><Check className="w-5 h-5 text-green-600" /> Kopjuar!</> : <><Copy className="w-5 h-5" /> Kopjo</>}
            </button>
            <button onClick={() => plan && buildPlanPdf(plan).save(`PlanDitar_${topic.replace(/\s+/g, '_')}.pdf`)}
              className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl shadow-xl flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all">
              <Download className="w-5 h-5" /> Shkarko PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
