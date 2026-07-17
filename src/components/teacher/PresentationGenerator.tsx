import { useState, useRef } from 'react';
import PptxGenJS from 'pptxgenjs';
import {
  Presentation, Sparkles, Download, X, ChevronLeft, ChevronRight,
  Loader2, BookOpen, GraduationCap, SlidersHorizontal, Eye, FileText, Radio,
  Upload, FileUp, File, Check
} from 'lucide-react';

interface Slide {
  title: string;
  bullets: string[];
  teacher_notes: string;
}

interface PresentationGeneratorProps {
  onClose: () => void;
  onStartLive?: (slides: Slide[]) => void;
}

const GEMINI_PROMPT = (topic: string, grade: string, slideCount: number, extraContext: string) => `
Ti je një mësues ekspert shqiptar. Gjenero një prezantim mësimor në gjuhën SHQIPE për temën: "${topic}".
Niveli: ${grade}.
Numri i sllajdeve: ${slideCount}.
${extraContext ? `Kontekst shtesë nga mësuesi: "${extraContext}"` : ''}

Kthe VETËM JSON-in e pastër (pa komente, pa markdown), sipas formatit:
{
  "slides": [
    {
      "title": "Titulli i sllajdit",
      "bullets": ["Pika 1", "Pika 2", "Pika 3", "Pika 4"],
      "teacher_notes": "Shënime për mësuesin se çfarë duhet shpjeguar."
    }
  ]
}

Sllajdi i parë duhet të jetë sllajdi i titullit me titullin e temës dhe pikat prezantuese.
Sllajdi i fundit duhet të jetë "Përmbledhje & Pyetje".
Çdo sllajd tjetër duhet të mbulojë një nën-temë specifike.
Bullets duhet të jenë fjali të shkurtra, të qarta, 3-4 pika.
Teacher_notes duhet të jenë 1-2 fjali me udhëzime konkrete.
`;

// Offline fallback — generates slides locally when API is not available
function generateSlidesOffline(topic: string, grade: string, slideCount: number): Slide[] {
  const slides: Slide[] = [];

  slides.push({
    title: topic,
    bullets: [
      `Prezantim mësimor — ${grade}`,
      'Objektivat e mësimit',
      'Struktura e temës',
      'Pyetje dhe diskutim'
    ],
    teacher_notes: `Prezantoni temën "${topic}" dhe shpjegoni objektivat kryesore të orës mësimore.`
  });

  const subtopics = [
    'Hyrje dhe Konteksti',
    'Konceptet Themelore',
    'Analiza e Detajuar',
    'Shembuj Praktikë',
    'Zbatimi në Praktikë',
    'Krahasime dhe Lidhje',
    'Diskutim dhe Mendim Kritik',
    'Ushtrime Praktike',
    'Zgjerim i Temës',
    'Lidhje me Jetën Reale',
    'Sfida për Nxënësit',
    'Reflektim Personal',
    'Punë në Grup',
  ];

  for (let i = 1; i < slideCount - 1; i++) {
    const subtopic = subtopics[(i - 1) % subtopics.length];
    slides.push({
      title: `${subtopic}: ${topic}`,
      bullets: [
        `Pika kryesore e parë rreth ${subtopic.toLowerCase()}`,
        `Detaj i rëndësishëm që nxënësit duhet ta kupojnë`,
        `Shembull konkret nga jeta e përditshme`,
        `Pyetje për reflektim: Si lidhet kjo me njohuritë tuaja?`
      ],
      teacher_notes: `Diskutoni ${subtopic.toLowerCase()} dhe jepni shembuj konkretë. Inkurajoni nxënësit të bëjnë pyetje.`
    });
  }

  slides.push({
    title: 'Përmbledhje & Pyetje',
    bullets: [
      'Çfarë mësuam sot?',
      'Pikat kryesore që duhet mbajtur mend',
      'Detyra: Hulumtoni më tepër rreth temës',
      'Pyetje? Komente? Diskutim i lirë!'
    ],
    teacher_notes: 'Përmblidhni pikat kryesore, merrni feedback nga nxënësit dhe caktoni detyrën.'
  });

  return slides;
}

