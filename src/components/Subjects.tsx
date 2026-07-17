import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

const subjects = [
  {
    emoji: "📚",
    name: "Gjuhë Shqipe & Letërsi",
    description: "Pasazhe leximi, video interaktive, flash-karta për fjalor dhe vlerësime për kuptimësinë.",
    features: ["Pasazhe leximi sipas zhanreve", "Video me momente diskutimi", "Flash-karta fjalori", "Teste kuptimësie"],
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200"
  },
  {
    emoji: "🔢",
    name: "Matematikë",
    description: "Prezantime hap-pas-hapi, grafike vizuale, formula dhe ushtrime praktike për fluencë matematikore.",
    features: ["Koncepte hap-pas-hapi", "Grafike vizuale interaktive", "Flash-karta formulash", "Ushtrime praktike"],
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200"
  },
  {
    emoji: "🔬",
    name: "Shkencë",
    description: "Simulime shkencore, skenare të botës reale, fjalor shkencor dhe vlerësime analitike.",
    features: ["Simulime laboratori", "Skenare të botës reale", "Fjalor shkencor", "Pyetje analitike"],
    color: "from-emerald-500 to-green-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200"
  },
  {
    emoji: "🌍",
    name: "Histori & Gjeografi",
    description: "Prezantime të lidhura me ngjarje historike, analiza burimesh primare dhe teste njohurish.",
    features: ["Ngjarje historike kryesore", "Analiza burimesh", "Harta interaktive", "Kronologji dhe teste"],
    color: "from-orange-500 to-amber-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200"
  },
  {
    emoji: "🎨",
    name: "Arsim Fillor",
    description: "Video dhe prezantime të përshtatshme për moshën, flash-karta me imazhe dhe lojëra mësimore.",
    features: ["Përmbajtje sipas moshës", "Imazhe dhe audio", "Lojëra angazhuese", "Mësim i udhëhequr"],
    color: "from-pink-500 to-rose-600",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200"
  },
  {
    emoji: "🌐",
    name: "Gjuhë të Huaja",
    description: "Praktikë dëgjimi dhe foleje, flash-karta fjalori, gramatikë dhe njohuri kulturore.",
    features: ["Dëgjim & folje", "Fjalor me flash-karta", "Gramatikë interaktive", "Njohuri kulturore"],
    color: "from-indigo-500 to-violet-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200"
  }
];

export default function Subjects() {
  const [activeSubject, setActiveSubject] = useState(0);

  return (
    <section id="lëndët" className="py-20 sm:py-28 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
            📖 Lëndët
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Burime mësimore për{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              çdo lëndë
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            Zgjidhni lëndën dhe zbuloni burime të gatshme, të përshtatshme dhe interaktive për klasën tuaj.
          </p>
        </div>

        {/* Subject Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {subjects.map((subject, index) => (
            <button
              key={index}
              onClick={() => setActiveSubject(index)}
              className={`px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeSubject === index
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-violet-300 hover:text-violet-600'
              }`}
            >
              {subject.emoji} {subject.name}
            </button>
          ))}
        </div>

        {/* Active Subject Detail */}
        <div className="max-w-4xl mx-auto">
          <div className={`rounded-3xl border ${subjects[activeSubject].borderColor} bg-white p-8 sm:p-12 shadow-xl shadow-gray-100/50 transition-all duration-500`}>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="text-6xl mb-6">{subjects[activeSubject].emoji}</div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  {subjects[activeSubject].name}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {subjects[activeSubject].description}
                </p>
                <button className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg shadow-violet-200">
                  Fillo Mësimin
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {subjects[activeSubject].features.map((feature, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-4 rounded-xl ${subjects[activeSubject].bgColor} transition-all duration-300`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-lg">
                      {["📝", "🎬", "📇", "✅"][index]}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
