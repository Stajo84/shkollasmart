import { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft, ChevronRight, Users, Copy, Check,
  Radio, Eye, Wifi, StopCircle, Lock, Trophy
} from 'lucide-react';
import {
  LiveSession, LiveSlide, QuestionSlide,
  navigateSlide, endSession, lockQuestion, revealAnswer,
  getSession, getLeaderboard, onLiveUpdate
} from '../../lib/liveSession';

interface Props {
  session: LiveSession;
  onEnd: () => void;
}

export default function PresenterView({ session: init, onEnd }: Props) {
  const [session, setSession] = useState<LiveSession>(init);
  const [slideIndex, setSlideIndex] = useState(init.currentSlideIndex);
  const [copiedPin, setCopiedPin] = useState(false);
  const [showNotes, setShowNotes] = useState(true);
  const [confirmEnd, setConfirmEnd] = useState(false);

  const refresh = useCallback(() => {
    const s = getSession(session.id);
    if (s) setSession(s);
  }, [session.id]);

  useEffect(() => {
    const unsub = onLiveUpdate(() => refresh());
    return unsub;
  }, [refresh]);

  const goTo = (i: number) => {
    const c = Math.max(0, Math.min(i, session.slides.length - 1));
    setSlideIndex(c);
    navigateSlide(session.id, c);
  };

  const handleEnd = () => { endSession(session.id); onEnd(); };
  const handleCopy = async () => { await navigator.clipboard.writeText(session.pinCode); setCopiedPin(true); setTimeout(() => setCopiedPin(false), 2000); };
  const handleLock = (qId: string) => { lockQuestion(session.id, qId); refresh(); };
  const handleReveal = (qId: string) => { revealAnswer(session.id, qId); refresh(); };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goTo(slideIndex + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(slideIndex - 1); }
      if (e.key === 'Escape') setConfirmEnd(true);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  });

  const slide: LiveSlide = session.slides[slideIndex];
  const total = session.slides.length;
  const isFirst = slideIndex === 0;
  const isLast = slideIndex === total - 1;

  // ── Render slide content based on type ──
  const renderSlideContent = () => {
    // LEADERBOARD
    if (slide.type === 'leaderboard') {
      const sorted = getLeaderboard(session.id);
      return (
        <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 ring-2 ring-amber-400/30">
          <div className="p-6 sm:p-10 min-h-[380px]">
            <div className="text-center mb-8">
              <Trophy className="w-14 h-14 text-yellow-200 mx-auto mb-3" />
              <h1 className="text-3xl font-bold text-white">Tabela e Rezultateve</h1>
              <p className="text-white/70 mt-1">{session.participants.length} pjesëmarrës</p>
            </div>

            {/* Podium */}
            {sorted.length >= 1 && (
              <div className="flex items-end justify-center gap-4 mb-6 max-w-md mx-auto">
                {[1, 0, 2].map(idx => {
                  const p = sorted[idx];
                  if (!p) return <div key={idx} className="flex-1" />;
                  const h = idx === 0 ? 'h-32' : idx === 1 ? 'h-24' : 'h-20';
                  const bg = idx === 0 ? 'bg-yellow-400' : idx === 1 ? 'bg-gray-300' : 'bg-amber-700';
                  const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉';
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <span className="text-2xl mb-1">{medal}</span>
                      <div className="text-white text-sm font-bold truncate max-w-full mb-1">{p.name.split(' ')[0]}</div>
                      <div className="text-white/80 text-xs mb-2">{p.score} pikë</div>
                      <div className={`w-full ${h} ${bg} rounded-t-xl flex items-start justify-center pt-2 text-xl font-bold text-white/80`}>
                        #{idx + 1}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Full list */}
            <div className="bg-white/10 rounded-xl max-h-40 overflow-y-auto">
              {sorted.map((p, i) => (
                <div key={p.id} className={`flex items-center gap-3 px-4 py-2.5 ${i > 0 ? 'border-t border-white/10' : ''}`}>
                  <span className="w-6 text-center text-sm font-bold text-white/70">{i + 1}</span>
                  <span className="flex-1 text-white font-medium truncate text-sm">{p.name}</span>
                  <span className="text-amber-200 font-bold text-sm">{p.score}</span>
                </div>
              ))}
              {sorted.length === 0 && <div className="p-6 text-center text-white/50 text-sm">Asnjë pjesëmarrës ende</div>}
            </div>
          </div>
        </div>
      );
    }

    // QUESTION
    if (slide.type === 'question') {
      const q = slide as QuestionSlide;
      const results = session.questionResults[q.id];
      const isLocked = session.questionLocked[q.id];
      const isRevealed = results?.revealed;
      const totalVotes = results?.totalResponses || 0;

      return (
        <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900 ring-2 ring-violet-500/30">
          <div className="p-6 sm:p-10 min-h-[380px]">
            {/* Badge */}
            <div className="flex items-center justify-between mb-6">
              <span className="px-3 py-1 bg-violet-500/30 rounded-full text-xs font-bold text-violet-300">❓ PYETJE INTERAKTIVE</span>
              <span className="text-xs text-gray-400 font-mono">{slideIndex + 1}/{total}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 leading-snug">{q.title}</h2>

            {/* Options with live vote bars */}
            <div className="space-y-3">
              {q.options.map(opt => {
                const votes = results?.votes[opt.id] || 0;
                const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
                const isCorrect = opt.id === q.correctId;

                let barColor = 'bg-white/20';
                let borderStyle = 'border-white/20';
                if (isRevealed) {
                  barColor = isCorrect ? 'bg-green-500/50' : 'bg-red-500/20';
                  borderStyle = isCorrect ? 'border-green-400' : 'border-white/10';
                }

                return (
                  <div key={opt.id} className={`relative p-4 rounded-xl border-2 ${borderStyle} overflow-hidden transition-all`}>
                    {/* Background bar */}
                    <div className={`absolute inset-0 ${barColor} transition-all duration-700`} style={{ width: `${pct}%` }} />
                    <div className="relative flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-sm font-bold text-white shrink-0">{opt.id}</span>
                        <span className="text-white font-medium">{opt.text}</span>
                        {isRevealed && isCorrect && <Check className="w-5 h-5 text-green-400" />}
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-white font-bold">{votes}</div>
                        <div className="text-white/50 text-xs">{pct}%</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Teacher controls */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">{totalVotes} përgjigje</span>
              </div>
              <div className="flex items-center gap-2">
                {!isLocked && (
                  <button onClick={() => handleLock(q.id)} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 transition-colors">
                    <Lock className="w-4 h-4" /> Mbyll
                  </button>
                )}
                {!isRevealed && (
                  <button onClick={() => handleReveal(q.id)} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors">
                    <Eye className="w-4 h-4" /> Trego Përgjigjen
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // CONTENT
    const c = slide as { title: string; bullets: string[]; teacher_notes: string };
    const dark = isFirst || isLast;
    return (
      <div className={`rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl ring-2 ${dark ? 'bg-gradient-to-br from-indigo-600 to-violet-700 ring-violet-500/30' : 'bg-white ring-gray-200'}`}>
        <div className="p-6 sm:p-10 min-h-[300px] sm:min-h-[380px] flex flex-col justify-center">
          <div className="mb-6">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${dark ? 'bg-white/15 text-white' : 'bg-violet-100 text-violet-700'}`}>
              {slideIndex + 1} / {total}
            </span>
          </div>
          <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 leading-snug ${dark ? 'text-white' : 'text-gray-900'}`}>{c.title}</h1>
          <ul className="space-y-4">
            {c.bullets?.map((b: string, i: number) => (
              <li key={i} className="flex items-start gap-4">
                <span className={`mt-2 w-3 h-3 rounded-full shrink-0 ${dark ? 'bg-violet-300' : 'bg-violet-500'}`} />
                <span className={`text-lg sm:text-xl leading-relaxed ${dark ? 'text-indigo-100' : 'text-gray-700'}`}>{b}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={`h-2 ${dark ? 'bg-white/10' : 'bg-gray-100'}`}>
          <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500" style={{ width: `${((slideIndex + 1) / total) * 100}%` }} />
        </div>
      </div>
    );
  };

  const slideNotes = slide.type === 'content' || slide.type === 'question' ? slide.teacher_notes : 'Shfaqni rezultatet dhe festoni fituesit!';
  const nextSlide = slideIndex < total - 1 ? session.slides[slideIndex + 1] : null;
  const nextTitle = nextSlide ? (nextSlide.type === 'leaderboard' ? '🏆 Leaderboard' : nextSlide.type === 'question' ? '❓ Pyetje' : nextSlide.title) : null;

  return (
    <div className="fixed inset-0 bg-gray-950 z-50 flex flex-col">
      {/* TOP BAR */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 border border-red-500/30 rounded-xl">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-bold text-red-400">LIVE</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-gray-500 text-sm">Kodi:</span>
            <span className="font-mono font-bold text-xl text-white tracking-[0.25em]">{session.pinCode}</span>
            <button onClick={handleCopy} className={`p-1 rounded ${copiedPin ? 'text-green-400' : 'text-gray-500 hover:text-white'}`}>
              {copiedPin ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <Users className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-bold text-emerald-400">{session.participants.length}</span>
          </div>
          <Wifi className="w-4 h-4 text-green-400" />
          <button onClick={() => setShowNotes(!showNotes)} className={`p-2 rounded-lg ${showNotes ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-800 text-gray-500'}`}>
            <Eye className="w-5 h-5" />
          </button>
          <button onClick={() => setConfirmEnd(true)} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors">
            <StopCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Përfundo</span>
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-4xl">{renderSlideContent()}</div>
        </div>

        {showNotes && (
          <div className="hidden lg:flex flex-col w-80 bg-gray-900 border-l border-gray-800 p-4 gap-4">
            <div className="flex-1 bg-amber-950/50 rounded-xl p-4 border border-amber-800/30">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-amber-400">Shënimet</span>
              </div>
              <p className="text-sm text-amber-200/80 leading-relaxed">{slideNotes}</p>
            </div>
            {nextTitle && (
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700/50">
                <span className="text-xs font-bold text-gray-500 mb-2 block">RADHËS</span>
                <h4 className="text-sm font-semibold text-gray-300">{nextTitle}</h4>
              </div>
            )}
            <div className="bg-gray-800 rounded-xl p-3 border border-gray-700/50 flex-1 overflow-y-auto max-h-52">
              <span className="text-xs font-bold text-gray-500 mb-2 block">SLLAJDET</span>
              <div className="space-y-1">
                {session.slides.map((s, i) => {
                  const icon = s.type === 'question' ? '❓' : s.type === 'leaderboard' ? '🏆' : '📄';
                  const label = s.type === 'leaderboard' ? 'Leaderboard' : s.title.slice(0, 30);
                  return (
                    <button key={i} onClick={() => goTo(i)} className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center gap-2 transition-colors ${i === slideIndex ? 'bg-violet-600/30 text-violet-300 border border-violet-500/30' : 'text-gray-400 hover:bg-gray-700/50'}`}>
                      <span>{icon}</span>
                      <span className="truncate">{i + 1}. {label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM */}
      <div className="bg-gray-900 border-t border-gray-800 px-4 sm:px-6 py-4 flex items-center justify-between shrink-0">
        <div className="sm:hidden flex items-center gap-2">
          <Radio className="w-4 h-4 text-red-400" />
          <span className="font-mono font-bold text-white tracking-wider">{session.pinCode}</span>
        </div>
        <div className="hidden sm:block text-sm text-gray-500">← → Tastiera · Esc përfundo</div>
        <div className="flex items-center gap-3">
          <button onClick={() => goTo(slideIndex - 1)} disabled={isFirst} className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gray-800 text-white border border-gray-700 disabled:opacity-30 hover:bg-gray-700 transition-colors font-medium">
            <ChevronLeft className="w-5 h-5" /><span className="hidden sm:inline">Para</span>
          </button>
          <span className="text-sm font-mono text-gray-400 px-2">{slideIndex + 1}/{total}</span>
          <button onClick={() => goTo(slideIndex + 1)} disabled={isLast} className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-violet-600 text-white disabled:opacity-30 hover:bg-violet-700 transition-colors font-medium">
            <span className="hidden sm:inline">Tjetra</span><ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* CONFIRM END */}
      {confirmEnd && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <StopCircle className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Përfundo Prezantimin?</h3>
            <p className="text-gray-500 text-sm mb-6">{session.participants.length} nxënës të lidhur do të shërbehen.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmEnd(false)} className="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50">Anulo</button>
              <button onClick={handleEnd} className="flex-1 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700">Përfundo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