async function generateWithGemini(topic: string, grade: string, slideCount: number, extraContext: string): Promise<Slide[]> {
  const apiKey = (typeof window !== 'undefined' && (window as any).__GEMINI_API_KEY) || '';
  
  if (!apiKey) {
    // No API key — use offline generation
    return generateSlidesOffline(topic, grade, slideCount);
  }

  const prompt = GEMINI_PROMPT(topic, grade, slideCount, extraContext);
  
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7 }
        })
      }
    );

    if (!res.ok) throw new Error('API error');

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found');
    
    const parsed = JSON.parse(jsonMatch[0]);
    return parsed.slides as Slide[];
  } catch {
    // Fallback to offline generation
    return generateSlidesOffline(topic, grade, slideCount);
  }
}

function buildPptx(slides: Slide[], topic: string) {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'SmartSchool';
  pptx.subject = topic;

  const PRIMARY = '4F46E5'; // Indigo
  const DARK = '1E293B';
  const LIGHT_BG = 'F8FAFC';
  const ACCENT = '7C3AED'; // Violet

  slides.forEach((slide, index) => {
    const s = pptx.addSlide();

    if (index === 0) {
      // ===== TITLE SLIDE =====
      s.background = { fill: PRIMARY };

      // Decorative bar
      s.addShape(pptx.ShapeType.rect, {
        x: 0, y: 0, w: '100%', h: 0.08,
        fill: { color: ACCENT }
      });

      // Logo text
      s.addText('SmartSchool', {
        x: 0.6, y: 0.4, w: 4, h: 0.5,
        fontSize: 14, color: 'FFFFFF', bold: true,
        fontFace: 'Calibri', transparency: 40
      });

      // Main title
      s.addText(slide.title, {
        x: 0.6, y: 1.8, w: 11, h: 1.5,
        fontSize: 38, color: 'FFFFFF', bold: true,
        fontFace: 'Calibri', align: 'left'
      });

      // Bullets as subtitle
      s.addText(slide.bullets.join('  •  '), {
        x: 0.6, y: 3.5, w: 11, h: 0.8,
        fontSize: 16, color: 'CCCCFF',
        fontFace: 'Calibri', align: 'left'
      });

      // Bottom bar
      s.addShape(pptx.ShapeType.rect, {
        x: 0, y: 7.1, w: '100%', h: 0.4,
        fill: { color: ACCENT }
      });

      // Notes
      s.addNotes(slide.teacher_notes);
    } else if (index === slides.length - 1) {
      // ===== LAST SLIDE =====
      s.background = { fill: PRIMARY };

      s.addText(slide.title, {
        x: 0.6, y: 1.5, w: 11, h: 1.2,
        fontSize: 34, color: 'FFFFFF', bold: true,
        fontFace: 'Calibri', align: 'center'
      });

      const bulletTexts = slide.bullets.map(b => ({
        text: b,
        options: { fontSize: 18, color: 'DDDDFF', bullet: { code: '25CF' }, paraSpaceAfter: 14 }
      }));

      s.addText(bulletTexts as any, {
        x: 2, y: 3.2, w: 8.5, h: 3,
        fontFace: 'Calibri', align: 'left', valign: 'top'
      });

      s.addText('Faleminderit! — SmartSchool', {
        x: 0, y: 6.6, w: '100%', h: 0.5,
        fontSize: 12, color: 'AAAADD',
        fontFace: 'Calibri', align: 'center'
      });

      s.addNotes(slide.teacher_notes);
    } else {
      // ===== CONTENT SLIDES =====
      s.background = { fill: LIGHT_BG };

      // Colored top band
      s.addShape(pptx.ShapeType.rect, {
        x: 0, y: 0, w: '100%', h: 0.06,
        fill: { color: PRIMARY }
      });

      // Slide number
      s.addText(`${index + 1}`, {
        x: 0.4, y: 0.3, w: 0.6, h: 0.6,
        fontSize: 16, color: 'FFFFFF', bold: true,
        fontFace: 'Calibri', align: 'center', valign: 'middle',
        fill: { color: ACCENT },
        shape: pptx.ShapeType.ellipse
      });

      // Title
      s.addText(slide.title, {
        x: 1.2, y: 0.25, w: 10.5, h: 0.7,
        fontSize: 26, color: DARK, bold: true,
        fontFace: 'Calibri', align: 'left'
      });

      // Divider line
      s.addShape(pptx.ShapeType.line, {
        x: 0.5, y: 1.15, w: 11.5, h: 0,
        line: { color: 'E2E8F0', width: 1.5 }
      });

      // Bullet points
      const bulletTexts = slide.bullets.map(b => ({
        text: b,
        options: {
          fontSize: 18,
          color: '334155',
          bullet: { code: '25B6', color: PRIMARY },
          paraSpaceAfter: 16,
          lineSpacing: 28
        }
      }));

      s.addText(bulletTexts as any, {
        x: 0.8, y: 1.5, w: 10.8, h: 4.5,
        fontFace: 'Calibri', valign: 'top'
      });

      // Footer
      s.addText(`SmartSchool  |  Sllajdi ${index + 1} / ${slides.length}`, {
        x: 0, y: 7.0, w: '100%', h: 0.4,
        fontSize: 9, color: '94A3B8',
        fontFace: 'Calibri', align: 'center'
      });

      // Speaker notes
      s.addNotes(`📝 SHËNIME PËR MËSUESIN:\n${slide.teacher_notes}`);
    }
  });

  return pptx;
}

