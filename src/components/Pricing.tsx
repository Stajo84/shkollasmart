import { Check, Crown, Building, GraduationCap, Heart } from 'lucide-react';

interface PricingProps {
  onTeacherClick?: () => void;
  onStudentClick?: () => void;
}

const plans = [
  {
    name: "Nxënës & Prindër",
    price: "0",
    period: "përgjithmonë falas",
    description: "Plotësisht falas për nxënës dhe prindër. Pa kufizime, pa reklama.",
    icon: GraduationCap,
    emoji: "🎓👨‍👩‍👧‍👦",
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    iconColor: "text-emerald-600",
    features: [
      "Akses i plotë në kuize",
      "Panel prindi — ndiq progresin",
      "Raporte performance",
      "Njoftime për prindër",
      "Gara me shokët",
      "Pikë & arritje",
      "Pa reklama",
      "Në çdo pajisje"
    ],
    cta: "Regjistrohu Falas",
    popular: false,
    highlight: true
  },
  {
    name: "Mësues Pro",
    price: "8",
    period: "/muaj",
    description: "Mjete të avancuara për mësues që duan të japin maksimumin.",
    icon: Crown,
    emoji: "👩‍🏫",
    color: "from-violet-500 to-indigo-600",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
    iconColor: "text-violet-600",
    features: [
      "Kuize të pakufizuara",
      "Gjenerim me IA",
      "Raporte të avancuara",
      "Nxënës & klasa të pakufizuara",
      "Akomodime nxënësish",
      "Komunikim me prindër",
      "Bibliotekat premium",
      "Mbështetje prioritare"
    ],
    cta: "Provo 14 Ditë Falas",
    popular: true,
    highlight: false
  },
  {
    name: "Shkollë / Institucion",
    price: "Kontakt",
    period: "",
    description: "Për shkolla që duan SmartSchool për të gjithë — nxënës, prindër dhe mësues.",
    icon: Building,
    emoji: "🏫",
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    iconColor: "text-blue-600",
    features: [
      "Gjithçka në Mësues Pro",
      "Panel administrimi shkollor",
      "Integrime LMS",
      "Portal prindërish i dedikuar",
      "Trajnim i stafit",
      "Analitikë e shkollës",
      "Kontrata privatësie",
      "Mbështetje 24/7"
    ],
    cta: "Na Kontaktoni",
    popular: false,
    highlight: false
  }
];

export default function Pricing({ onTeacherClick, onStudentClick }: PricingProps) {
  return (
    <section id="çmimet" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-4">
            💰 Çmimet
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Falas për nxënës & prindër,{' '}
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              i përballueshëm
            </span>{' '}
            për mësues
          </h2>
          <p className="text-lg text-gray-600">
            Besojmë se arsimi cilësor duhet të jetë i aksesueshëm. Prandaj, nxënësit dhe prindërit e përdorin SmartSchool plotësisht falas.
          </p>
        </div>

        {/* Free banner */}
        <div className="max-w-3xl mx-auto mb-10 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shrink-0 shadow-lg">
            <Heart className="w-7 h-7 text-white" />
          </div>
          <div className="text-center sm:text-left">
            <div className="font-bold text-gray-900 text-lg">🎓 Falas për nxënës · 👨‍👩‍👧‍👦 Falas për prindër</div>
            <div className="text-sm text-gray-600">Nxënësit luajnë kuize pa limit. Prindërit ndjekin progresin. Pa karta krediti, pa reklama, pa kufizime.</div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1 ${
                plan.popular
                  ? 'border-violet-200 bg-white shadow-xl shadow-violet-100/50 ring-2 ring-violet-500/20'
                  : plan.highlight
                  ? `${plan.borderColor} bg-gradient-to-br from-emerald-50/50 to-teal-50/50 hover:shadow-lg`
                  : `${plan.borderColor} bg-white hover:shadow-lg`
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold rounded-full shadow-lg">
                  PËR MËSUES
                </div>
              )}

              <div className="text-2xl mb-3">{plan.emoji}</div>

              <div className={`w-12 h-12 rounded-xl ${plan.bgColor} flex items-center justify-center mb-4`}>
                <plan.icon className={`w-6 h-6 ${plan.iconColor}`} />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{plan.description}</p>

              <div className="mb-6">
                {plan.price === "Kontakt" ? (
                  <div className="text-3xl font-bold text-gray-900">Na Kontaktoni</div>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-gray-900">€{plan.price}</span>
                    <span className="text-gray-500 text-sm">{plan.period}</span>
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                    <Check className={`w-4 h-4 shrink-0 ${plan.popular ? 'text-violet-600' : plan.highlight ? 'text-emerald-500' : 'text-blue-500'}`} />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={plan.popular ? onTeacherClick : plan.highlight ? onStudentClick : undefined}
                className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200 hover:shadow-violet-300'
                    : plan.highlight
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-200 hover:shadow-emerald-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
