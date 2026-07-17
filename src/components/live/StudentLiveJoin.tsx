import { useState, useEffect, useCallback } from 'react';
import { Hash, User, ArrowLeft, Radio, Users, Wifi, WifiOff, Trophy, CheckCircle, XCircle, Clock } from 'lucide-react';
import { joinByPin, getSessionByPin, submitAnswer, onLiveUpdate, LiveSession, QuestionSlide } from '../../lib/liveSession';

interface Props { onBack: () => void; }

export default function StudentLiveJoin({ onBack }: Props) {
  const [step, setStep] = useState<'join' | 'live'>('join');
  const [pinCode, setPinCode] = useState('');
  const [studentName, setStudentName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [session, setSession] = useState<LiveSession | null>(null);
  const [participantId, setParticipantId] = useState('');
  const [slideIndex, setSlideIndex] = useState(0);
  const [ended, setEnded] = useState(false);

  // Question state
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answerResult, setAnswerResult] = useState<{ correct: boolean; points: number } | null>(null);
  const [myScore, setMyScore] = useState(0);

  const refreshSession = useCallback(() => {
    if (!pinCode) return;
    const s = getSessionByPin(pinCode);
    if (s) {
      setSession(s);
      setSlideIndex(s.currentSlideIndex);
      if (s.status === 'inactive') setEnded(true);

      // Update my score
      const me = s.participants.find(p => p.id === participantId);
      if (me) setMyScore(me.score);

      // Reset answer state when slide changes
      const currentSlide = s.slides[s.currentSlideIndex];
      if (currentSlide.type === 'question') {
        const alreadyAnswered = me?.responses.find(r => r.questionId === currentSlide.id);
        if (!alreadyAnswered) {
          // Only reset if we haven't answered this question
          if (answerResult && selectedOption) {
            // keep showing result
          }
        }
      } else {
        setSelectedOption(null);
        setAnswerResult(null);
      }
    }
  }, [pinCode, participantId, answerResult, selectedOption]);

  useEffect(() => {
    if (step !== 'live') return;
    const unsub = onLiveUpdate(() => refreshSession());
    refreshSession();
    return unsub;
  }, [step, refreshSession]);

  // Reset answer state when slide actually changes
  const [lastSlideIdx, setLastSlideIdx] = useState(-1);
  useEffect(() => {
    if (slideIndex !== lastSlideIdx) {
      setLastSlideIdx(slideIndex);
      setSelectedOption(null);
      setAnswerResult(null);
    }
  }, [slideIndex, lastSlideIdx]);

  const handleJoin = async () => {
    setError('');
    if (pinCode.length !== 6) { setError('Kodi duhet të ketë 6 shifra.'); return; }
    if (!studentName.trim()) { setError('Shkruaj emrin tënd.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const result = joinByPin(pinCode, studentName.trim());
    if (result.ok && result.session) {
      setSession(result.session);
      setParticipantId(result.participantId || '');
      setSlideIndex(result.session.currentSlideIndex);
      setStep('live');
    } else {
      setError(result.error || 'Gabim.');
    }
    setLoading(false);
  };

  const handleAnswer = (optionId: string) => {
    if (!session || selectedOption) return;
    const slide = session.slides[slideIndex];
    if (slide.type !== 'question') return;
    if (session.questionLocked[slide.id]) return;

    setSelectedOption(optionId);
    const result = submitAnswer(session.id, participantId, slide.id, optionId);
    if (result.ok) {
      setAnswerResult({ correct: result.correct, points: result.points });
      setMyScore(prev => prev + result.points);
    }
  };

  // ─── JOIN SCREEN ───
  if (step === 'join') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="relative w-full max-w-sm">
          <button onClick={onBack} className="flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Kthehu
          </button>
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-200 mb-4">
                <Radio className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Bashkohu Live</h1>
              <p className="text-gray-500 mt-1 text-sm">Fut kodin dhe emrin tënd</p>
            </div>
            {error && <div className="mb-5 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm text-center">{error}</div>}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Kodi i Prezantimit</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" inputMode="numeric" value={pinCode}
                    onChange={e => setPinCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none text-center text-3xl font-mono font-bold tracking-[0.4em]"
                    placeholder="000000" maxLength={6} autoFocus
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Emri & Mbiemri</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none"
                    placeholder="p.sh. Arta Gashi"
                  />
                </div>
              </div>
              <button onClick={handleJoin}
                disabled={pinCode.length !== 6 || !studentName.trim() || loading}
                className="w-full py-4 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold text-lg rounded-xl shadow-xl shadow-red-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" /> : <><Radio className="w-5 h-5" /> Bashkohu Live</>}
              </button>
            </div>
          </div>
          <p className="text-center text-white/50 text-xs mt-6">Pa nevojë për llogari</p>
        </div>
      </div>
    );
  }

  // ─── ENDED ───
  if (ended) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-6">
            <WifiOff className="w-10 h-10 text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Prezantimi ka përfunduar</h2>
          <p className="text-gray-400 mb-2">Pikët e tua: <span className="text-amber-400 font-bold text-xl">{myScore}</span></p>
          <p className="text-gray-500 mb-8">Faleminderit, {studentName}!</p>
          <button onClick={onBack} className="px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors">Kthehu</button>
        </div>
      </div>
    );
  }

  // ─── LIVE VIEW ───
  const slide = session?.slides[slideIndex];
  if (!slide || !session) return null;
  const totalSlides = session.slides.length;

  // ── LEADERBOARD SLIDE ──
  if (slide.type === 'leaderboard') {
    const sorted = [...session.participants].sort((a, b) => b.score - a.score);
    const myRank = sorted.findIndex(p => p.id === participantId) + 1;
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <Trophy className="w-16 h-16 text-yellow-200 mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Tabela e Rezultateve</h1>
          <p className="text-white/70 mb-6">Ju jeni #{myRank} me {myScore} pikë</p>

          {/* Podium */}
          <div className="flex items-end justify-center gap-3 mb-8 w-full max-w-sm">
            {sorted.slice(0, 3).map((_p, i) => {
              const heights = ['h-28', 'h-20', 'h-16'];
              const colors = ['bg-yellow-400', 'bg-gray-300', 'bg-amber-600'];
              const order = [1, 0, 2];
              const idx = order[i];
              if (!sorted[idx]) return null;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div className="text-white text-sm font-bold mb-1 truncate max-w-full px-1">{sorted[idx].name.split(' ')[0]}</div>
                  <div className="text-white/80 text-xs mb-2">{sorted[idx].score} pikë</div>
                  <div className={`w-full ${heights[i]} ${colors[i]} rounded-t-xl flex items-center justify-center text-2xl font-bold text-white/90`}>
                    {idx + 1}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full list */}
          <div className="bg-white/10 backdrop-blur rounded-2xl w-full max-w-sm overflow-hidden">
            {sorted.map((p, i) => (
              <div key={p.id} className={`flex items-center gap-3 px-4 py-3 ${p.id === participantId ? 'bg-white/20' : ''} ${i > 0 ? 'border-t border-white/10' : ''}`}>
                <span className="w-6 text-center text-sm font-bold text-white/70">{i + 1}</span>
                <span className="flex-1 text-white font-medium truncate">{p.name}</span>
                <span className="text-amber-200 font-bold">{p.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── QUESTION SLIDE ──
  if (slide.type === 'question') {
    const qSlide = slide as QuestionSlide;
    const results = session.questionResults[qSlide.id];
    const isLocked = session.questionLocked[qSlide.id];
    const isRevealed = results?.revealed;
    const alreadyAnswered = !!selectedOption;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900 flex flex-col">
        {/* Top bar */}
        <div className="bg-black/30 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-green-400" />
            <span className="text-xs font-bold text-red-400">LIVE</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/20 rounded-lg">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-sm font-bold text-amber-400">{myScore}</span>
            </div>
            <span className="text-xs text-gray-400 font-mono">{slideIndex + 1}/{totalSlides}</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-lg">
            {/* Question */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/30 rounded-full text-violet-300 text-xs font-bold mb-4">
                <Clock className="w-3.5 h-3.5" /> PYETJE
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">{qSlide.title}</h2>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {qSlide.options.map((opt) => {
                const isSelected = selectedOption === opt.id;
                const isCorrect = opt.id === qSlide.correctId;
                let style = 'bg-white/10 border-white/20 text-white hover:bg-white/20';

                if (isRevealed || (alreadyAnswered && answerResult)) {
                  if (isCorrect) {
                    style = 'bg-green-500/30 border-green-400 text-green-200';
                  } else if (isSelected && !isCorrect) {
                    style = 'bg-red-500/30 border-red-400 text-red-200';
                  } else {
                    style = 'bg-white/5 border-white/10 text-white/40';
                  }
                } else if (isSelected) {
                  style = 'bg-violet-500/40 border-violet-400 text-white ring-2 ring-violet-400';
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleAnswer(opt.id)}
                    disabled={alreadyAnswered || isLocked}
                    className={`p-4 sm:p-5 rounded-2xl border-2 font-medium text-left transition-all disabled:cursor-default ${style}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-bold shrink-0">
                        {opt.id}
                      </span>
                      <span className="text-base leading-snug">{opt.text}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Feedback */}
            {answerResult && (
              <div className={`mt-6 p-4 rounded-xl text-center ${answerResult.correct ? 'bg-green-500/20 border border-green-400/30' : 'bg-red-500/20 border border-red-400/30'}`}>
                {answerResult.correct ? (
                  <div className="flex items-center justify-center gap-2 text-green-300 font-bold">
                    <CheckCircle className="w-5 h-5" /> E saktë! +{answerResult.points} pikë
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-red-300 font-bold">
                    <XCircle className="w-5 h-5" /> Gabim!
                  </div>
                )}
              </div>
            )}

            {isLocked && !alreadyAnswered && (
              <div className="mt-6 p-4 rounded-xl bg-amber-500/20 border border-amber-400/30 text-center text-amber-300 text-sm font-medium">
                ⏱️ Koha përfundoi — pyetja u mbyll
              </div>
            )}
          </div>
        </div>

        <div className="bg-black/30 px-4 py-3 flex items-center justify-between shrink-0">
          <span className="text-sm text-gray-400">👋 {studentName}</span>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-500">{session.participants.length}</span>
          </div>
        </div>
      </div>
    );
  }

  // ── CONTENT SLIDE ──
  const isFirst = slideIndex === 0;
  const isLast = slideIndex === totalSlides - 1;
  const contentSlide = slide as { title: string; bullets: string[] };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="bg-gray-800/80 backdrop-blur border-b border-gray-700/50 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Wifi className="w-4 h-4 text-green-400" />
          <span className="text-xs font-bold text-red-400">LIVE</span>
          <span className="text-sm text-gray-300 truncate max-w-[180px]">{session.title}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/20 rounded-lg">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-sm font-bold text-amber-400">{myScore}</span>
          </div>
          <span className="text-xs text-gray-500 font-mono">{slideIndex + 1}/{totalSlides}</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-2xl">
          <div className={`rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl ${isFirst || isLast ? 'bg-gradient-to-br from-indigo-600 to-violet-700' : 'bg-white'}`}>
            <div className="px-6 pt-6">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${isFirst || isLast ? 'bg-white/20 text-white' : 'bg-violet-100 text-violet-700'}`}>
                {slideIndex + 1} / {totalSlides}
              </span>
            </div>
            <div className="p-6 sm:p-8">
              <h2 className={`text-xl sm:text-2xl md:text-3xl font-bold mb-6 leading-snug ${isFirst || isLast ? 'text-white' : 'text-gray-900'}`}>
                {contentSlide.title}
              </h2>
              <ul className="space-y-4">
                {contentSlide.bullets?.map((b: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className={`mt-2 w-2.5 h-2.5 rounded-full shrink-0 ${isFirst || isLast ? 'bg-violet-300' : 'bg-violet-500'}`} />
                    <span className={`text-base sm:text-lg leading-relaxed ${isFirst || isLast ? 'text-indigo-100' : 'text-gray-700'}`}>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={`h-1.5 ${isFirst || isLast ? 'bg-white/10' : 'bg-gray-100'}`}>
              <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500" style={{ width: `${((slideIndex + 1) / totalSlides) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/80 backdrop-blur border-t border-gray-700/50 px-4 py-3 flex items-center justify-between shrink-0">
        <span className="text-sm text-gray-400">👋 {studentName}</span>
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-gray-500" />
          <span className="text-xs text-gray-500">{session.participants.length}</span>
        </div>
      </div>
    </div>
  );
}
