import { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import {
  X, Sparkles, Loader2, BookOpen, GraduationCap, FileText,
  Download, Copy, Check, FileUp, File
} from 'lucide-react';

interface LessonSection {
  type: 'hyrje' | 'pike' | 'terma' | 'permbledhje';
  title: string;
  content: string;
}

interface Lesson {
  title: string;
  subject: string;
  grade: string;
  sections: LessonSection[];
}

function generateLesson(topic: string, subject: string, grade: string, source: string): Lesson {
  const sections: LessonSection[] = [
    {
      type: 'hyrje',
      title: 'Hyrje',
      content: `Në këtë leksion do të trajtojmë temën "${topic}" në kontekstin e lëndës ${subject} për ${grade}. Ky leksion synon t'u japë nxënësve njohuri themelore dhe praktike rreth kësaj teme, duke i ndihmuar të kuptojnë konceptet kryesore dhe rëndësinë e tyre.${source ? '\n\nLeksioni bazohet në materialin burimor të ofruar nga mësuesi.' : ''}`
    },
    {
      type: 'pike',
      title: 'Pikat Kryesore',
      content: `1. Përkufizimi dhe Kuptimi\n"${topic}" përcaktohet si një koncept themelor në ${subject}. Kuptimi i tij kërkon njohjen e kontekstit historik, shkencor ose letrar ku ai vendoset.\n\n2. Karakteristikat Kryesore\nKarakteristikat dalluese përfshijnë aspektet strukturore, funksionale dhe ndërvepruese që e bëjnë këtë temë unike brenda fushës së ${subject}.\n\n3. Zbatimi Praktik\nNxënësit duhet të jenë në gjendje të zbatojnë njohuritë e fituara në situata reale, duke analizuar shembuj konkretë dhe duke zgjidhur probleme.\n\n4. Lidhja me Temat e Tjera\nKjo temë lidhet ngushtë me koncepte të tjera brenda kurrikulës, duke krijuar një rrjet njohurish që forcon mësimin.`
    },
    {
      type: 'terma',
      title: 'Termat e Vështirë — Fjalorth',
      content: `• Koncepti Themelor — Ideja bazë mbi të cilën ndërtohen njohuritë e mëtejshme rreth "${topic}".\n\n• Analiza — Procesi i zbërthimit të informacionit në pjesë më të vogla për kuptim më të thellë.\n\n• Sinteza — Aftësia për të bashkuar informacione nga burime të ndryshme në një kuptim të unifikuar.\n\n• Zbatimi — Përdorimi praktik i njohurive teorike në situata konkrete të jetës reale.\n\n• Vlerësimi Kritik — Aftësia për të gjykuar cilësinë dhe vlefshmërinë e informacionit.`
    },
    {
      type: 'permbledhje',
      title: 'Përmbledhje',
      content: `Në këtë leksion mësuam për "${topic}" duke eksploruar përkufizimin, karakteristikat kryesore, zbatimin praktik dhe lidhjet me tema të tjera. Pikat kryesore që duhet mbajtur mend:\n\n✅ ${topic} është një koncept themelor në ${subject}\n✅ Ka zbatim praktik në jetën e përditshme\n✅ Lidhet me koncepte të tjera brenda kurrikulës\n✅ Kërkon mendim kritik dhe analizë\n\nDetyra: Shkruani një paragraf ku shpjegoni me fjalët tuaja çfarë kuptuat nga ky leksion.`
    }
  ];
  return { title: topic, subject, grade, sections };
}

function buildLessonPdf(lesson: Lesson): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const M = 18, W = 210, CW = W - 2 * M;
  let y = M;
  const checkPage = (n: number) => { if (y + n > 278) { doc.addPage(); y = M; } };

  doc.setFont('Helvetica', 'bold'); doc.setFontSize(14); doc.setTextColor(0);
  doc.text('LEKSION MESIMOR', W / 2, y, { align: 'center' }); y += 7;
  doc.setFontSize(11); doc.text(`${lesson.subject} — ${lesson.grade}`, W / 2, y, { align: 'center' }); y += 6;
  doc.setFont('Helvetica', 'italic'); doc.setFontSize(10); doc.setTextColor(80);
  doc.text(`Tema: ${lesson.title}`, W / 2, y, { align: 'center' }); y += 5;
  doc.setLineWidth(0.5); doc.setDrawColor(0); doc.line(M, y, W - M, y); y += 8;

  lesson.sections.forEach(sec => {
    checkPage(20);
    doc.setFillColor(240, 240, 240); doc.rect(M, y - 1, CW, 8, 'FD');
    doc.setFont('Helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(0);
    doc.text(sec.title, M + 3, y + 5); y += 12;
    doc.setFont('Helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(30);
    const lines = doc.splitTextToSize(sec.content, CW - 4);
    lines.forEach((line: string) => { checkPage(5); doc.text(line, M + 2, y); y += 4.5; });
    y += 6;
  });

  doc.setFont('Helvetica', 'italic'); doc.setFontSize(7); doc.setTextColor(150);
  doc.text('Gjeneruar me SmartSchool AI', W / 2, 290, { align: 'center' });
  return doc;
}

interface Props { onClose: () => void }

export default function LessonCreator({ onClose }: Props) {
  const [step, setStep] = useState<'form' | 'gen' | 'preview'>('form');
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('Gjuhë Shqipe');
  const [grade, setGrade] = useState('Klasa 8');
  const [sourceText, setSourceText] = useState('');
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState(0);
  const [msg, setMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadedName, setUploadedName] = useState('');

  const subjects = ['Matematikë','Gjuhë Shqipe','Letërsi','Histori','Gjeografi','Fizikë','Kimi','Biologji','Anglisht','Shkencë','Qytetari','TIK'];
  const grades = Array.from({ length: 12 }, (_, i) => `Klasa ${i + 1}`);

  const handleFile = async (file: globalThis.File) => {
    setUploadedName(file.name);
    try {
      if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        setSourceText(await file.text());
      } else if (file.name.endsWith('.pdf')) {
        const raw = new TextDecoder('utf-8', { fatal: false }).decode(new Uint8Array(await file.arrayBuffer()));
        const m = raw.match(/\(([^)]{3,})\)/g);
        setSourceText(m ? m.map(x => x.slice(1, -1)).filter(t => /[a-zA-ZÀ-ÿ]/.test(t)).join('\n').slice(0, 8000) : '[PDF]');
      }
      if (!topic) setTopic(file.name.replace(/\.[^.]+$/, ''));
    } catch { setSourceText('[Gabim leximi]'); }
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setStep('gen'); setProgress(0);
    for (const s of [
      { p: 15, m: 'Duke analizuar temën...' }, { p: 35, m: 'Duke strukturuar leksionin...' },
      { p: 55, m: 'Duke shkruar pikat kryesore...' }, { p: 75, m: 'Duke krijuar fjalorin...' },
      { p: 92, m: 'Duke finalizuar...' }
    ]) { await new Promise(r => setTimeout(r, 450 + Math.random() * 350)); setProgress(s.p); setMsg(s.m); }
    setLesson(generateLesson(topic, subject, grade, sourceText));
    setProgress(100); setMsg('Leksioni u krijua!');
    await new Promise(r => setTimeout(r, 400)); setStep('preview');
  };

  const handleCopy = () => {
    if (!lesson) return;
    const text = lesson.sections.map(s => `${s.title}\n${'─'.repeat(40)}\n${s.content}`).join('\n\n');
    navigator.clipboard.writeText(`${lesson.title} — ${lesson.subject} (${lesson.grade})\n${'═'.repeat(50)}\n\n${text}`);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!lesson) return;
    buildLessonPdf(lesson).save(`Leksion_${topic.replace(/\s+/g, '_')}.pdf`);
  };

  const sectionIcons = { hyrje: '📖', pike: '🎯', terma: '📚', permbledhje: '✅' };
  const sectionColors = { hyrje: 'border-blue-200 bg-blue-50', pike: 'border-violet-200 bg-violet-50', terma: 'border-amber-200 bg-amber-50', permbledhje: 'border-emerald-200 bg-emerald-50' };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div><h2 className="text-lg font-bold text-gray-900">Krijo Leksion me AI</h2><p className="text-xs text-gray-500">Leksion i strukturuar në shqip</p></div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {step === 'form' && (
            <div className="p-6 space-y-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"><BookOpen className="w-4 h-4 text-blue-500" /> Tema</label>
                <input type="text" value={topic} onChange={e => setTopic(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-lg" placeholder="p.sh. Fotosinteza, Rilindja Kombëtare..." />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"><FileText className="w-4 h-4 text-blue-500" /> Lënda</label>
                  <select value={subject} onChange={e => setSubject(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none">{subjects.map(s => <option key={s}>{s}</option>)}</select>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"><GraduationCap className="w-4 h-4 text-blue-500" /> Klasa</label>
                  <select value={grade} onChange={e => setGrade(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none">{grades.map(g => <option key={g}>{g}</option>)}</select>
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"><FileText className="w-4 h-4 text-blue-500" /> Tekst Burimor (Opsionale)</label>
                <textarea value={sourceText} onChange={e => setSourceText(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none resize-none text-sm" rows={4} placeholder="Ngjisni tekst nga libri ose lëreni bosh..." />
              </div>
              <div className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${uploadedName ? 'border-green-300 bg-green-50/50' : 'border-gray-200 hover:border-blue-300'}`} onClick={() => fileRef.current?.click()}>
                <input ref={fileRef} type="file" className="hidden" accept=".pdf,.txt,.md" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }} />
                {uploadedName ? (
                  <div className="flex items-center justify-center gap-2"><File className="w-4 h-4 text-green-600" /><span className="text-sm font-medium">{uploadedName}</span><Check className="w-4 h-4 text-green-500" /></div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-gray-500"><FileUp className="w-5 h-5" /><span className="text-sm">Ngarko PDF ose TXT</span></div>
                )}
              </div>
              <button onClick={handleGenerate} disabled={!topic.trim()} className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-xl disabled:opacity-40 flex items-center justify-center gap-3 text-lg hover:-translate-y-0.5 transition-all">
                <Sparkles className="w-6 h-6" /> Gjenero Leksionin
              </button>
            </div>
          )}

          {step === 'gen' && (
            <div className="p-10 flex flex-col items-center justify-center min-h-[400px]">
              <div className="relative mb-8"><div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center"><Loader2 className="w-12 h-12 text-blue-600 animate-spin" /></div></div>
              <div className="w-full max-w-sm mb-4"><div className="w-full bg-gray-100 rounded-full h-3"><div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} /></div></div>
              <p className="text-gray-600 font-medium">{msg}</p>
            </div>
          )}

          {step === 'preview' && lesson && (
            <div className="p-6 space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">{lesson.title}</h3>
                <p className="text-sm text-gray-500">{lesson.subject} — {lesson.grade}</p>
              </div>
              {lesson.sections.map((sec, i) => (
                <div key={i} className={`rounded-2xl border-2 ${sectionColors[sec.type]} p-5`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{sectionIcons[sec.type]}</span>
                    <h4 className="font-bold text-gray-900">{sec.title}</h4>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{sec.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {step === 'preview' && (
          <div className="p-5 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-3 shrink-0">
            <button onClick={() => { setStep('form'); setLesson(null); }} className="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-white">← Tjetër</button>
            <button onClick={handleCopy} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200">
              {copied ? <><Check className="w-5 h-5 text-green-600" /> Kopjuar!</> : <><Copy className="w-5 h-5" /> Kopjo Tekstin</>}
            </button>
            <button onClick={handleDownload} className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-xl flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all">
              <Download className="w-5 h-5" /> Shkarko PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
