import { useState } from 'react';
import { X, Sparkles, Loader2, CheckCircle, XCircle, RotateCcw, Trophy, ClipboardList } from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

function generateQuiz(topic: string): QuizQuestion[] {
  return [
    { question: `Cili është koncepti themelor i "${topic}"?`, options: ['Përkufizimi bazë i temës', 'Një term i palidhur', 'Asnjë nga këto', 'Të gjitha janë gabim'], correctIndex: 0, explanation: 'Koncepti themelor përcakton bazën mbi të cilën ndërtohet e gjithë tema.' },
    { question: `Pse është e rëndësishme "${topic}" në jetën e përditshme?`, options: ['Nuk ka rëndësi', 'Ka zbatim praktik', 'Vetëm për provime', 'Askush nuk e di'], correctIndex: 1, explanation: 'Çdo temë mësimore ka zbatim praktik në jetën reale.' },
    { question: `Si lidhet "${topic}" me lëndët e tjera?`, options: ['Nuk lidhet fare', 'Lidhet ngushtë me shumë fusha', 'Vetëm me matematikën', 'Vetëm me historinë'], correctIndex: 1, explanation: 'Temat mësimore krijojnë lidhje ndërdisiplinore.' },
    { question: `Çfarë duhet bërë për të kuptuar mirë "${topic}"?`, options: ['Memorizim i verbër', 'Analizë, praktikë dhe reflektim', 'Lexim i shpejtë', 'Kopjim nga shokët'], correctIndex: 1, explanation: 'Mësimi efektiv kërkon analizë, praktikë dhe reflektim personal.' },
    { question: `Cili nivel i të menduarit kërkohet për "${topic}"?`, options: ['Vetëm memorizim', 'Kuptim dhe zbatim', 'Vetëm lexim', 'Asnjë'], correctIndex: 1, explanation: 'Nivelet e larta të të menduarit përfshijnë kuptimin dhe zbatimin.' },
  ];
}

interface Props { onClose: () => void }

export default function SelfQuiz({ onClose }: Props) {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
    setQuestions(generateQuiz(topic));
    setCurrentIdx(0); setScore(0); setSelectedAnswer(null); setFinished(false); setShowExplanation(false);
    setLoading(false);
  };

  const handleAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    if (idx === questions[currentIdx].correctIndex) setScore(s => s + 1);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1); setSelectedAnswer(null); setShowExplanation(false);
    } else {
      setFinished(true);
    }
  };

  const handleReset = () => {
    setQuestions([]); setTopic(''); setCurrentIdx(0); setScore(0); setSelectedAnswer(null); setFinished(false); setShowExplanation(false);
  };

  const q = questions[currentIdx];
  const optColors = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center"><ClipboardList className="w-5 h-5 text-white" /></div>
            <div><h2 className="text-lg font-bold text-gray-900">Kuiz Vetëvlerësimi 📝</h2><p className="text-xs text-gray-500">Testo veten para provimit!</p></div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Start form */}
          {questions.length === 0 && !loading && (
            <div className="space-y-5 text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto text-3xl">🧠</div>
              <h3 className="text-lg font-bold text-gray-900">Çfarë dëshironi të testoni?</h3>
              <input type="text" value={topic} onChange={e => setTopic(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 outline-none text-lg text-center" placeholder="p.sh. Fotosinteza, Pitagora..." />
              <button onClick={handleGenerate} disabled={!topic.trim()} className="w-full py-4 bg-gradient-to-r from-purple-500 to-violet-600 text-white font-bold rounded-xl shadow-xl disabled:opacity-40 flex items-center justify-center gap-3 text-lg">
                <Sparkles className="w-6 h-6" /> Gjenero Kuizin
              </button>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
              <p className="text-gray-600 font-medium">Duke gjeneruar pyetjet...</p>
            </div>
          )}

          {/* Quiz in progress */}
          {questions.length > 0 && !finished && !loading && q && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-purple-600">Pyetja {currentIdx + 1}/{questions.length}</span>
                <span className="text-sm text-gray-500">Pikë: {score}/{questions.length}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-500 to-violet-500 h-2 rounded-full transition-all" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
              </div>

              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                <h3 className="text-lg font-bold text-gray-900">{q.question}</h3>
              </div>

              <div className="space-y-3">
                {q.options.map((opt, i) => {
                  let style = 'bg-white border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-gray-800';
                  if (selectedAnswer !== null) {
                    if (i === q.correctIndex) style = 'bg-emerald-50 border-emerald-400 text-emerald-800';
                    else if (i === selectedAnswer) style = 'bg-red-50 border-red-400 text-red-800';
                    else style = 'bg-gray-50 border-gray-100 text-gray-400';
                  }
                  return (
                    <button key={i} onClick={() => handleAnswer(i)} disabled={selectedAnswer !== null}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${style}`}>
                      <span className={`w-8 h-8 rounded-lg ${optColors[i]} text-white flex items-center justify-center text-sm font-bold shrink-0`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="font-medium">{opt}</span>
                      {selectedAnswer !== null && i === q.correctIndex && <CheckCircle className="w-5 h-5 text-emerald-500 ml-auto shrink-0" />}
                      {selectedAnswer !== null && i === selectedAnswer && i !== q.correctIndex && <XCircle className="w-5 h-5 text-red-500 ml-auto shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {showExplanation && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <p className="text-sm text-blue-800"><strong>💡 Shpjegim:</strong> {q.explanation}</p>
                </div>
              )}

              {selectedAnswer !== null && (
                <button onClick={handleNext} className="w-full py-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white font-bold rounded-xl">
                  {currentIdx < questions.length - 1 ? 'Pyetja Tjetër →' : 'Shiko Rezultatin 🏆'}
                </button>
              )}
            </div>
          )}

          {/* Results */}
          {finished && (
            <div className="text-center py-6 space-y-5">
              <Trophy className="w-16 h-16 text-amber-500 mx-auto" />
              <h3 className="text-2xl font-bold text-gray-900">Rezultati: {score}/{questions.length}</h3>
              <p className="text-gray-600">
                {score === questions.length ? '🌟 Perfekt! Je gati për provim!' :
                 score >= questions.length * 0.6 ? '👏 Shumë mirë! Rishiko pikat ku gabove.' :
                 '💪 Ke nevojë për rishikim. Mos u dorëzo!'}
              </p>
              <div className="flex gap-3">
                <button onClick={handleReset} className="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl flex items-center justify-center gap-2">
                  <RotateCcw className="w-4 h-4" /> Kuiz i Ri
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
