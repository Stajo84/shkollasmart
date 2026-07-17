import { useState } from 'react';
import { Play, Sparkles, Users, BookOpen, GraduationCap, Heart, Award, Building, BarChart3 } from 'lucide-react';
import DemoModal from './DemoModal';

interface HeroProps {
  onTeacherClick?: () => void;
  onStudentClick?: () => void;
}

const roles = [
  { id: 'nxënës', label: '🎓 Nxënës', color: 'from-violet-600 to-purple-600' },
  { id: 'prindër', label: '👨‍👩‍👧‍👦 Prindër', color: 'from-emerald-600 to-teal-600' },
  { id: 'mësues', label: '👩‍🏫 Mësues', color: 'from-blue-600 to-indigo-600' },
  { id: 'koordinatori', label: '🛡️ Koordinatori', color: 'from-amber-600 to-orange-600' },
];

const heroContent = {
  nxënës: {
    badge: "Platforma #1 për Nxënës",
    title: "Mëso duke u",
    highlight: "Argëtuar",
    subtitle: "me Lojëra & Kuize",
    description: "SmartSchool e bën mësimin të pabesueshëm! Zgjidhni kuize, garoni me shokët, fitoni pikë dhe bëhuni ekspertë në çdo lëndë — gjithçka duke u kënaqur.",
    cta: "Fillo të Mësosh — Falas",
    stats: [
      { icon: Users, value: "20M+", label: "Nxënës Aktivë" },
      { icon: BookOpen, value: "500K+", label: "Kuize" },
      { icon: Award, value: "1B+", label: "Pyetje Zgjidhura" },
    ]
  },
  prindër: {
    badge: "Partneri i Prindërve",
    title: "Ndiqni dhe Mbështesni",
    highlight: "Suksesin",
    subtitle: "e Fëmijës Suaj",
    description: "Shikoni progresin e fëmijës tuaj në kohë reale, kuptoni pikat e forta dhe të dobëta, dhe bashkëpunoni me mësuesit — gjithçka nga një platformë e vetme.",
    cta: "Krijo Llogari Prindi",
    stats: [
      { icon: Heart, value: "95%", label: "Prindër të Kënaqur" },
      { icon: GraduationCap, value: "40%", label: "Rritje Performancë" },
      { icon: Users, value: "5M+", label: "Familje Aktive" },
    ]
  },
  mësues: {
    badge: "Mjeti i Mësuesit Modern",
    title: "Krijoni Mësime",
    highlight: "Magjike",
    subtitle: "në Minuta",
    description: "Gjeneroni kuize me IA, personalizoni materialin për çdo nxënës, dhe merrni raporte të detajuara — kurseni orë pune çdo javë ndërsa rritni cilësinë e mësimit.",
    cta: "Fillo si Mësues — Falas",
    stats: [
      { icon: Users, value: "1M+", label: "Mësues" },
      { icon: Sparkles, value: "10x", label: "Më Shpejt me IA" },
      { icon: Award, value: "150+", label: "Vende" },
    ]
  },
  koordinatori: {
    badge: "Administrimi i Shkollës",
    title: "Menaxhoni me",
    highlight: "Efikasitet",
    subtitle: "gjithë Institucionin",
    description: "Një pamje 360-shkallë mbi çdo klasë, mësues dhe nxënës. Analizoni performancën globale të shkollës dhe merrni vendime të bazuara në të dhëna të sakta.",
    cta: "Hyr si Koordinator",
    stats: [
      { icon: Building, value: "100+", label: "Klasa" },
      { icon: Users, value: "2500+", label: "Nxënës" },
      { icon: BarChart3, value: "Real-time", label: "Analitikë" },
    ]
  }
};

