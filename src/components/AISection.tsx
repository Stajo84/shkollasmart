import { Brain, Sparkles, Target, Eye, Shield, Lightbulb } from 'lucide-react';

const aiFeatures = [
  {
    icon: Sparkles,
    title: "Gjenerim i Kuizeve me IA",
    description: "Gjeneroni kuize të sakta dhe të shpejta me inteligjencë artificiale — kurseni orë pune çdo javë."
  },
  {
    icon: Target,
    title: "Personalizim Automatik",
    description: "IA përshtat nivelin e vështirësisë sipas aftësive të çdo nxënësi automatikisht."
  },
  {
    icon: Eye,
    title: "Analizë e Thellë",
    description: "Kuptoni pikat e forta dhe të dobëta me raporte të detajuara nga IA."
  }
];

const principles = [
  {
    icon: Lightbulb,
    text: "Amplifikoni përvojat njerëzore, jo izolimin dixhital"
  },
  {
    icon: Shield,
    text: "Respektoni autonominë e mësuesit, duke kursyer kohën"
  },
  {
    icon: Brain,
    text: "Prioritizoni privatësinë dhe ndikimin pozitiv"
  }
];

export default function AISection() {
  return (
    <section id="ia" className="py-20 sm:py-28 bg-gradient-to-b from-gray-900 via-gray-900 to-violet-950 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/20 text-violet-300 rounded-full text-sm font-medium mb-6 border border-violet-500/30">
              <Brain className="w-4 h-4" />
              Inteligjencë Artificiale
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Qasja jonë ndaj{' '}
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                Inteligjencës Artificiale
              </span>
            </h2>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              IA-ja jonë është projektuar për të ndihmuar mësuesit, jo për t'i zëvendësuar. Çdo funksion është menduar me kujdes për të rritur efikasitetin pa kompromentuar cilësinë.
            </p>

            {/* AI Features */}
            <div className="space-y-6">
              {aiFeatures.map((feature, index) => (
                <div key={index} className="flex gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center shrink-0 group-hover:bg-violet-500/30 transition-colors border border-violet-500/20">
                    <feature.icon className="w-6 h-6 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{feature.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Principles */}
          <div>
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-white/10">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">IA ku ka rëndësi</h3>
                <p className="text-gray-400 text-sm">Parimet tona udhëzuese</p>
              </div>

              <div className="space-y-4">
                {principles.map((principle, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-violet-500/20 to-indigo-500/20 flex items-center justify-center shrink-0">
                      <principle.icon className="w-5 h-5 text-violet-400" />
                    </div>
                    <p className="text-sm text-gray-300 font-medium">{principle.text}</p>
                  </div>
                ))}
              </div>

              {/* Visual Decoration */}
              <div className="mt-8 grid grid-cols-3 gap-3">
                <div className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-violet-400" />
                <div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400" />
                <div className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
