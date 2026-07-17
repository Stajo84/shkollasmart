import { 
  GraduationCap, Gamepad2, Trophy, Users, TrendingUp, BarChart3, 
  Eye, Bell, MessageCircle, Wand2, Clock, FileText, 
  ArrowRight, Star, Shield, Heart, Building
} from 'lucide-react';

interface ForWhoProps {
  onStudentClick?: () => void;
  onTeacherClick?: () => void;
}

const audiences = [
  {
    id: 'nxënës',
    emoji: '🎓',
    title: 'Për Nxënës',
    subtitle: 'Mëso duke u argëtuar — kurr më parë kaq bukur!',
    description: 'SmartSchool e kthen çdo mësim në një lojë emocionuese. Garoni me shokët, fitoni pikë, thyeni rekorde dhe bëhuni ekspertë pa e kuptuar fare që po mësoni!',
    gradient: 'from-violet-600 to-purple-600',
    bgGradient: 'from-violet-50 to-purple-50',
    borderColor: 'border-violet-200',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
    features: [
      { icon: Gamepad2, title: 'Kuize Lojërore', desc: 'Luaj kuize interaktive me pikë, kohëmatës dhe efekte argëtuese' },
      { icon: Trophy, title: 'Gara me Shokët', desc: 'Sfidoni shokët në gara live dhe shikoni kush del fitues' },
      { icon: Star, title: 'Pikë & Shpërblime', desc: 'Mblidh pikë, bëhu nivel dhe zhbllo arritje të reja' },
      { icon: GraduationCap, title: 'Mëso Çdo Gjë', desc: 'Mijëra kuize në çdo lëndë — matematikë, shkencë, histori e më tepër' },
    ],
    testimonial: {
      quote: "Me SmartSchool, mësimi është si të luash lojën time të preferuar! Tani mezi pres që të bëj detyrat.",
      author: "Arbi, 12 vjeç",
      role: "Nxënës, Klasa 6 — Tiranë"
    },
    cta: 'Fillo të Mësosh'
  },
  {
    id: 'prindër',
    emoji: '👨‍👩‍👧‍👦',
    title: 'Për Prindër',
    subtitle: 'Jini pjesë e udhëtimit arsimor të fëmijës suaj',
    description: 'Ndiqni çdo hap të fëmijës tuaj. Shikoni progresin, identifikoni nevojat, dhe bashkëpunoni me mësuesit — pa qenë të pranishëm fizikisht në klasë.',
    gradient: 'from-emerald-600 to-teal-600',
    bgGradient: 'from-emerald-50 to-teal-50',
    borderColor: 'border-emerald-200',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    features: [
      { icon: Eye, title: 'Ndiq Progresin', desc: 'Shikoni notat, pikat e forta dhe fushat ku fëmija ka nevojë' },
      { icon: BarChart3, title: 'Raporte të Detajuara', desc: 'Raporte javore me grafike të qarta mbi performancën' },
      { icon: Bell, title: 'Njoftimet', desc: 'Merrni njoftime për detyrat, rezultatet dhe arritjet e reja' },
      { icon: MessageCircle, title: 'Komunikim me Mësuesin', desc: 'Bashkëpunoni direkt me mësuesit për suksesin e fëmijës' },
    ],
    testimonial: {
      quote: "Tani e di saktësisht ku qëndron djali im në çdo lëndë. Ndihem e lidhur me shkollën edhe kur jam në punë.",
      author: "Elona, nënë",
      role: "Prind i 2 fëmijëve — Prishtinë"
    },
    cta: 'Krijo Llogari Prindi'
  },
  {
    id: 'mësues',
    emoji: '👩‍🏫',
    title: 'Për Mësues',
    subtitle: 'Mjete të fuqishme që kursejnë kohë dhe rrisin cilësinë',
    description: 'Krijoni kuize me IA në sekonda, personalizoni materialin për çdo nxënës, dhe merrni njohuri të thella nga të dhënat — gjithçka nga një platformë e vetme.',
    gradient: 'from-blue-600 to-indigo-600',
    bgGradient: 'from-blue-50 to-indigo-50',
    borderColor: 'border-blue-200',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    features: [
      { icon: Wand2, title: 'Gjenerim me IA', desc: 'Krijoni kuize profesionale automatikisht nga çdo temë në sekonda' },
      { icon: Clock, title: 'Kurseni Kohë', desc: 'Reduktoni kohën e përgatitjes deri 80% me mjetet tona inteligjente' },
      { icon: FileText, title: 'Bibliotekë e Pasur', desc: 'Aksesoni mijëra burime të gatshme për çdo lëndë dhe klasë' },
      { icon: TrendingUp, title: 'Analitikë e Avancuar', desc: 'Kuptoni performancën e çdo nxënësi me raporte të detajuara' },
    ],
    testimonial: {
      quote: "SmartSchool ka ndryshuar komplet mënyrën si mësoj. Nxënësit janë 10x më të angazhuar dhe unë kursej orë pune.",
      author: "Mësuese Arta",
      role: "Mësuese Matematike — Durrës"
    },
    cta: 'Fillo si Mësues'
  },
  {
    id: 'koordinatori',
    emoji: '🛡️',
    title: 'Për Koordinatorë',
    subtitle: 'Kontroll dhe menaxhim i plotë i shkollës',
    description: 'Monitoroni performancën e të gjitha klasave, menaxhoni mësuesit dhe nxënësit, dhe merrni raporte të detajuara për mbarëvajtjen e shkollës.',
    gradient: 'from-amber-600 to-orange-600',
    bgGradient: 'from-amber-50 to-orange-50',
    borderColor: 'border-amber-200',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    features: [
      { icon: Building, title: 'Monitorim Klasash', desc: 'Shikoni ecurinë e çdo klase dhe mësuesi në kohë reale' },
      { icon: BarChart3, title: 'Statistika Globale', desc: 'Analizoni performancën e shkollës me raporte interaktive' },
      { icon: Users, title: 'Menaxhim Stafi', desc: 'Administroni llogaritë e mësuesve dhe detyrat e tyre' },
      { icon: Shield, title: 'Siguri e Lartë', desc: 'Menaxhoni privatësinë dhe sigurinë e të dhënave shkollore' },
    ],
    testimonial: {
      quote: "Si koordinator, SmartSchool më ka dhënë një kontroll të plotë mbi ecurinë e shkollës. Çdo gjë është e qartë dhe e organizuar.",
      author: "Sokol Murati",
      role: "Koordinator — Tiranë"
    },
    cta: 'Hyr si Koordinator'
  }
];

