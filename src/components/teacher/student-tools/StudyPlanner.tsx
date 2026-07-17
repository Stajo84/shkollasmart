import { useState } from 'react';
import { X, Sparkles, Loader2, Clock, Copy, Check, Calendar, Target } from 'lucide-react';

interface TimeBlock {
  time: string;
  duration: string;
  activity: string;
  emoji: string;
  type: 'study' | 'break' | 'review';
}

function generateStudyPlan(topic: string, hours: number): TimeBlock[] {
  const blocks: TimeBlock[] = [];
  const totalMin = hours * 60;
  const studyBlocks = Math.floor(totalMin / 35); // 25min study + 10min break

  for (let i = 0; i < studyBlocks && i < 8; i++) {
    const startH = 15 + Math.floor((i * 35) / 60);
    const startM = (i * 35) % 60;
    const timeStr = `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`;

    if (i === 0) {
      blocks.push({ time: timeStr, duration: '5 min', activity: `Përgatitje: Mblidh materialet për "${topic}"`, emoji: '📚', type: 'study' });
    }

    const topics = [
      `Lexim aktiv: Kapitulli kryesor i "${topic}"`,
      `Shënim: Shkruaj pikat kryesore me fjalët e tua`,
      `Praktikë: Zgjidh ushtrime ose përgjigju pyetjeve`,
      `Thellim: Analizo konceptet e vështira`,
      `Krahasim: Lidh me tema të tjera që njeh`,
      `Krijim: Bëj hartë mendore ose skemë`,
      `Rishikim: Kthehu te pikat ku u ngece`,
      `Përgatitje: Provo me kuiz vetëvlerësimi`,
    ];

    blocks.push({
      time: timeStr,
      duration: '25 min',
      activity: topics[i % topics.length],
      emoji: ['📖', '✏️', '🧮', '🔬', '🔗', '🗺️', '🔄', '📝'][i % 8],
      type: 'study'
    });

    // Break
    const breakH = 15 + Math.floor(((i * 35) + 25) / 60);
    const breakM = ((i * 35) + 25) % 60;
    blocks.push({
      time: `${String(breakH).padStart(2, '0')}:${String(breakM).padStart(2, '0')}`,
      duration: '10 min',
      activity: i % 2 === 0 ? 'Pushim: Pi ujë, ec pak, relaksohu' : 'Pushim: Dëgjo muzikë, streç',
      emoji: i % 2 === 0 ? '☕' : '🎵',
      type: 'break'
    });
  }

  // Final review
  blocks.push({ time: '', duration: '10 min', activity: `Rishikim final: Përmblidh gjithçka që mësove për "${topic}"`, emoji: '🏆', type: 'review' });

  return blocks;
}

interface Props { onClose: () => void }

export default function StudyPlanner({ onClose }: Props) {
  const [topic, setTopic] = useState('');
  const [hours, setHours] = useState(2);
  const [plan, setPlan] = useState<TimeBlock[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 800));
    setPlan(generateStudyPlan(topic, hours));
    setLoading(false);
  };

  const handleCopy = () => {
    const txt = `📅 PLAN STUDIMI — ${topic}\nKohëzgjatja: ${hours} orë\n\n${plan.map(b => `${b.time ? b.time + ' ' : ''}[${b.duration}] ${b.emoji} ${b.activity}`).join('\n')}`;
    navigator.clipboard.writeText(txt); setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const typeColors = { study: 'border-blue-200 bg-blue-50', break: 'border-green-200 bg-green-50', review: 'border-amber-200 bg-amber-50' };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center"><Calendar className="w-5 h-5 text-white" /></div>
            <div><h2 className="text-lg font-bold text-gray-900">Planifikuesi i Studimit 📅</h2><p className="text-xs text-gray-500">Menaxho kohën me Time Blocking</p></div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {plan.length === 0 && !loading && (
            <>
              <div className="text-center py-4">
                <div className="text-5xl mb-4">⏰</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Çfarë do mësosh sot?</h3>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"><Target className="w-4 h-4 text-green-500" /> Tema</label>
                <input type="text" value={topic} onChange={e => setTopic(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 outline-none text-lg" placeholder="p.sh. Historia e Shqipërisë, Fizikë..." />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"><Clock className="w-4 h-4 text-green-500" /> Sa kohë ke? ({hours} orë)</label>
                <input type="range" min={1} max={4} value={hours} onChange={e => setHours(parseInt(e.target.value))} className="w-full accent-green-500" />
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1 orë</span><span>4 orë</span></div>
              </div>
              <button onClick={handleGenerate} disabled={!topic.trim()} className="w-full py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold rounded-xl shadow-xl disabled:opacity-40 flex items-center justify-center gap-3 text-lg">
                <Sparkles className="w-6 h-6" /> Krijo Planin
              </button>
            </>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-4" />
              <p className="text-gray-600 font-medium">Duke krijuar planin e studimit...</p>
            </div>
          )}

          {plan.length > 0 && !loading && (
            <>
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-900">📅 Plan Studimi: {topic}</h3>
                <p className="text-sm text-gray-500">{hours} orë · {plan.filter(b => b.type === 'study').length} bllokime studimi</p>
              </div>

              <div className="space-y-2">
                {plan.map((block, i) => (
                  <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border-2 ${typeColors[block.type]}`}>
                    <div className="text-2xl">{block.emoji}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-sm">{block.activity}</div>
                      <div className="flex items-center gap-2 mt-1">
                        {block.time && <span className="text-xs font-mono text-gray-500">{block.time}</span>}
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          block.type === 'study' ? 'bg-blue-100 text-blue-700' :
                          block.type === 'break' ? 'bg-green-100 text-green-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>{block.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setPlan([])} className="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl">← Plan i Ri</button>
                <button onClick={handleCopy} className="flex-1 py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                  {copied ? <><Check className="w-5 h-5" /> Kopjuar!</> : <><Copy className="w-5 h-5" /> Kopjo Planin</>}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
