import { useState } from 'react';
import { 
  GraduationCap, Plus, Users, Copy, Check, Trash2, LogOut, 
  BookOpen, BarChart3, Settings, Search, MoreVertical,
  ClipboardList, Sparkles, Presentation, Brain
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import CreateClassroomModal from './CreateClassroomModal';
import AIToolsHub from './AIToolsHub';
import StudentToolsHub from './StudentToolsHub';
import PresenterView from '../live/PresenterView';
import { createLiveSession, convertSlidesToLive, LiveSession } from '../../lib/liveSession';

interface TeacherDashboardProps {
  onLogout: () => void;
}

type DashboardTab = 'klasat' | 'ai-tools' | 'student-tools';

export default function TeacherDashboard({ onLogout }: TeacherDashboardProps) {
  const { teacher, classrooms, deleteClassroom, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>('klasat');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [liveSession, setLiveSession] = useState<LiveSession | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassroom, setSelectedClassroom] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleStartLive = (slides: { title: string; bullets: string[]; teacher_notes: string }[]) => {
    const liveSlides = convertSlidesToLive(slides);
    const session = createLiveSession(slides[0]?.title || 'Prezantim', liveSlides);
    setLiveSession(session);
  };

  const handleLogout = () => { logout(); onLogout(); };

  const copyJoinCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDeleteClassroom = (id: string) => {
    deleteClassroom(id);
    setShowDeleteConfirm(null);
  };

  const filteredClassrooms = classrooms.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalStudents = classrooms.reduce((sum, c) => sum + c.students.length, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">SmartSchool</span>
                <span className="hidden sm:inline text-sm text-gray-400 ml-2">| Dashboard</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm">{teacher?.avatar || '👩‍🏫'}</div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{teacher?.name}</div>
                  <div className="text-xs text-gray-500">{teacher?.email}</div>
                </div>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                <LogOut className="w-4 h-4" /><span className="hidden sm:inline">Dil</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Mirë se vini, {teacher?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-gray-600">Menaxhoni klasat dhe përdorni mjetet AI.</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 bg-gray-100 rounded-2xl p-1.5 w-fit">
          <button onClick={() => setActiveTab('klasat')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'klasat' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            <BookOpen className="w-4 h-4" /> Klasat e Mia
          </button>
          <button onClick={() => setActiveTab('ai-tools')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'ai-tools' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            <Brain className="w-4 h-4" /> Mjetet AI
            <span className="px-1.5 py-0.5 bg-violet-100 text-violet-700 text-[10px] font-bold rounded-full">11</span>
          </button>
          <button onClick={() => setActiveTab('student-tools')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'student-tools' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            <Users className="w-4 h-4" /> Për Nxënësit
            <span className="px-1.5 py-0.5 bg-sky-100 text-sky-700 text-[10px] font-bold rounded-full">4</span>
          </button>
        </div>

        {/* ══════════════ TAB: KLASAT ══════════════ */}
        {activeTab === 'klasat' && (
          <div>
            {/* Stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center"><BookOpen className="w-6 h-6 text-blue-600" /></div>
                  <div><div className="text-2xl font-bold text-gray-900">{classrooms.length}</div><div className="text-sm text-gray-500">Klasa</div></div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center"><Users className="w-6 h-6 text-emerald-600" /></div>
                  <div><div className="text-2xl font-bold text-gray-900">{totalStudents}</div><div className="text-sm text-gray-500">Nxënës</div></div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center"><ClipboardList className="w-6 h-6 text-violet-600" /></div>
                  <div><div className="text-2xl font-bold text-gray-900">0</div><div className="text-sm text-gray-500">Kuize</div></div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center"><BarChart3 className="w-6 h-6 text-amber-600" /></div>
                  <div><div className="text-2xl font-bold text-gray-900">--%</div><div className="text-sm text-gray-500">Mesatare</div></div>
                </div>
              </div>
            </div>

            {/* Quick AI access banner */}
            <div className="mb-8 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 rounded-2xl p-5 sm:p-6 text-white shadow-xl shadow-violet-200/40">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center shrink-0"><Brain className="w-7 h-7" /></div>
                  <div>
                    <h3 className="text-lg font-bold">Mjetet AI — 11 Asistentë të Gatshëm</h3>
                    <p className="text-violet-200 text-sm mt-0.5">Prezantime, Teste, Infografika, Leksione, Plane, Imazhe</p>
                  </div>
                </div>
                <button onClick={() => setActiveTab('ai-tools')} className="flex items-center gap-2 px-6 py-3 bg-white text-violet-700 rounded-xl font-bold hover:bg-violet-50 transition-colors shadow-lg whitespace-nowrap">
                  <Sparkles className="w-5 h-5" /> Hap Mjetet AI
                </button>
              </div>
            </div>

            {/* Classrooms */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-lg font-bold text-gray-900">Klasat e Mia</h2>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1 sm:flex-none">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Kërko klasë..."
                        className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm" />
                    </div>
                    <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 text-sm whitespace-nowrap">
                      <Plus className="w-4 h-4" /> Klasë e Re
                    </button>
                  </div>
                </div>
              </div>

              {filteredClassrooms.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4"><BookOpen className="w-8 h-8 text-gray-400" /></div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{searchQuery ? 'Asnjë klasë nuk u gjet' : 'Asnjë klasë ende'}</h3>
                  <p className="text-gray-500 mb-6">{searchQuery ? 'Provoni kërkim tjetër' : 'Krijoni klasën tuaj të parë'}</p>
                  {!searchQuery && <button onClick={() => setShowCreateModal(true)} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-200">
                    <Plus className="w-5 h-5" /> Krijo Klasën e Parë
                  </button>}
                </div>
              ) : (
                <div className="p-5">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredClassrooms.map((classroom) => (
                      <div key={classroom.id} className="relative group rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
                        <div className={`bg-gradient-to-r ${classroom.color} p-5 text-white`}>
                          <div className="flex items-start justify-between">
                            <div><h3 className="font-bold text-lg">{classroom.name}</h3><p className="text-white/80 text-sm">{classroom.subject} · {classroom.grade}</p></div>
                            <div className="relative">
                              <button onClick={() => setSelectedClassroom(selectedClassroom === classroom.id ? null : classroom.id)} className="p-1.5 rounded-lg hover:bg-white/20"><MoreVertical className="w-5 h-5" /></button>
                              {selectedClassroom === classroom.id && (
                                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-1 w-40 z-10">
                                  <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"><Settings className="w-4 h-4" />Cilësimet</button>
                                  <button onClick={() => { setSelectedClassroom(null); setShowDeleteConfirm(classroom.id); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" />Fshi Klasën</button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="p-5 bg-white">
                          <div className="mb-4">
                            <div className="text-xs text-gray-500 mb-1.5">Kodi i Bashkimit</div>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 px-4 py-2.5 bg-gray-50 rounded-xl font-mono font-bold text-lg text-gray-900 tracking-widest">{classroom.joinCode}</div>
                              <button onClick={() => copyJoinCode(classroom.joinCode)} className={`p-2.5 rounded-xl transition-all ${copiedCode === classroom.joinCode ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600'}`}>
                                {copiedCode === classroom.joinCode ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2"><Users className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-600">{classroom.students.length} nxënës</span></div>
                          </div>
                          {classroom.students.length > 0 && (
                            <div className="flex items-center mt-3 -space-x-2">
                              {classroom.students.slice(0, 5).map(s => (
                                <div key={s.id} className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white" title={s.name}>{s.name.charAt(0)}</div>
                              ))}
                              {classroom.students.length > 5 && <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold border-2 border-white">+{classroom.students.length - 5}</div>}
                            </div>
                          )}
                        </div>
                        <div className="p-3 bg-gray-50 border-t border-gray-100 flex gap-2">
                          <button onClick={() => setActiveTab('ai-tools')} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-white hover:text-violet-600 transition-colors">
                            <Sparkles className="w-4 h-4" /> Mjetet AI
                          </button>
                          <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-white hover:text-blue-600 transition-colors">
                            <Presentation className="w-4 h-4" /> Prezantim
                          </button>
                          <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-white hover:text-emerald-600 transition-colors">
                            <BarChart3 className="w-4 h-4" /> Raporte
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════ TAB: AI TOOLS ══════════════ */}
        {activeTab === 'ai-tools' && (
          <AIToolsHub onStartLive={handleStartLive} />
        )}

        {/* ══════════════ TAB: STUDENT TOOLS ══════════════ */}
        {activeTab === 'student-tools' && (
          <StudentToolsHub />
        )}
      </main>

      {/* Create classroom modal */}
      {showCreateModal && <CreateClassroomModal onClose={() => setShowCreateModal(false)} />}

      {/* Live Presenter View */}
      {liveSession && <PresenterView session={liveSession} onEnd={() => setLiveSession(null)} />}

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><Trash2 className="w-7 h-7 text-red-600" /></div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Fshi Klasën?</h3>
            <p className="text-gray-500 text-sm mb-6">Kjo do fshijë klasën dhe të dhënat. Nuk zhbëhet.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">Anulo</button>
              <button onClick={() => handleDeleteClassroom(showDeleteConfirm)} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700">Fshi</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