export default function ForWho({ onStudentClick, onTeacherClick }: ForWhoProps) {
  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-100 via-emerald-100 to-blue-100 text-gray-700 rounded-full text-sm font-medium mb-4">
            <Users className="w-4 h-4" />
            Për të Gjithë
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Një platformë —{' '}
            <span className="bg-gradient-to-r from-violet-600 via-emerald-600 to-blue-600 bg-clip-text text-transparent">
              katër audienca
            </span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            SmartSchool lidh nxënësit, prindërit dhe mësuesit në një ekosistem të vetëm arsimor — ku secili luan rolin e vet për suksesin e nxënësit.
          </p>
        </div>

        {/* Audience Cards */}
        <div className="space-y-16">
          {audiences.map((audience, index) => (
            <div
              key={audience.id}
              id={audience.id}
              className={`scroll-mt-20 rounded-3xl border ${audience.borderColor} bg-gradient-to-br ${audience.bgGradient} p-8 sm:p-10 lg:p-12 shadow-lg`}
            >
              <div className={`grid lg:grid-cols-2 gap-10 items-start ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                {/* Content Side */}
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{audience.emoji}</span>
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{audience.title}</h3>
                      <p className="text-sm text-gray-500 font-medium">{audience.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-8">
                    {audience.description}
                  </p>

                  {/* Features */}
                  <div className="grid sm:grid-cols-2 gap-4 mb-8">
                    {audience.features.map((feature, i) => (
                      <div key={i} className="flex gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                        <div className={`w-10 h-10 rounded-lg ${audience.iconBg} flex items-center justify-center shrink-0`}>
                          <feature.icon className={`w-5 h-5 ${audience.iconColor}`} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">{feature.title}</div>
                          <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{feature.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={audience.id === 'mësues' ? onTeacherClick : onStudentClick}
                    className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r ${audience.gradient} rounded-xl shadow-lg hover:-translate-y-0.5 transition-all`}
                  >
                    {audience.cta}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Testimonial Side */}
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-white">
                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6 italic">
                      "{audience.testimonial.quote}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${audience.gradient} flex items-center justify-center text-white text-xl shadow-lg`}>
                        {audience.emoji}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{audience.testimonial.author}</div>
                        <div className="text-sm text-gray-500">{audience.testimonial.role}</div>
                      </div>
                    </div>
                  </div>

                  {/* Extra Info Card */}
                  <div className="mt-4 bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${audience.iconBg} flex items-center justify-center`}>
                        {audience.id === 'nxënës' && <Gamepad2 className={`w-5 h-5 ${audience.iconColor}`} />}
                        {audience.id === 'prindër' && <Shield className={`w-5 h-5 ${audience.iconColor}`} />}
                        {audience.id === 'mësues' && <Heart className={`w-5 h-5 ${audience.iconColor}`} />}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">
                          {audience.id === 'nxënës' && '100% Falas për Nxënës'}
                          {audience.id === 'prindër' && 'Privatësi e Garantuar'}
                          {audience.id === 'mësues' && 'Përdorur nga 1M+ Mësues'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {audience.id === 'nxënës' && 'Pa reklama, pa kufizime, pa karta krediti'}
                          {audience.id === 'prindër' && 'Të dhënat e fëmijës suaj janë gjithmonë të sigurta'}
                          {audience.id === 'mësues' && 'Në mbi 150 vende të botës'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
