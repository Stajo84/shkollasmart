import { useState } from 'react';
import {
  Heart, LogOut, Plus, X, Check, Hash,
  BookOpen, BarChart3, Trophy, Bell,
  Clock, Star, ChevronRight, MessageCircle
} from 'lucide-react';

interface Child {
  id: string;
  uniqueCode: string;
  name: string;
  school: string;
  grade: string;
  avatar: string;
  subjects: { name: string; grade: number; trend: 'up' | 'down' | 'same' }[];
  attendance: number;
  quizzesDone: number;
  avgScore: number;
  recentActivity: { text: string; time: string; emoji: string }[];
}

interface ParentDashboardProps {
  parentName: string;
  onLogout: () => void;
}

const SAMPLE_CHILDREN: Child[] = [
  {
    id: '1', uniqueCode: 'NX-2024-0847', name: 'Ema Berisha', school: 'Shkolla "Naim Frashëri"',
    grade: 'Klasa 7', avatar: '👧',
    subjects: [
      { name: 'Matematikë', grade: 9, trend: 'up' },
      { name: 'Gjuhë Shqipe', grade: 8, trend: 'same' },
      { name: 'Histori', grade: 10, trend: 'up' },
      { name: 'Shkencë', grade: 7, trend: 'down' },
      { name: 'Anglisht', grade: 9, trend: 'up' },
    ],
    attendance: 96, quizzesDone: 47, avgScore: 86,
    recentActivity: [
      { text: 'Përfundoi kuizin e Matematikës — 92%', time: '2 orë më parë', emoji: '📐' },
      { text: 'U bashkua në prezantimin Live të Historisë', time: '5 orë më parë', emoji: '📡' },
      { text: 'Dorëzoi detyrën e Gjuhës Shqipe', time: 'Dje', emoji: '📝' },
      { text: 'Fitoi vendin e 2-të në garën e Matematikës', time: '2 ditë më parë', emoji: '🏆' },
    ],
  },
];

