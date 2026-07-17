import { Library, Wand2, Upload, Gamepad2, BarChart3, Shield, Headphones, Globe, Layers } from 'lucide-react';

const features = [
  {
    icon: Library,
    title: "Bibliotekë e Pasur",
    description: "Zbulo mijëra kuize dhe burime të gatshme, të harmonizuara me standardet arsimore dhe kurrikulën.",
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-50",
    iconColor: "text-violet-600"
  },
  {
    icon: Wand2,
    title: "IA për Personalizim",
    description: "Përdor inteligjencën artificiale për të përshtatur materialin sipas nivelit të çdo nxënësi automatikisht.",
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  {
    icon: Upload,
    title: "Importo & Personalizo",
    description: "Importo materialet e tua dhe personalizo ato me dhjetëra lloje pyetjesh dhe formatesh.",
    color: "from-emerald-500 to-green-600",
    bgColor: "bg-emerald-50",
    iconColor: "text-emerald-600"
  },
  {
    icon: Gamepad2,
    title: "Mësim Lojëror",
    description: "Motivoni çdo nxënës me elementë loje — pikë, renditje, sfida dhe shpërblime.",
    color: "from-orange-500 to-amber-600",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600"
  },
  {
    icon: BarChart3,
    title: "Të Dhëna në Kohë Reale",
    description: "Merrni raporte të menjëhershme për performancën e nxënësve dhe identifikoni pikat e dobëta.",
    color: "from-pink-500 to-rose-600",
    bgColor: "bg-pink-50",
    iconColor: "text-pink-600"
  },
  {
    icon: Shield,
    title: "Siguri & Privatësi",
    description: "Mbrojtje e avancuar e të dhënave me siguri të nivelit enterprise dhe marrëveshje privatësie.",
    color: "from-teal-500 to-cyan-600",
    bgColor: "bg-teal-50",
    iconColor: "text-teal-600"
  },
  {
    icon: Headphones,
    title: "Akomodime të Personalizuara",
    description: "Vendosni 20+ modifikime dhe akomodime unike për çdo nxënës pa i dalluar ata.",
    color: "from-indigo-500 to-violet-600",
    bgColor: "bg-indigo-50",
    iconColor: "text-indigo-600"
  },
  {
    icon: Globe,
    title: "Akses Global",
    description: "Funksionon në çdo pajisje me shfletues — pa nevojë për llogari individuale të nxënësve.",
    color: "from-purple-500 to-fuchsia-600",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600"
  },
  {
    icon: Layers,
    title: "Integrime të Thjeshta",
    description: "Lidhet pa problem me sistemet ekzistuese të shkollës — Google Classroom, Canvas, dhe më tepër.",
    color: "from-red-500 to-orange-600",
    bgColor: "bg-red-50",
    iconColor: "text-red-600"
  }
];

export default function Features() {
  return (
    <section id="veçori" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-medium mb-4">
            ✨ Veçoritë Kryesore
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Gjithçka që ju nevojitet për një{' '}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              mësim të suksesshëm
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            Nga krijimi i kuizeve deri te analiza e performancës, SmartSchool ofron mjete të fuqishme për çdo mësues dhe nxënës.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:shadow-violet-100/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
