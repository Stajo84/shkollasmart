import { UserPlus, Search, Play, Trophy } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Regjistrohuni Falas",
    description: "Krijoni llogarinë tuaj falas si mësues ose nxënës. Procesi zgjat vetëm 30 sekonda.",
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-50",
    iconColor: "text-violet-600"
  },
  {
    icon: Search,
    step: "02",
    title: "Zgjidhni ose Krijoni",
    description: "Zbuloni kuize nga biblioteka jonë e pasur ose krijoni tuajën me ndihmën e IA-së.",
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  {
    icon: Play,
    step: "03",
    title: "Luani dhe Mësoni",
    description: "Nxënësit bashkohen me një kod aksesi — pa nevojë për llogari. Mësimi fillon menjëherë!",
    color: "from-emerald-500 to-green-600",
    bgColor: "bg-emerald-50",
    iconColor: "text-emerald-600"
  },
  {
    icon: Trophy,
    step: "04",
    title: "Shikoni Rezultatet",
    description: "Merrni raporte të detajuara në kohë reale dhe festoni progresin e çdo nxënësi.",
    color: "from-orange-500 to-amber-600",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600"
  }
];

export default function HowItWorks() {
  return (
    <section id="si-funksionon" className="py-20 sm:py-28 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-64 h-64 bg-violet-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-indigo-100/40 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
            🚀 Si Funksionon
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Fillo në{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              4 hapa të thjeshtë
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            SmartSchool është krijuar për të qenë i lehtë në përdorim. Në pak minuta, do të jeni gati për mësim interaktiv.
          </p>
        </div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connector Line */}
              {index < 3 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[calc(100%-20%)] h-0.5 bg-gradient-to-r from-gray-200 to-gray-100" />
              )}

              <div className="relative bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:shadow-violet-100/50 transition-all duration-300 hover:-translate-y-2 text-center">
                {/* Step Number */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                  {step.step}
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl ${step.bgColor} flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform`}>
                  <step.icon className={`w-8 h-8 ${step.iconColor}`} />
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl hover:from-violet-700 hover:to-indigo-700 transition-all shadow-xl shadow-violet-200 hover:shadow-violet-300 hover:-translate-y-0.5">
            Fillo Tani — Pa Pagesë
          </button>
        </div>
      </div>
    </section>
  );
}
