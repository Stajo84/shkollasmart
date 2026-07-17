import { useState } from 'react';
import { 
  GraduationCap, Users, BookOpen, Award, FileText, Video, 
  Brain, FolderOpen, Settings, LogOut, Bell, Search,
  LayoutDashboard, Network, Trophy, Upload, Sparkles,
  Calendar, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import SubjectTeams from './SubjectTeams';
import ProfessionalNetwork from './ProfessionalNetwork';
import Qualifications from './Qualifications';
import ProfessionalDevelopment from './ProfessionalDevelopment';
import MaterialsUpload from './MaterialsUpload';
import AIInteractive from './AIInteractive';
import VideoMeet from './VideoMeet';
import PrivateSpace from './PrivateSpace';

type TabType = 'dashboard' | 'ekip-lendor' | 'rrjet' | 'kualifikim' | 'zhvillim' | 'materiale' | 'ai' | 'meet' | 'privat';

interface CoordinatorDashboardProps {
  onLogout: () => void;
}

export default function CoordinatorDashboard({ onLogout }: CoordinatorDashboardProps) {
  const { teacher, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [notifications] = useState(3);

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard, color: 'text-gray-600' },
    { id: 'ekip-lendor' as TabType, label: 'Ekipi Lëndor', icon: Users, color: 'text-violet-600' },
    { id: 'rrjet' as TabType, label: 'Rrjeti Profesional', icon: Network, color: 'text-blue-600' },
    { id: 'kualifikim' as TabType, label: 'Kualifikimi', icon: Award, color: 'text-emerald-600' },
    { id: 'zhvillim' as TabType, label: 'Zhvillimi Prof.', icon: Trophy, color: 'text-orange-600' },
    { id: 'materiale' as TabType, label: 'Materiale', icon: Upload, color: 'text-pink-600' },
    { id: 'ai' as TabType, label: 'AI Interaktiv', icon: Brain, color: 'text-purple-600' },
    { id: 'meet' as TabType, label: 'Video Meet', icon: Video, color: 'text-red-600' },
    { id: 'privat' as TabType, label: 'Hapësira Ime', icon: FolderOpen, color: 'text-amber-600' },
  ];

  const stats = [
    { label: 'Mësues', value: '24', icon: Users, color: 'from-violet-500 to-purple-600', bgColor: 'bg-violet-50' },
    { label: 'Klasa', value: '18', icon: BookOpen, color: 'from-blue-500 to-indigo-600', bgColor: 'bg-blue-50' },
    { label: 'Nxënës', value: '486', icon: GraduationCap, color: 'from-emerald-500 to-teal-600', bgColor: 'bg-emerald-50' },
    { label: 'Materiale', value: '156', icon: FileText, color: 'from-orange-500 to-amber-600', bgColor: 'bg-orange-50' },
  ];

  const recentActivities = [
    { id: 1, text: 'Mësuese Arta ngarkoi material të ri', time: '5 min më parë', icon: '📄' },
    { id: 2, text: 'Kuiz i ri u gjenerua me AI për Klasën 7A', time: '15 min më parë', icon: '🤖' },
    { id: 3, text: 'Takimi i ekipit të Matematikës u planifikua', time: '1 orë më parë', icon: '📅' },
    { id: 4, text: 'Mësues Besnik përfundoi trajnimin online', time: '2 orë më parë', icon: '🎓' },
    { id: 5, text: '3 mësues të rinj u lidhën në rrjet', time: '3 orë më parë', icon: '🤝' },
  ];

  const upcomingMeetings = [
    { id: 1, title: 'Mbledhje Ekipi Matematikë', time: '14:00', date: 'Sot' },
    { id: 2, title: 'Trajnim: Metodat e reja', time: '10:00', date: 'Nesër' },
    { id: 3, title: 'Konsultim me Prindër', time: '16:00', date: 'Nesër' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'ekip-lendor':
        return <SubjectTeams />;
      case 'rrjet':
        return <ProfessionalNetwork />;
      case 'kualifikim':
        return <Qualifications />;
      case 'zhvillim':
        return <ProfessionalDevelopment />;
      case 'materiale':
        return <MaterialsUpload />;
      case 'ai':
        return <AIInteractive />;
      case 'meet':
        return <VideoMeet />;
      case 'privat':
        return <PrivateSpace />;
      default:
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text`} style={{ color: stat.color.includes('violet') ? '#8b5cf6' : stat.color.includes('blue') ? '#3b82f6' : stat.color.includes('emerald') ? '#10b981' : '#f97316' }} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-500">{stat.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Activities */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">Aktivitetet e Fundit</h3>
                  <button className="text-sm text-amber-600 font-medium hover:text-amber-700">Shiko të gjitha</button>
                </div>
                <div className="p-5 space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-xl">
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{activity.text}</div>
                        <div className="text-xs text-gray-500">{activity.time}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Meetings */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">Takimet e Ardhshme</h3>
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>
                <div className="p-5 space-y-3">
                  {upcomingMeetings.map((meeting) => (
                    <div key={meeting.id} className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100">
                      <div className="text-sm font-bold text-gray-900">{meeting.title}</div>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                        <span className="px-2 py-0.5 bg-white rounded-full">{meeting.date}</span>
                        <span>{meeting.time}</span>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => setActiveTab('meet')}
                    className="w-full py-3 text-sm font-medium text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-xl transition-colors"
                  >
                    + Planifiko Takim të Ri
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Veprime të Shpejta</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button 
                  onClick={() => setActiveTab('materiale')}
                  className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  <span className="font-medium">Ngarko Material</span>
                </button>
                <button 
                  onClick={() => setActiveTab('ai')}
                  className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <Sparkles className="w-5 h-5" />
                  <span className="font-medium">Gjenero me AI</span>
                </button>
                <button 
                  onClick={() => setActiveTab('meet')}
                  className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <Video className="w-5 h-5" />
                  <span className="font-medium">Fillo Takim</span>
                </button>
                <button 
                  onClick={() => setActiveTab('ekip-lendor')}
                  className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <Users className="w-5 h-5" />
                  <span className="font-medium">Menaxho Ekipin</span>
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100">
        {/* Logo */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-200">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                SmartSchool
              </span>
              <div className="text-xs text-gray-500">Paneli i Koordinatorit</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-200'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white text-lg">
              🛡️
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900 truncate">{teacher?.name}</div>
              <div className="text-xs text-gray-500">Koordinator</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Dil nga Sistemi
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 h-16">
            {/* Mobile menu & Title */}
            <div className="flex items-center gap-4">
              <div className="lg:hidden flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  {tabs.find(t => t.id === activeTab)?.label || 'Dashboard'}
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">Menaxhoni shkollën tuaj me efikasitet</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl">
                <Search className="w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Kërko..." 
                  className="bg-transparent border-none outline-none text-sm w-40"
                />
              </div>
              <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
              <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Mobile tabs */}
          <div className="lg:hidden overflow-x-auto border-t border-gray-100">
            <div className="flex p-2 gap-1 min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-amber-100 text-amber-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
