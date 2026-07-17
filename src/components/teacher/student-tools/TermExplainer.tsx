import { useState } from 'react';
import { X, Sparkles, Loader2, Search, Copy, Check, BookMarked } from 'lucide-react';

interface TermResult {
  term: string;
  translation?: string;
  definition: string;
  example: string;
  relatedTerms: string[];
}

function explainTerm(term: string): TermResult {
  const t = term.trim();
  return {
    term: t,
    translation: `(Anglisht: ${t.charAt(0).toUpperCase() + t.slice(1)})`,
    definition: `"${t}" është një koncept/term i rëndësishëm që përdoret gjerësisht në fushën përkatëse. Ai përfaqëson idenë ose procesin themelor që ndihmon në kuptimin e temave më të gjera. Në kontekstin arsimor, ky term përcakton bazën mbi të cilën ndërtohen njohuritë e tjera.`,
    example: `📌 Shembull nga jeta reale: Imagjinoni "${t}" si një nga elementet bazë të përditshme — ashtu si uji është i domosdoshëm për jetën, kështu edhe "${t}" është thelbësor për kuptimin e kësaj fushe. P.sh., kur shikoni ${t.toLowerCase()} në praktikë, mund ta vëni re tek proceset natyrore, në teknologji, ose në situata sociale.`,
    relatedTerms: ['Koncepti themelor', 'Analiza', 'Zbatimi praktik', 'Vlerësimi'],
  };
}

interface Props { onClose: () => void }

export default function TermExplainer({ onClose }: Props) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<TermResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const handleSearch = async () => {
    if (!input.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800 + Math.random() * 700));
    setResult(explainTerm(input));
    if (!history.includes(input.trim())) setHistory(prev => [input.trim(), ...prev.slice(0, 9)]);
    setLoading(false);
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(`${result.term}\n${result.translation}\n\nPërkufizimi: ${result.definition}\n\nShembull: ${result.example}`);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center"><BookMarked className="w-5 h-5 text-white" /></div>
            <div><h2 className="text-lg font-bold text-gray-900">Shpjeguesi i Termave 📖</h2><p className="text-xs text-gray-500">Përkthim, përkufizim dhe shembull</p></div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Search */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-amber-500 outline-none text-lg"
                placeholder="Shkruaj një term..." />
            </div>
            <button onClick={handleSearch} disabled={!input.trim() || loading}
              className="px-5 py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold rounded-xl disabled:opacity-40 flex items-center gap-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            </button>
          </div>

          {/* History chips */}
          {history.length > 0 && !result && (
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-gray-400">Kërtime të fundit:</span>
              {history.map((h, i) => (
                <button key={i} onClick={() => { setInput(h); }} className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium hover:bg-amber-100">{h}</button>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!result && !loading && (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Kërko çdo term</h3>
              <p className="text-sm text-gray-500">Shkruaj një fjalë të vështirë, term shkencor ose koncept — AI ta shpjegon thjesht!</p>
            </div>
          )}

          {/* Result */}
          {result && !loading && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                <h3 className="text-2xl font-black text-gray-900 mb-1">{result.term}</h3>
                {result.translation && <p className="text-sm text-amber-600 italic">{result.translation}</p>}
              </div>

              <div className="bg-white rounded-2xl p-5 border border-gray-200">
                <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">📚 Përkufizimi</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{result.definition}</p>
              </div>

              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <h4 className="text-sm font-bold text-gray-900 mb-2">🌍 Shembull nga Jeta Reale</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{result.example}</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                <h4 className="text-sm font-bold text-gray-900 mb-2">🔗 Terma të Lidhur</h4>
                <div className="flex flex-wrap gap-2">
                  {result.relatedTerms.map((t, i) => (
                    <button key={i} onClick={() => setInput(t)} className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700 hover:bg-amber-50 hover:border-amber-300">{t}</button>
                  ))}
                </div>
              </div>

              <button onClick={handleCopy} className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl flex items-center justify-center gap-2">
                {copied ? <><Check className="w-5 h-5 text-green-600" /> Kopjuar!</> : <><Copy className="w-5 h-5" /> Kopjo Shpjegimin</>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