export default function ParentDashboard({ parentName, onLogout }: ParentDashboardProps) {
  const [children, setChildren] = useState<Child[]>([]);
  const [showAddChild, setShowAddChild] = useState(false);
  const [childCode, setChildCode] = useState('');
  const [addError, setAddError] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  const handleAddChild = async () => {
    setAddError('');
    if (!childCode.trim()) { setAddError('Shkruani numrin unik të fëmijës.'); return; }

    setAddLoading(true);
    await new Promise(r => setTimeout(r, 1200));

    // Demo: accept any code with format like NX-XXXX-XXXX or any 6+ char code
    if (childCode.trim().length >= 4) {
      const newChild: Child = {
        ...SAMPLE_CHILDREN[0],
        id: Date.now().toString(),
        uniqueCode: childCode.trim().toUpperCase(),
        name: `Fëmija (${childCode.trim().slice(-4)})`,
      };
      setChildren(prev => [...prev, newChild]);
      setShowAddChild(false);
      setChildCode('');
      setSelectedChild(newChild);
    } else {
      setAddError('Kodi duhet të ketë të paktën 4 karaktere.');
    }
    setAddLoading(false);
  };

  const removeChild = (id: string) => {
    if (confirm('A jeni i sigurt që dëshironi ta hiqni këtë fëmijë?')) {
      setChildren(prev => prev.filter(c => c.id !== id));
      if (selectedChild?.id === id) setSelectedChild(null);
    }
  };

  const trendIcons = { up: '📈', down: '📉', same: '➡️' };
  const trendColors = { up: 'text-emerald-600', down: 'text-red-600', same: 'text-gray-500' };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">SmartSchool</span>
                <span className="text-sm text-gray-400 ml-2 hidden sm:inline">| Portali i Prindit</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-xl">
                <span className="text-sm">👤</span>
                <span className="text-sm font-medium text-gray-900">{parentName}</span>
              </div>
              <button onClick={onLogout} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Dil</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Mirë se vini, {parentName}! 👋</h1>
          <p className="text-gray-600">Ndiqni progresin dhe arritjet e fëmijës suaj.</p>
        </div>

        {/* Children List + Add */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Fëmijët e Mi</h2>
            <button onClick={() => setShowAddChild(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg shadow-emerald-200 text-sm">
              <Plus className="w-4 h-4" /> Shto Fëmijë
            </button>
          </div>

          {children.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-dashed border-emerald-200 p-10 text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4 text-4xl">👶</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Shtoni fëmijën tuaj</h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto text-sm">Vendosni numrin unik të fëmijës që e merrni nga shkolla ose mësuesi për të ndjekur progresin e tij/saj.</p>
              <button onClick={() => setShowAddChild(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg shadow-emerald-200">
                <Plus className="w-5 h-5" /> Shto Fëmijën e Parë
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {children.map(child => (
                <button key={child.id} onClick={() => setSelectedChild(child)}
                  className={`bg-white rounded-2xl p-5 border-2 text-left transition-all hover:shadow-lg ${selectedChild?.id === child.id ? 'border-emerald-400 shadow-lg shadow-emerald-100' : 'border-gray-100 hover:border-emerald-200'}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center text-2xl">{child.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-900 truncate">{child.name}</div>
                      <div className="text-xs text-gray-500">{child.grade} · {child.school}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-emerald-50 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-emerald-700">{child.avgScore}%</div>
                      <div className="text-[10px] text-emerald-600">Mesatare</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-blue-700">{child.quizzesDone}</div>
                      <div className="text-[10px] text-blue-600">Kuize</div>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-amber-700">{child.attendance}%</div>
                      <div className="text-[10px] text-amber-600">Prezencë</div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-mono">{child.uniqueCode}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Child Detail */}
        {selectedChild && (
          <div className="space-y-6">
            {/* Child Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl">{selectedChild.avatar}</div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedChild.name}</h2>
                    <p className="text-emerald-100 text-sm">{selectedChild.grade} · {selectedChild.school}</p>
                    <p className="text-emerald-200 text-xs font-mono mt-1">ID: {selectedChild.uniqueCode}</p>
                  </div>
                </div>
                <button onClick={() => removeChild(selectedChild.id)} className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-4 gap-4">
              {[
                { icon: BarChart3, label: 'Mesatare', value: `${selectedChild.avgScore}%`, color: 'bg-emerald-100 text-emerald-600' },
                { icon: Trophy, label: 'Kuize', value: selectedChild.quizzesDone.toString(), color: 'bg-amber-100 text-amber-600' },
                { icon: Clock, label: 'Prezencë', value: `${selectedChild.attendance}%`, color: 'bg-blue-100 text-blue-600' },
                { icon: Star, label: 'Renditje', value: 'Top 15%', color: 'bg-violet-100 text-violet-600' },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center`}><s.icon className="w-5 h-5" /></div>
                    <div><div className="text-xl font-bold text-gray-900">{s.value}</div><div className="text-xs text-gray-500">{s.label}</div></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Subjects */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2"><BookOpen className="w-5 h-5 text-emerald-600" /> Notat sipas Lëndëve</h3>
                </div>
                <div className="p-5 space-y-3">
                  {selectedChild.subjects.map((subj, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">{subj.name}</span>
                          <div className="flex items-center gap-1.5">
                            <span className={`text-xs ${trendColors[subj.trend]}`}>{trendIcons[subj.trend]}</span>
                            <span className="text-sm font-bold text-gray-900">{subj.grade}</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className={`h-2 rounded-full ${subj.grade >= 9 ? 'bg-emerald-500' : subj.grade >= 7 ? 'bg-blue-500' : 'bg-amber-500'}`}
                            style={{ width: `${subj.grade * 10}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2"><Bell className="w-5 h-5 text-emerald-600" /> Aktiviteti i Fundit</h3>
                </div>
                <div className="p-5 space-y-3">
                  {selectedChild.recentActivity.map((act, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-xl shrink-0">{act.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900">{act.text}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{act.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Teacher */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0"><MessageCircle className="w-6 h-6 text-blue-600" /></div>
                <div className="flex-1"><h4 className="font-bold text-gray-900">Kontakto Mësuesin</h4><p className="text-sm text-gray-600">Dërgoni mesazh mësuesit kujdestar.</p></div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700">Mesazh</button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add Child Modal */}
      {showAddChild && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Shto Fëmijën</h3>
              <button onClick={() => { setShowAddChild(false); setChildCode(''); setAddError(''); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                <div className="flex gap-3">
                  <div className="text-xl">💡</div>
                  <div className="text-sm text-amber-800">
                    <strong>Ku ta gjej numrin unik?</strong> Numri unik i fëmijës jepet nga mësuesi ose shkolla. Ka formatin p.sh. <strong className="font-mono">NX-2024-0847</strong> ose çdo kod tjetër.
                  </div>
                </div>
              </div>

              {addError && <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm text-center">{addError}</div>}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Numri Unik i Fëmijës</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" value={childCode}
                    onChange={e => setChildCode(e.target.value.toUpperCase())}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none text-center text-xl font-mono font-bold tracking-wider uppercase"
                    placeholder="NX-2024-XXXX" />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => { setShowAddChild(false); setChildCode(''); setAddError(''); }}
                  className="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50">Anulo</button>
                <button onClick={handleAddChild} disabled={!childCode.trim() || addLoading}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 disabled:opacity-50 flex items-center justify-center gap-2">
                  {addLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <><Check className="w-5 h-5" /> Shto</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
