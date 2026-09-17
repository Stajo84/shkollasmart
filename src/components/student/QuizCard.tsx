import { Clock3, ListChecks, Play, Sparkles } from 'lucide-react';
import type { Quiz } from '../../types/quiz';

interface QuizCardProps { quiz: Quiz; onStart: (quiz: Quiz) => void }
export default function QuizCard({ quiz, onStart }: QuizCardProps) {
  const theme = quiz.color === 'emerald' ? 'from-emerald-500 to-teal-600' : quiz.color === 'amber' ? 'from-amber-400 to-orange-500' : 'from-violet-500 to-indigo-600';
  return <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-100/60">
    <div className={`relative bg-gradient-to-br ${theme} p-6 text-white`}><div className="flex items-start justify-between"><span className="grid size-12 place-items-center rounded-2xl bg-white/20 text-2xl font-bold backdrop-blur">{quiz.icon}</span><span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">{quiz.difficulty}</span></div><h3 className="mt-8 text-xl font-bold">{quiz.title}</h3><p className="mt-1 text-sm text-white/80">{quiz.subject} · {quiz.grade}</p></div>
    <div className="p-5"><div className="mb-5 grid grid-cols-2 gap-3 text-sm text-slate-500"><span className="flex items-center gap-2"><ListChecks className="size-4 text-violet-500" />{quiz.questions.length} pyetje</span><span className="flex items-center gap-2"><Clock3 className="size-4 text-violet-500" />{quiz.duration} min</span></div><button onClick={() => onStart(quiz)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-violet-600"><Play className="size-4 fill-current" />Fillo kuizin</button></div>
  </article>;
}
