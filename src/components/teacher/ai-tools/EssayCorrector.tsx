import { useState } from 'react';
import { X, Sparkles, Loader2, Copy, Check, PenTool, AlertTriangle, ThumbsUp, MessageCircle, Award } from 'lucide-react';

interface AnalysisResult {
  grammarErrors: { text: string; suggestion: string }[];
  structureScore: number;
  strengths: string[];
  suggestedGrade: string;
  feedback: string;
}

function analyzeEssay(text: string): AnalysisResult {
  const words = text.split(/\s+/).length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

  const commonErrors = [
    { pattern: /nuk\s+[a-z]+\s+dot/gi, text: 'nuk ... dot', suggestion: 'nuk mund të ...' },
    { pattern: /eshte/gi, text: 'eshte', suggestion: 'është (me ë)' },
    { pattern: /  +/g, text: 'Hapësira dyfishe', suggestion: 'Përdorni vetëm një hapësirë' },
    { pattern: /,\s*,/g, text: 'Presje dyfishe', suggestion: 'Hiqni presjen e tepërt' },
  ];

  const errors = commonErrors
    .filter(e => e.pattern.test(text))
    .map(e => ({ text: e.text, suggestion: e.suggestion }));

  if (words < 50) errors.push({ text: 'Tekst shumë i shkurtër', suggestion: `Vetëm ${words} fjalë — sugjerohen të paktën 150 fjalë` });

  const structureScore = Math.min(10, Math.round((sentences / Math.max(words / 15, 1)) * 10));

  const strengths: string[] = [];
  if (words > 200) strengths.push('Gjatësi e mjaftueshme e tekstit');
  if (sentences > 5) strengths.push('Teksti ka strukturë me fjali të shumta');
  if (text.includes('"') || text.includes('«')) strengths.push('Përdorim i citateve ose shembujve');
  if (/megjithate|sidoqofte|nga ana tjeter|perfundimisht|se pari/i.test(text)) strengths.push('Përdorim i lidhëzave argumentuese');
  if (strengths.length === 0) strengths.push('Përpjekje e mirë — ka hapësirë për përmirësim');

  const grade = errors.length === 0 && words > 200 ? '9-10' :
    errors.length <= 1 && words > 150 ? '8-9' :
    errors.length <= 3 && words > 100 ? '7-8' :
    errors.length <= 5 ? '6-7' : '5-6';

  return {
    grammarErrors: errors,
    structureScore,
    strengths,
    suggestedGrade: grade,
    feedback: `I/e dashur nxënës/e,\n\nEseja jote ka ${words} fjalë dhe ${sentences} fjali. ${
      errors.length === 0 ? 'Nuk u gjetën gabime të dukshme gramatikore — punë e shkëlqyer!' :
      `U gjetën ${errors.length} pika për përmirësim.`
    }\n\n${strengths.length > 0 ? 'Pikat e tua të forta: ' + strengths.join(', ') + '.' : ''}\n\nPër ta përmirësuar esenë, sugjerohet:\n• Rishikoni drejtshkrimin dhe pikësimin\n• Shtoni argumente mbështetëse me shembuj\n• Sigurohuni që çdo paragraf ka një ide kryesore\n• Përfundoni me një paragraf përmbledhës të fortë\n\nVazhdo kështu! 💪`
  };
}

interface Props { onClose: () => void }

export default function EssayCorrector({ onClose }: Props) {
  const [essay, setEssay] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    if (!essay.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000));
    setResult(analyzeEssay(essay));
    setLoading(false);
  };

  const handleCopyFeedback = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.feedback);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center"><PenTool className="w-5 h-5 text-white" /></div>
            <div><h2 className="text-lg font-bold text-gray-900">Korrigjuesi i Eseve</h2><p className="text-xs text-gray-500">Analizë gramatikore, strukturore dhe vlerësuese</p></div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {!result ? (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ngjisni Esenë e Nxënësit</label>
                <textarea value={essay} onChange={e => setEssay(e.target.value)} rows={10}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 outline-none resize-none text-sm leading-relaxed"
                  placeholder="Ngjisni këtu esenë e shkruar nga nxënësi për korrigjim..." />
                {essay.trim() && <p className="text-xs text-gray-400 mt-1">{essay.split(/\s+/).length} fjalë · {essay.split(/[.!?]+/).filter(s => s.trim()).length} fjali</p>}
              </div>
              <button onClick={handleAnalyze} disabled={!essay.trim() || loading}
                className="w-full py-3.5 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold rounded-xl shadow-lg disabled:opacity-40 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                {loading ? 'Duke analizuar...' : 'Analizo Esenë'}
              </button>
            </>
          ) : (
            <>
              {/* Scores */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-4 border border-red-100 text-center">
                  <AlertTriangle className="w-6 h-6 text-red-500 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-red-600">{result.grammarErrors.length}</div>
                  <div className="text-xs text-red-500">Gabime</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100 text-center">
                  <MessageCircle className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-blue-600">{result.structureScore}/10</div>
                  <div className="text-xs text-blue-500">Strukturë</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100 text-center">
                  <Award className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-emerald-600">{result.suggestedGrade}</div>
                  <div className="text-xs text-emerald-500">Notë</div>
                </div>
              </div>

              {/* Grammar Errors */}
              {result.grammarErrors.length > 0 && (
                <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
                  <h4 className="flex items-center gap-2 font-bold text-red-800 mb-3"><AlertTriangle className="w-4 h-4" /> Gabime Gramatikore</h4>
                  <div className="space-y-2">
                    {result.grammarErrors.map((e, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-red-500 font-bold shrink-0">•</span>
                        <div><span className="line-through text-red-600">{e.text}</span> → <span className="text-emerald-700 font-medium">{e.suggestion}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths */}
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <h4 className="flex items-center gap-2 font-bold text-emerald-800 mb-3"><ThumbsUp className="w-4 h-4" /> Pikat e Forta</h4>
                <ul className="space-y-1">{result.strengths.map((s, i) => <li key={i} className="text-sm text-emerald-700 flex items-center gap-2"><span>✅</span>{s}</li>)}</ul>
              </div>

              {/* Feedback */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-3">📝 Këshillë për Nxënësin</h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{result.feedback}</p>
              </div>

              <button onClick={handleCopyFeedback} className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl flex items-center justify-center gap-2">
                {copied ? <><Check className="w-5 h-5 text-green-600" /> Kopjuar!</> : <><Copy className="w-5 h-5" /> Kopjo Feedback-un</>}
              </button>
              <button onClick={() => setResult(null)} className="w-full py-3 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-white">← Analizo Ese Tjetër</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
