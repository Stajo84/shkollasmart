import { useState } from 'react';
import { X, Sparkles, Loader2, Copy, Check, MessageSquare } from 'lucide-react';

const LEVELS = [
  { id: 'ekselent', label: 'Ekselent', emoji: '🌟', color: 'border-emerald-500 bg-emerald-50 text-emerald-700' },
  { id: 'shume-mire', label: 'Shumë mirë', emoji: '✅', color: 'border-blue-500 bg-blue-50 text-blue-700' },
  { id: 'mesatar', label: 'Mesatar', emoji: '📊', color: 'border-amber-500 bg-amber-50 text-amber-700' },
  { id: 'permiresim', label: 'Ka nevojë për përmirësim', emoji: '📝', color: 'border-red-500 bg-red-50 text-red-700' },
];

const COMMENTS: Record<string, (kw: string) => string> = {
  'ekselent': (kw) => `Nxënësi/ja demonstron arritje të shkëlqyera në të gjitha fushat e vlerësuara. Shfaq aftësi të jashtëzakonshme në ${kw || 'të menduarit kritik dhe punën e pavarur'}. Merr pjesë aktivisht në diskutime, tregon iniciativë dhe ndihmon shokët e klasës. Rezultatet akademike janë vazhdimisht mbi mesataren e klasës. Rekomandohet inkurajimi i vazhdueshëm dhe dhënia e detyrave sfiduese për ta mbajtur motivimin e lartë. Nxënësi/ja është model pozitiv për klasën.`,
  'shume-mire': (kw) => `Nxënësi/ja tregon përparim të qëndrueshëm dhe arritje shumë të mira në shumicën e objektivave. ${kw ? `Dallohet veçanërisht në ${kw}.` : 'Tregon përkushtim dhe përgjegjësi ndaj detyrave.'} Pjesëmarrja në klasë është e rregullt dhe konstruktive. Ka aftësi të mira komunikimi dhe bashkëpunon mirë me shokët. Për të arritur nivelin ekselent, sugjerohet thellimi i analizës kritike dhe rritja e pavarësisë në zgjidhjen e problemeve komplekse.`,
  'mesatar': (kw) => `Nxënësi/ja plotëson kërkesat bazë të kurrikulës dhe tregon njohuri mesatare. ${kw ? `Pikat që kërkojnë vëmendje: ${kw}.` : 'Ka nevojë për më shumë angazhim në aktivitetet e klasës.'} Sugjerohet punë shtesë në fushat ku has vështirësi, sidomos në zbatimin praktik të njohurive. Inkurajohet pjesëmarrja më aktive në diskutime dhe dorëzimi i rregullt i detyrave. Bashkëpunimi me familjen për ndjekjen e progresit është i rëndësishëm.`,
  'permiresim': (kw) => `Nxënësi/ja ka nevojë për mbështetje të vazhdueshme për të arritur objektivat minimale. ${kw ? `Fushat kryesore që kërkojnë ndërhyrje: ${kw}.` : 'Vështirësi të dukshme në përvetësimin e koncepteve bazë.'} Rekomandohet hartimi i një plani individual mbështetës me aktivitete të diferencuara. Nevojitet bashkëpunim i ngushtë me familjen dhe, nëse është e nevojshme, konsultim me psikologun e shkollës. Duhet inkurajuar çdo arritje, sado e vogël, për të rritur vetëbesimin.`,
};

interface Props { onClose: () => void }

export default function SMIPComments({ onClose }: Props) {
  const [level, setLevel] = useState('');
  const [keywords, setKeywords] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [subject, setSubject] = useState('');

  const handleGenerate = async () => {
    if (!level) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
    const fn = COMMENTS[level];
    let result = fn(keywords);
    if (subject) result = `[${subject}] ${result}`;
    setComment(result);
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(comment);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center"><MessageSquare className="w-5 h-5 text-white" /></div>
            <div><h2 className="text-lg font-bold text-gray-900">Komente për SMIP</h2><p className="text-xs text-gray-500">Komente zyrtare për regjistrin digjital</p></div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Niveli i Arritjes</label>
            <div className="grid grid-cols-2 gap-2">
              {LEVELS.map(l => (
                <button key={l.id} onClick={() => setLevel(l.id)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${level === l.id ? l.color : 'border-gray-100 hover:border-gray-200'}`}>
                  <div className="flex items-center gap-2"><span className="text-xl">{l.emoji}</span><span className="text-sm font-semibold">{l.label}</span></div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Lënda (Opsionale)</label>
            <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 outline-none text-sm" placeholder="p.sh. Matematikë, Gjuhë Shqipe..." />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Fjalë Kyçe (Opsionale)</label>
            <input type="text" value={keywords} onChange={e => setKeywords(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 outline-none text-sm" placeholder="p.sh. aktiv në grup, ngec te shkrimi, matematikë e fortë..." />
          </div>
          <button onClick={handleGenerate} disabled={!level || loading}
            className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold rounded-xl shadow-lg disabled:opacity-40 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {loading ? 'Duke gjeneruar...' : 'Gjenero Komentin'}
          </button>
          {comment && (
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{comment}</p>
              </div>
              <button onClick={handleCopy} className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors">
                {copied ? <><Check className="w-5 h-5 text-green-600" /> Kopjuar!</> : <><Copy className="w-5 h-5" /> Kopjo Komentin</>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
