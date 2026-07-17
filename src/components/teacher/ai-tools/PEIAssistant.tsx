import { useState, useRef } from 'react';
import { X, Sparkles, Loader2, Copy, Check, Heart, FileUp, File } from 'lucide-react';

const DIFFICULTY_TYPES = [
  { id: 'lexim', label: 'Vështirësi në lexim', emoji: '📖' },
  { id: 'shkrim', label: 'Vështirësi në shkrim', emoji: '✏️' },
  { id: 'matematike', label: 'Vështirësi në matematikë', emoji: '🔢' },
  { id: 'vemendje', label: 'Vështirësi në vëmendje', emoji: '🎯' },
  { id: 'sociale', label: 'Vështirësi sociale', emoji: '🤝' },
  { id: 'te-pergjithshme', label: 'Të përgjithshme', emoji: '📋' },
];

function adaptMaterial(text: string, difficulty: string): string {
  const lines = text.split(/[.!?\n]+/).map(s => s.trim()).filter(s => s.length > 5);
  const simplified = lines.slice(0, 8).map(l => `• ${l.length > 80 ? l.slice(0, 80) + '...' : l}`).join('\n\n');
  
  return `═══ MATERIALI I PËRSHTATUR (PEI) ═══

📝 TEKSTI I THJESHTUAR:
${simplified}

🎯 OBJEKTIVAT E PËRSHTATURA:
• Nxënësi identifikon 2-3 konceptet kryesore
• Nxënësi shpjegon me fjalë të thjeshta idenë bazë
• Nxënësi lidh konceptin me një shembull nga jeta

🎮 AKTIVITETE TË SUGJERUARA:
${difficulty === 'lexim' ? '• Lexim me zë i lartë me ndihmë\n• Përdorimi i imazheve përcjellëse\n• Audio-libra ose tekst i regjistruar\n• Fjalë kyçe me ngjyra të ndryshme' :
  difficulty === 'shkrim' ? '• Plotësim fjalie të gatshme\n• Vizatim + shkrim i shkurtër\n• Përdorimi i shablloneve\n• Diktim me ritëm të ngadaltë' :
  difficulty === 'matematike' ? '• Materiale manipuluese (kube, shufra)\n• Probleme me imazhe\n• Hapa të zbërthyera me ngjyra\n• Lojëra matematikore interaktive' :
  difficulty === 'vemendje' ? '• Detyra të shkurtra (5-10 minuta)\n• Pauza të shpeshta\n• Udhëzime me pika (checklist)\n• Vend i qetë pa shpërqendrime' :
  '• Punë në çifte me shok mbështetës\n• Role-play dhe dramatizim\n• Detyra me zgjedhje\n• Aktivitete multi-sensoriale'}

⏱️ STRUKTURIMI I KOHËS:
• Hyrje e shkurtër: 3 minuta
• Aktivitet kryesor: 15 minuta (me pauza)
• Punë praktike: 10 minuta
• Reflektim: 2 minuta

💡 KËSHILLA PËR MËSUESIN:
• Përdorni gjuhë të thjeshtë dhe fjali të shkurtra
• Jepni udhëzime një nga një, jo të gjitha njëherësh
• Lavdëroni përpjekjen, jo vetëm rezultatin
• Bashkëpunoni me prindërit për vazhdimësi`;
}

interface Props { onClose: () => void }

export default function PEIAssistant({ onClose }: Props) {
  const [text, setText] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');

  const handleFile = async (file: globalThis.File) => {
    setFileName(file.name);
    try {
      if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        setText(await file.text());
      } else if (file.name.endsWith('.pdf')) {
        const raw = new TextDecoder('utf-8', { fatal: false }).decode(new Uint8Array(await file.arrayBuffer()));
        const m = raw.match(/\(([^)]{3,})\)/g);
        setText(m ? m.map(x => x.slice(1, -1)).filter(t => /[a-zA-ZÀ-ÿ]/.test(t)).join(' ').slice(0, 5000) : '[PDF i ngarkuar]');
      }
    } catch { setText('[Gabim leximi]'); }
  };

  const handleGenerate = async () => {
    if (!text.trim() || !difficulty) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000));
    setResult(adaptMaterial(text, difficulty));
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center"><Heart className="w-5 h-5 text-white" /></div>
            <div><h2 className="text-lg font-bold text-gray-900">Asistenti PEI</h2><p className="text-xs text-gray-500">Përshtatje materialesh për edukimin special</p></div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Lloji i Vështirësisë</label>
            <div className="grid grid-cols-3 gap-2">
              {DIFFICULTY_TYPES.map(d => (
                <button key={d.id} onClick={() => setDifficulty(d.id)}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${difficulty === d.id ? 'border-rose-500 bg-rose-50' : 'border-gray-100 hover:border-gray-200'}`}>
                  <div className="text-xl mb-1">{d.emoji}</div>
                  <div className="text-xs font-semibold text-gray-700">{d.label}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Materiali Mësimor</label>
            <textarea value={text} onChange={e => setText(e.target.value)} rows={5}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-500 outline-none resize-none text-sm"
              placeholder="Ngjisni tekstin mësimor që dëshironi ta përshtasni..." />
          </div>
          <div className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all ${fileName ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-rose-300'}`} onClick={() => fileRef.current?.click()}>
            <input ref={fileRef} type="file" className="hidden" accept=".pdf,.txt" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }} />
            {fileName ? <div className="flex items-center justify-center gap-2"><File className="w-4 h-4 text-green-600" /><span className="text-sm">{fileName}</span><Check className="w-4 h-4 text-green-500" /></div>
            : <div className="flex items-center justify-center gap-2 text-gray-500"><FileUp className="w-4 h-4" /><span className="text-sm">Ngarko PDF ose TXT</span></div>}
          </div>
          <button onClick={handleGenerate} disabled={!text.trim() || !difficulty || loading}
            className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-xl shadow-lg disabled:opacity-40 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {loading ? 'Duke përshtatur...' : 'Përshtat Materialin'}
          </button>
          {result && (
            <div className="space-y-3">
              <div className="bg-rose-50 rounded-2xl p-5 border border-rose-200"><p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{result}</p></div>
              <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl flex items-center justify-center gap-2">
                {copied ? <><Check className="w-5 h-5 text-green-600" /> Kopjuar!</> : <><Copy className="w-5 h-5" /> Kopjo</>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