export default function Hero({ onTeacherClick, onStudentClick }: HeroProps) {
  const [activeRole, setActiveRole] = useState<'nxënës' | 'prindër' | 'mësues' | 'koordinatori'>('nxënës');
  const [showDemo, setShowDemo] = useState(false);
  const content = heroContent[activeRole];

  const gradientMap = {
    nxënës: 'from-violet-600 via-purple-600 to-indigo-600',
    prindër: 'from-emerald-600 via-teal-600 to-cyan-600',
    mësues: 'from-blue-600 via-indigo-600 to-violet-600',
    koordinatori: 'from-amber-600 via-orange-600 to-yellow-600',
  };

  const badgeBg = {
    nxënës: 'bg-violet-100 text-violet-700',
    prindër: 'bg-emerald-100 text-emerald-700',
    mësues: 'bg-blue-100 text-blue-700',
    koordinatori: 'bg-amber-100 text-amber-700',
  };

  const btnGradient = {
    nxënës: 'from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-violet-200 hover:shadow-violet-300',
    prindër: 'from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-200 hover:shadow-emerald-300',
    mësues: 'from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-200 hover:shadow-blue-300',
    koordinatori: 'from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-amber-200 hover:shadow-amber-300',
  };

  const statBg = {
    nxënës: ['bg-violet-100 text-violet-600', 'bg-indigo-100 text-indigo-600', 'bg-purple-100 text-purple-600'],
    prindër: ['bg-emerald-100 text-emerald-600', 'bg-teal-100 text-teal-600', 'bg-cyan-100 text-cyan-600'],
    mësues: ['bg-blue-100 text-blue-600', 'bg-indigo-100 text-indigo-600', 'bg-violet-100 text-violet-600'],
    koordinatori: ['bg-amber-100 text-amber-600', 'bg-orange-100 text-orange-600', 'bg-yellow-100 text-yellow-600'],
  };

  return (
    <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-indigo-50" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-violet-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />
      <div className="absolute top-40 right-1/4 w-48 h-48 bg-pink-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-40 left-1/4 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Role Switcher */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-gray-100 rounded-2xl p-1.5 gap-1">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id as 'nxënës' | 'prindër' | 'mësues')}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeRole === role.id
                    ? `bg-gradient-to-r ${role.color} text-white shadow-lg`
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div key={activeRole} className="animate-fade-in-up">
            <div className={`inline-flex items-center gap-2 px-4 py-2 ${badgeBg[activeRole]} rounded-full text-sm font-medium mb-6`}>
              <Sparkles className="w-4 h-4" />
              {content.badge}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              {content.title}{' '}
              <span className={`bg-gradient-to-r ${gradientMap[activeRole]} bg-clip-text text-transparent animate-gradient`}>
                {content.highlight}
              </span>{' '}
              {content.subtitle}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed max-w-xl">
              {content.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                onClick={(activeRole === 'mësues' || activeRole === 'koordinatori') ? onTeacherClick : onStudentClick}
                className={`inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r ${btnGradient[activeRole]} rounded-2xl transition-all shadow-xl hover:-translate-y-0.5`}
              >
                <Play className="w-5 h-5" />
                {content.cta}
              </button>
              <button 
                onClick={() => setShowDemo(true)}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-2xl hover:border-violet-300 hover:text-violet-600 transition-all"
              >
                <Play className="w-5 h-5" />
                Shiko Demo
              </button>
            </div>
            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              {content.stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${statBg[activeRole][index].split(' ')[0]} flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${statBg[activeRole][index].split(' ')[1]}`} />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Interactive Visual */}
          <div className="relative hidden lg:block">
            {activeRole === 'nxënës' && (
              <div className="relative animate-fade-in-up">
                <div className="bg-white rounded-3xl shadow-2xl shadow-violet-100 p-8 border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl p-6 text-white mb-6">
                    <div className="text-sm font-medium opacity-80 mb-2">Pyetja 5 / 10</div>
                    <div className="text-xl font-bold mb-4">Cila është kryeqyteti i Shqipërisë?</div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-white rounded-full h-2 w-1/2" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl border-2 border-green-400 bg-green-50 text-center font-medium text-green-700">🏛️ Tiranë ✅</div>
                    <div className="p-4 rounded-xl border-2 border-gray-100 text-center font-medium text-gray-400">🏰 Durrës</div>
                    <div className="p-4 rounded-xl border-2 border-gray-100 text-center font-medium text-gray-400">⛰️ Korçë</div>
                    <div className="p-4 rounded-xl border-2 border-gray-100 text-center font-medium text-gray-400">🌊 Vlorë</div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-xl shadow-lg animate-float text-sm font-bold">✅ +250 pikë!</div>
                <div className="absolute -bottom-4 -left-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-xl shadow-lg animate-float delay-300 text-sm font-bold">🏆 Rekord i ri!</div>
                <div className="absolute top-1/2 -right-8 bg-pink-500 text-white px-3 py-1.5 rounded-lg shadow-lg animate-float delay-500 text-xs font-bold">🔥 5x Streak</div>
              </div>
            )}

            {activeRole === 'prindër' && (
              <div className="relative animate-fade-in-up">
                <div className="bg-white rounded-3xl shadow-2xl shadow-emerald-100 p-8 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-gray-900 text-lg">📊 Paneli i Prindit</h3>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">Në kohë reale</span>
                  </div>
                  {/* Child Card */}
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-5 mb-5 border border-emerald-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xl">👧</div>
                      <div>
                        <div className="font-bold text-gray-900">Ema Krasniqi</div>
                        <div className="text-sm text-gray-500">Klasa 5 · Shkolla "Naim Frashëri"</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white rounded-xl p-3 text-center shadow-sm">
                        <div className="text-xl font-bold text-emerald-600">92%</div>
                        <div className="text-xs text-gray-500">Mesatare</div>
                      </div>
                      <div className="bg-white rounded-xl p-3 text-center shadow-sm">
                        <div className="text-xl font-bold text-blue-600">47</div>
                        <div className="text-xs text-gray-500">Kuize</div>
                      </div>
                      <div className="bg-white rounded-xl p-3 text-center shadow-sm">
                        <div className="text-xl font-bold text-purple-600">🏆 3</div>
                        <div className="text-xs text-gray-500">Trofe</div>
                      </div>
                    </div>
                  </div>
                  {/* Progress Bars */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1"><span className="font-medium text-gray-700">Matematikë</span><span className="text-emerald-600 font-bold">95%</span></div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5"><div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full h-2.5" style={{width: '95%'}} /></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1"><span className="font-medium text-gray-700">Gjuhë Shqipe</span><span className="text-blue-600 font-bold">88%</span></div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5"><div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full h-2.5" style={{width: '88%'}} /></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1"><span className="font-medium text-gray-700">Shkencë</span><span className="text-violet-600 font-bold">91%</span></div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5"><div className="bg-gradient-to-r from-violet-500 to-purple-500 rounded-full h-2.5" style={{width: '91%'}} /></div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-emerald-500 text-white px-4 py-2 rounded-xl shadow-lg animate-float text-sm font-bold">📈 +12% këtë muaj</div>
                <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white px-4 py-2 rounded-xl shadow-lg animate-float delay-300 text-sm font-bold">📝 3 detyra sot</div>
              </div>
            )}

            {activeRole === 'mësues' && (
              <div className="relative animate-fade-in-up">
                <div className="bg-white rounded-3xl shadow-2xl shadow-blue-100 p-8 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-gray-900 text-lg">✨ Krijo Kuiz me IA</h3>
                    <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">Gjeneruar me IA</span>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 mb-5 border border-blue-100">
                    <div className="text-sm font-medium text-gray-500 mb-2">Tema:</div>
                    <div className="font-bold text-gray-900 mb-3">Revolucioni Francez — Klasa 9</div>
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">Histori</span>
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">Klasa 9</span>
                      <span className="text-xs bg-violet-100 text-violet-700 px-2.5 py-1 rounded-full">10 pyetje</span>
                    </div>
                  </div>
                  <div className="space-y-3 mb-5">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                      <span className="text-green-600 text-sm font-bold">✅</span>
                      <span className="text-sm text-gray-700">P1: Kur filloi Revolucioni Francez?</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                      <span className="text-green-600 text-sm font-bold">✅</span>
                      <span className="text-sm text-gray-700">P2: Çfarë ishte Bastilla?</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100 animate-pulse">
                      <span className="text-blue-500 text-sm">⏳</span>
                      <span className="text-sm text-gray-500">Duke gjeneruar P3...</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold">Publiko Kuizin</button>
                    <button className="py-2.5 px-4 border border-gray-200 rounded-xl text-sm font-medium text-gray-600">Ndrysho</button>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-blue-500 text-white px-4 py-2 rounded-xl shadow-lg animate-float text-sm font-bold">⚡ 30 sekonda!</div>
                <div className="absolute -bottom-4 -left-4 bg-violet-500 text-white px-4 py-2 rounded-xl shadow-lg animate-float delay-300 text-sm font-bold">🧠 Fuqizuar me IA</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Demo Modal */}
      {showDemo && <DemoModal onClose={() => setShowDemo(false)} />}
    </section>
  );
}
