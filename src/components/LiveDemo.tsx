import { useState } from 'react';
import { CheckCircle, XCircle, RotateCcw, Trophy, Zap } from 'lucide-react';

const questions = [
  {
    question: "Cili mal është më i larti në Shqipëri?",
    options: ["Mali i Tomorrit", "Mali i Korabit", "Mali i Dajtit", "Mali i Çikës"],
    correct: 1,
    emoji: "⛰️"
  },
  {
    question: "Në cilën vit u shpall Pavarësia e Shqipërisë?",
    options: ["1910", "1912", "1914", "1920"],
    correct: 1,
    emoji: "🇦🇱"
  },
  {
    question: "Cila është liqeni më i madh natyror në Shqipëri?",
    options: ["Liqeni i Ohrit", "Liqeni i Shkodrës", "Liqeni i Prespës", "Liqeni i Butrintit"],
    correct: 1,
    emoji: "🌊"
  },
  {
    question: "Kush e shkroi 'Histori e Skënderbeut'?",
    options: ["Fan Noli", "Marin Barleti", "Naim Frashëri", "Ismail Kadare"],
    correct: 1,
    emoji: "📖"
  },
  {
    question: "Sa zona kryesore klimatike ka Shqipëria?",
    options: ["1", "2", "3", "4"],
    correct: 1,
    emoji: "🌤️"
  }
];

export default function LiveDemo() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [streak, setStreak] = useState(0);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);

    if (index === questions[currentQuestion].correct) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    setShowResult(true);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setIsFinished(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setIsFinished(false);
    setStreak(0);
  };

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + (showResult ? 1 : 0)) / questions.length) * 100;

  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-violet-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
            🎮 Provo Tani
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Provo një{' '}
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              kuiz demo
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            Provojeni vetë! Përgjigjuni pyetjeve dhe shikoni si funksionon platforma.
          </p>
        </div>

        {/* Quiz Container */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl shadow-violet-100 border border-gray-100 overflow-hidden">
            {!isFinished ? (
              <>
                {/* Quiz Header */}
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium opacity-80">
                      Pyetja {currentQuestion + 1} / {questions.length}
                    </span>
                    <div className="flex items-center gap-4">
                      {streak >= 2 && (
                        <div className="flex items-center gap-1 px-3 py-1 bg-orange-500 rounded-lg text-xs font-bold animate-bounce">
                          🔥 {streak}x Streak
                        </div>
                      )}
                      <div className="flex items-center gap-1 px-3 py-1 bg-white/20 rounded-lg text-sm font-bold">
                        <Zap className="w-3.5 h-3.5" />
                        {score * 100} pikë
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2.5">
                    <div
                      className="bg-white rounded-full h-2.5 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Question */}
                <div className="p-6 sm:p-8">
                  <div className="text-center mb-8">
                    <div className="text-5xl mb-4">{question.emoji}</div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                      {question.question}
                    </h3>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {question.options.map((option, index) => {
                      let buttonStyle = "border-2 border-gray-100 hover:border-violet-300 hover:bg-violet-50 text-gray-700";

                      if (showResult) {
                        if (index === question.correct) {
                          buttonStyle = "border-2 border-green-500 bg-green-50 text-green-700";
                        } else if (index === selectedAnswer && index !== question.correct) {
                          buttonStyle = "border-2 border-red-500 bg-red-50 text-red-700";
                        } else {
                          buttonStyle = "border-2 border-gray-100 text-gray-400 opacity-50";
                        }
                      } else if (index === selectedAnswer) {
                        buttonStyle = "border-2 border-violet-500 bg-violet-50 text-violet-700";
                      }

                      return (
                        <button
                          key={index}
                          onClick={() => handleAnswer(index)}
                          disabled={selectedAnswer !== null}
                          className={`p-4 rounded-xl font-medium transition-all duration-300 text-center ${buttonStyle} ${
                            selectedAnswer === null ? 'cursor-pointer hover:-translate-y-0.5' : 'cursor-default'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-2">
                            {showResult && index === question.correct && (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            )}
                            {showResult && index === selectedAnswer && index !== question.correct && (
                              <XCircle className="w-5 h-5 text-red-500" />
                            )}
                            {option}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              /* Results */
              <div className="p-8 sm:p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">Kuizi Përfundoi!</h3>
                <p className="text-gray-500 mb-6">Ja rezultati juaj:</p>

                <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-2xl p-6 mb-8 max-w-xs mx-auto">
                  <div className="text-5xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                    {score}/{questions.length}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {score === questions.length
                      ? "🏆 Perfekt! Je një gjeni!"
                      : score >= 3
                      ? "👏 Shumë mirë! Vazhdo kështu!"
                      : score >= 2
                      ? "💪 Jo keq! Provo përsëri!"
                      : "📚 Mund të bësh më mirë! Provo përsëri."}
                  </div>
                  <div className="mt-3 text-lg font-bold text-violet-600">
                    {score * 100} pikë totale
                  </div>
                </div>

                <button
                  onClick={resetQuiz}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg shadow-violet-200"
                >
                  <RotateCcw className="w-4 h-4" />
                  Provo Përsëri
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