export default function PresentationGenerator({ onClose, onStartLive }: PresentationGeneratorProps) {
  const [step, setStep] = useState<'form' | 'generating' | 'preview'>('form');
  const [formTab, setFormTab] = useState<'ai' | 'upload'>('ai');
  const [topic, setTopic] = useState('');
  const [grade, setGrade] = useState('Klasa 7');
  const [slideCount, setSlideCount] = useState(8);
  const [extraContext, setExtraContext] = useState('');
  const [slides, setSlides] = useState<Slide[]>([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [genProgress, setGenProgress] = useState(0);
  const [genMessage, setGenMessage] = useState('');

  // Upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; type: string } | null>(null);
  const [uploadedText, setUploadedText] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [parsing, setParsing] = useState(false);

  const grades = ['Klasa 1', 'Klasa 2', 'Klasa 3', 'Klasa 4', 'Klasa 5', 'Klasa 6', 'Klasa 7', 'Klasa 8', 'Klasa 9', 'Klasa 10', 'Klasa 11', 'Klasa 12'];

  // ── Parse uploaded file ──
  const handleFileUpload = async (file: globalThis.File) => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const size = file.size < 1024 * 1024
      ? `${(file.size / 1024).toFixed(0)} KB`
      : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

    setUploadedFile({ name: file.name, size, type: ext });
    setParsing(true);

    try {
      if (ext === 'txt' || ext === 'md' || ext === 'csv') {
        // Plain text files
        const text = await file.text();
        setUploadedText(text);
        if (!topic) setTopic(file.name.replace(/\.[^.]+$/, ''));
      } else if (ext === 'pdf') {
        // PDF — extract text content
        const arrayBuf = await file.arrayBuffer();
        const textContent = await extractPdfText(arrayBuf);
        setUploadedText(textContent);
        if (!topic) setTopic(file.name.replace(/\.pdf$/i, ''));
      } else if (ext === 'pptx') {
        // PPTX — extract slide texts
        const arrayBuf = await file.arrayBuffer();
        const textContent = await extractPptxText(arrayBuf);
        setUploadedText(textContent);
        if (!topic) setTopic(file.name.replace(/\.pptx?$/i, ''));
      } else if (ext === 'ppt') {
        // Old PPT format — limited support
        setUploadedText(`[Skedari ${file.name} u ngarkua. Formati .ppt i vjetër ka mbështetje të kufizuar. Rekomandohet konvertimi në .pptx]`);
        if (!topic) setTopic(file.name.replace(/\.ppt$/i, ''));
      } else if (ext === 'docx' || ext === 'doc') {
        // Word — extract text
        const arrayBuf = await file.arrayBuffer();
        const textContent = await extractDocxText(arrayBuf);
        setUploadedText(textContent);
        if (!topic) setTopic(file.name.replace(/\.docx?$/i, ''));
      } else {
        setUploadedText(`[Skedari "${file.name}" u ngarkua por formati .${ext} nuk mund të lexohet direkt. AI do ta përdorë emrin si referencë.]`);
        if (!topic) setTopic(file.name.replace(/\.[^.]+$/, ''));
      }
    } catch {
      setUploadedText(`[Gabim gjatë leximit të skedarit "${file.name}". Provoni me format tjetër.]`);
    }

    setParsing(false);
  };

  // ── Simple PDF text extraction ──
  async function extractPdfText(buffer: ArrayBuffer): Promise<string> {
    // Basic PDF text extraction — decode the bytes and find text between BT/ET markers
    // For production, use pdf.js or similar library
    const bytes = new Uint8Array(buffer);
    let text = '';
    const decoder = new TextDecoder('utf-8', { fatal: false });
    const raw = decoder.decode(bytes);

    // Extract text between parentheses in PDF streams (simplified)
    const textMatches = raw.match(/\(([^)]{2,})\)/g);
    if (textMatches) {
      const lines = textMatches
        .map(m => m.slice(1, -1))
        .filter(t => t.length > 3 && /[a-zA-ZëçÇËÀ-ÿ]/.test(t))
        .map(t => t.replace(/\\n/g, '\n').replace(/\\\(/g, '(').replace(/\\\)/g, ')'));
      text = lines.join('\n');
    }

    if (text.length < 50) {
      // Fallback — try to find readable strings
      const readable = raw.match(/[A-Za-zÀ-ÿëçÇË0-9 .,;:!?-]{10,}/g);
      text = readable ? readable.join('\n') : `[PDF me ${(buffer.byteLength / 1024).toFixed(0)} KB — përmbajtja nuk u lexua plotësisht]`;
    }

    return text.slice(0, 8000); // Limit to 8k chars for AI context
  }

  // ── Simple PPTX text extraction (PPTX = ZIP of XML files) ──
  async function extractPptxText(buffer: ArrayBuffer): Promise<string> {
    try {
      // PPTX files are ZIP archives. We look for XML content.
      const bytes = new Uint8Array(buffer);
      const decoder = new TextDecoder('utf-8', { fatal: false });
      const raw = decoder.decode(bytes);

      // Extract text from XML tags like <a:t>text</a:t>
      const textMatches = raw.match(/<a:t>([^<]+)<\/a:t>/g);
      if (textMatches && textMatches.length > 0) {
        const texts = textMatches.map(m => m.replace(/<\/?a:t>/g, '').trim()).filter(t => t.length > 0);
        return texts.join('\n');
      }

      // Fallback — find readable text
      const readable = raw.match(/[A-Za-zÀ-ÿëçÇË0-9 .,;:!?\-]{8,}/g);
      return readable ? readable.slice(0, 200).join('\n') : `[PPTX me ${(buffer.byteLength / 1024).toFixed(0)} KB]`;
    } catch {
      return '[Gabim gjatë leximit të PPTX]';
    }
  }

  // ── Simple DOCX text extraction ──
  async function extractDocxText(buffer: ArrayBuffer): Promise<string> {
    try {
      const bytes = new Uint8Array(buffer);
      const decoder = new TextDecoder('utf-8', { fatal: false });
      const raw = decoder.decode(bytes);

      // DOCX contains <w:t>text</w:t>
      const textMatches = raw.match(/<w:t[^>]*>([^<]+)<\/w:t>/g);
      if (textMatches && textMatches.length > 0) {
        const texts = textMatches.map(m => m.replace(/<\/?w:t[^>]*>/g, '').trim()).filter(t => t.length > 0);
        return texts.join(' ');
      }

      const readable = raw.match(/[A-Za-zÀ-ÿëçÇË0-9 .,;:!?\-]{8,}/g);
      return readable ? readable.slice(0, 200).join('\n') : `[DOCX me ${(buffer.byteLength / 1024).toFixed(0)} KB]`;
    } catch {
      return '[Gabim gjatë leximit të DOCX]';
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
    e.target.value = '';
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadedText('');
  };

  // ── Generate ──
  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setStep('generating');
    setGenProgress(0);

    const usingUpload = formTab === 'upload' && uploadedText;

    const stages = usingUpload
      ? [
          { p: 10, msg: 'Duke lexuar skedarin e ngarkuar...' },
          { p: 30, msg: 'Duke analizuar përmbajtjen...' },
          { p: 50, msg: 'Duke strukturuar sllajdet nga dokumenti...' },
          { p: 70, msg: 'Duke gjeneruar pikat kryesore me AI...' },
          { p: 85, msg: 'Duke shtuar shënimet e mësuesit...' },
          { p: 95, msg: 'Duke finalizuar prezantimin...' },
        ]
      : [
          { p: 15, msg: 'Duke analizuar temën...' },
          { p: 35, msg: 'Duke strukturuar sllajdet...' },
          { p: 55, msg: 'Duke gjeneruar përmbajtjen me AI...' },
          { p: 75, msg: 'Duke shtuar shënimet e mësuesit...' },
          { p: 90, msg: 'Duke finalizuar prezantimin...' },
        ];

    setGenMessage(stages[0].msg);

    for (const stage of stages) {
      await new Promise(r => setTimeout(r, 500 + Math.random() * 400));
      setGenProgress(stage.p);
      setGenMessage(stage.msg);
    }

    // Combine extra context with uploaded text
    const combinedContext = [extraContext, uploadedText].filter(Boolean).join('\n\n---\n\n');

    const result = await generateWithGemini(topic, grade, slideCount, combinedContext);
    setSlides(result);

    setGenProgress(100);
    setGenMessage('Prezantimi u krijua me sukses!');
    await new Promise(r => setTimeout(r, 500));
    setStep('preview');
    setPreviewIndex(0);
  };

  const handleDownload = async () => {
    const pptx = buildPptx(slides, topic);
    const safeName = topic.replace(/[^a-zA-ZëçÇËÜüÖöÄä0-9 ]/g, '').replace(/\s+/g, '_');
    await pptx.writeFile({ fileName: `${safeName}_SmartSchool.pptx` });
  };

  const currentSlide = slides[previewIndex];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">

        {/* ===== HEADER ===== */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Presentation className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Gjenero Prezantim me AI</h2>
              <p className="text-xs text-gray-500">Krijoni sllajde profesionale në sekonda</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* ===== CONTENT ===== */}
        <div className="flex-1 overflow-y-auto">

          {/* ── FORM STEP ── */}
          {step === 'form' && (
            <div className="p-6 space-y-5">
              {/* Tabs — AI vs Upload */}
              <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
                <button
                  onClick={() => setFormTab('ai')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    formTab === 'ai'
                      ? 'bg-white text-violet-700 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Gjenero me AI
                </button>
                <button
                  onClick={() => setFormTab('upload')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    formTab === 'upload'
                      ? 'bg-white text-violet-700 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  Ngarko Skedar
                </button>
              </div>

              {/* ── UPLOAD TAB ── */}
              {formTab === 'upload' && (
                <div className="space-y-4">
                  {/* Drop zone */}
                  <div
                    className={`relative border-2 border-dashed rounded-2xl transition-all duration-200 cursor-pointer ${
                      dragActive
                        ? 'border-violet-500 bg-violet-50 scale-[1.01]'
                        : uploadedFile
                        ? 'border-green-300 bg-green-50/50'
                        : 'border-gray-200 hover:border-violet-300 hover:bg-violet-50/30'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => !uploadedFile && fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.md"
                      onChange={handleFileInputChange}
                    />

                    {parsing ? (
                      <div className="p-8 text-center">
                        <Loader2 className="w-10 h-10 text-violet-500 animate-spin mx-auto mb-3" />
                        <p className="text-sm font-medium text-gray-600">Duke lexuar skedarin...</p>
                      </div>
                    ) : uploadedFile ? (
                      <div className="p-5">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center shrink-0">
                            {uploadedFile.type === 'pdf' && <FileText className="w-7 h-7 text-red-500" />}
                            {(uploadedFile.type === 'pptx' || uploadedFile.type === 'ppt') && <Presentation className="w-7 h-7 text-orange-500" />}
                            {(uploadedFile.type === 'docx' || uploadedFile.type === 'doc') && <FileText className="w-7 h-7 text-blue-500" />}
                            {!['pdf', 'pptx', 'ppt', 'docx', 'doc'].includes(uploadedFile.type) && <File className="w-7 h-7 text-gray-500" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900 truncate">{uploadedFile.name}</span>
                              <Check className="w-4 h-4 text-green-500 shrink-0" />
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                              <span>{uploadedFile.size}</span>
                              <span>•</span>
                              <span className="uppercase font-medium">{uploadedFile.type}</span>
                              {uploadedText && (
                                <>
                                  <span>•</span>
                                  <span className="text-green-600">{uploadedText.length.toLocaleString()} karaktere lexuar</span>
                                </>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleRemoveFile(); }}
                            className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center mx-auto mb-3">
                          <FileUp className="w-7 h-7 text-violet-600" />
                        </div>
                        <p className="font-semibold text-gray-900 mb-1">Tërhiqni skedarin këtu</p>
                        <p className="text-sm text-gray-500 mb-3">ose klikoni për ta zgjedhur</p>
                        <div className="flex flex-wrap justify-center gap-2">
                          {['PDF', 'PPT', 'PPTX', 'DOCX', 'TXT'].map(f => (
                            <span key={f} className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-medium rounded">{f}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Extracted text preview */}
                  {uploadedText && (
                    <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                      <div className="px-4 py-2 bg-gray-100 border-b border-gray-200 flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-600">PËRMBAJTJA E NXJERRË</span>
                        <span className="text-xs text-gray-400">{uploadedText.length.toLocaleString()} karaktere</span>
                      </div>
                      <div className="p-4 max-h-32 overflow-y-auto">
                        <p className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed">
                          {uploadedText.slice(0, 1500)}{uploadedText.length > 1500 ? '...' : ''}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Topic (visible for both tabs) ── */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <BookOpen className="w-4 h-4 text-violet-500" />
                  {formTab === 'upload' ? 'Tema / Titulli i Prezantimit' : 'Tema e Prezantimit'}
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none text-lg"
                  placeholder={formTab === 'upload' ? 'p.sh. Titulli nga skedari ose shkruani vetë...' : 'p.sh. Revolucioni Francez, Sistemi Diellor...'}
                />
              </div>

              {/* Grade & Slide Count */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <GraduationCap className="w-4 h-4 text-violet-500" />
                    Klasa
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none"
                  >
                    {grades.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <SlidersHorizontal className="w-4 h-4 text-violet-500" />
                    Numri i Sllajdeve ({slideCount})
                  </label>
                  <input
                    type="range"
                    min={4}
                    max={15}
                    value={slideCount}
                    onChange={(e) => setSlideCount(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-600 mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>4</span>
                    <span>15</span>
                  </div>
                </div>
              </div>

              {/* Extra Context — only for AI tab */}
              {formTab === 'ai' && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FileText className="w-4 h-4 text-violet-500" />
                    Kontekst Shtesë (Opsionale)
                  </label>
                  <textarea
                    value={extraContext}
                    onChange={(e) => setExtraContext(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none resize-none"
                    rows={3}
                    placeholder="Ngjisni tekst nga libri, shënime shtesë, ose lëreni bosh..."
                  />
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={!topic.trim() || (formTab === 'upload' && !uploadedFile)}
                className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-xl shadow-xl shadow-violet-200 hover:shadow-violet-300 hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-3 text-lg"
              >
                <Sparkles className="w-6 h-6" />
                {formTab === 'upload' ? 'Gjenero nga Skedari' : 'Gjenero Prezantimin'}
              </button>

              {/* Info */}
              <div className="flex items-start gap-3 p-4 bg-violet-50 rounded-xl border border-violet-100">
                <Sparkles className="w-5 h-5 text-violet-500 mt-0.5 shrink-0" />
                <div className="text-sm text-violet-700">
                  {formTab === 'upload' ? (
                    <><strong>Ngarko & Gjenero:</strong> Ngarkoni një PPT, PDF ose Word — AI lexon përmbajtjen dhe krijon sllajde të reja interaktive bazuar në materialin tuaj.</>
                  ) : (
                    <><strong>Si funksionon:</strong> AI gjeneron sllajdet me tituj, pika kryesore dhe shënime për mësuesin. Pastaj mund ta shkarkoni si <strong>.pptx</strong> ose ta filloni <strong>Live</strong>.</>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── GENERATING STEP ── */}
          {step === 'generating' && (
            <div className="p-10 flex flex-col items-center justify-center min-h-[400px]">
              {/* Spinning brain */}
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center">
                  <Loader2 className="w-12 h-12 text-violet-600 animate-spin" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white animate-bounce">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>

              {/* Progress */}
              <div className="w-full max-w-sm mb-4">
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-violet-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${genProgress}%` }}
                  />
                </div>
              </div>
              <p className="text-gray-500 font-medium text-center">{genMessage}</p>
              <p className="text-xs text-gray-400 mt-2">Tema: "{topic}" · {slideCount} sllajde · {grade}</p>
            </div>
          )}

          {/* ── PREVIEW STEP ── */}
          {step === 'preview' && currentSlide && (
            <div className="p-6 space-y-5">
              {/* Slide Preview Card */}
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
                {/* Slide content */}
                <div className={`p-8 min-h-[280px] ${
                  previewIndex === 0 || previewIndex === slides.length - 1
                    ? 'bg-gradient-to-br from-indigo-600 to-violet-700 text-white'
                    : 'bg-gradient-to-br from-slate-50 to-white text-gray-900'
                }`}>
                  {/* Slide number badge */}
                  <div className="flex items-center justify-between mb-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      previewIndex === 0 || previewIndex === slides.length - 1
                        ? 'bg-white/20 text-white'
                        : 'bg-violet-100 text-violet-700'
                    }`}>
                      Sllajdi {previewIndex + 1} / {slides.length}
                    </span>
                    {previewIndex === 0 && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20">Titulli</span>
                    )}
                    {previewIndex === slides.length - 1 && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20">Fundi</span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className={`text-2xl font-bold mb-5 ${
                    previewIndex === 0 || previewIndex === slides.length - 1 ? '' : 'text-gray-900'
                  }`}>
                    {currentSlide.title}
                  </h3>

                  {/* Bullets */}
                  <ul className="space-y-3">
                    {currentSlide.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                          previewIndex === 0 || previewIndex === slides.length - 1
                            ? 'bg-violet-300'
                            : 'bg-violet-500'
                        }`} />
                        <span className={`text-base leading-relaxed ${
                          previewIndex === 0 || previewIndex === slides.length - 1
                            ? 'text-indigo-100'
                            : 'text-gray-700'
                        }`}>
                          {bullet}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Teacher notes panel */}
                <div className="p-4 bg-amber-50 border-t border-amber-100">
                  <div className="flex items-start gap-2">
                    <Eye className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-amber-700 mb-1">SHËNIME PËR MËSUESIN</div>
                      <p className="text-sm text-amber-800">{currentSlide.teacher_notes}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setPreviewIndex(Math.max(0, previewIndex - 1))}
                  disabled={previewIndex === 0}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Para
                </button>

                {/* Slide dots */}
                <div className="flex items-center gap-1.5 flex-wrap justify-center max-w-xs">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPreviewIndex(i)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        i === previewIndex
                          ? 'bg-violet-600 scale-125'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setPreviewIndex(Math.min(slides.length - 1, previewIndex + 1))}
                  disabled={previewIndex === slides.length - 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Tjetra
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Slide list mini */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <h4 className="text-sm font-bold text-gray-700 mb-3">Të gjitha sllajdet:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {slides.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setPreviewIndex(i)}
                      className={`text-left p-3 rounded-xl border-2 transition-all text-xs ${
                        i === previewIndex
                          ? 'border-violet-500 bg-violet-50'
                          : 'border-transparent bg-white hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-bold text-gray-700 truncate">{i + 1}. {s.title}</div>
                      <div className="text-gray-400 mt-1 truncate">{s.bullets[0]}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ===== FOOTER ===== */}
        {step === 'preview' && (
          <div className="p-5 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => { setStep('form'); setSlides([]); }}
              className="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-white transition-colors"
            >
              ← Gjenero Tjetër
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-xl shadow-xl shadow-violet-200 hover:shadow-violet-300 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Shkarko .pptx
            </button>
            {onStartLive && (
              <button
                onClick={() => onStartLive(slides)}
                className="flex-1 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold rounded-xl shadow-xl shadow-red-200 hover:shadow-red-300 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <Radio className="w-5 h-5" />
                Fillo Live
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
