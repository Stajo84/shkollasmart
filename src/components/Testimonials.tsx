import { Star, Quote } from 'lucide-react';
import { useState } from 'react';

type RoleFilter = 'të gjithë' | 'nxënës' | 'prindër' | 'mësues';

const testimonials = [
  {
    name: "Arbi Gashi",
    role: "Nxënës, Klasa 7",
    location: "Tiranë",
    category: "nxënës" as const,
    avatar: "🎓",
    quote: "Me SmartSchool, mësimi është si të luash lojën time të preferuar! Garoj me shokët çdo ditë dhe tani jam i pari në klasë. Mezi pres detyrat tani!",
    rating: 5
  },
  {
    name: "Arta Krasniqi",
    role: "Mësuese Matematike",
    location: "Durrës",
    category: "mësues" as const,
    avatar: "👩‍🏫",
    quote: "SmartSchool u jep nxënësve të mi mundësinë të ndërveprojnë me përmbajtjen. Kam mësuar gjeometrinë ekskluzivisht me SmartSchool dhe rezultatet janë të jashtëzakonshme.",
    rating: 5
  },
  {
    name: "Elona Berisha",
    role: "Nënë e 2 fëmijëve",
    location: "Prishtinë",
    category: "prindër" as const,
    avatar: "👩",
    quote: "Tani e di saktësisht ku qëndron djali im në çdo lëndë. Raportet javore janë fantastike — ndihem e lidhur me shkollën edhe kur jam në punë. Faleminderit SmartSchool!",
    rating: 5
  },
  {
    name: "Lira Mehmeti",
    role: "Nxënëse, Klasa 9",
    location: "Shkodër",
    category: "nxënës" as const,
    avatar: "👧",
    quote: "Nuk më ka pëlqyer kurr matematika derisa provova SmartSchool. Tani zgjidh ushtrime si lojë dhe nota ime u rrit nga 6 në 9! Është e mrekullueshme.",
    rating: 5
  },
  {
    name: "Besnik Hoxha",
    role: "Mësues Shkence",
    location: "Elbasan",
    category: "mësues" as const,
    avatar: "👨‍🔬",
    quote: "Shkolla jonë ka përmirësuar normat e kalimit me mbi 20%. SmartSchool më lejon të shoh cilët nxënës kanë vështirësi dhe t'u ofroj ndërhyrje menjëherë.",
    rating: 5
  },
  {
    name: "Dritan Hoxha",
    role: "Baba i 3 fëmijëve",
    location: "Korçë",
    category: "prindër" as const,
    avatar: "👨",
    quote: "Fëmijët e mi tani duan të mësojnë! Para SmartSchool, ishte luftë çdo ditë me detyrat. Tani ata vetë kërkojnë të luajnë kuize. Si prind, jam tepër i kënaqur.",
    rating: 5
  },
  {
    name: "Erisa Bala",
    role: "Nxënëse, Klasa 5",
    location: "Vlorë",
    category: "nxënës" as const,
    avatar: "🧒",
    quote: "Unë dhe shoqja ime garojmë çdo ditë në kuize! Është shumë argëtuese dhe tani i di të gjitha kryeqytetet e Evropës. Mësuesi na lavdëron gjithmonë!",
    rating: 5
  },
  {
    name: "Flora Gashi",
    role: "Mësuese Fillore",
    location: "Pejë",
    category: "mësues" as const,
    avatar: "🌸",
    quote: "Mjeti i gjenerimit me IA është i jashtëzakonshëm! Krijoj kuize profesionale në 30 sekonda. Para përdorja 2 orë për t'i përgatitur. Kjo platformë është revolucionare.",
    rating: 5
  },
  {
    name: "Lindita Malaj",
    role: "Nënë",
    location: "Tiranë",
    category: "prindër" as const,
    avatar: "👩‍🦰",
    quote: "Njoftimet që marr janë fantastike — di kur vajza ime përfundon një kuiz, çfarë note mori, dhe ku ka nevojë për ndihmë. Komunikimi me mësuesen është i shkëlqyer.",
    rating: 5
  },
  {
    name: "Sokol Murati",
    role: "Koordinator Shkolle",
    location: "Tiranë",
    category: "koordinatori" as const,
    avatar: "🛡️",
    quote: "Si koordinator, SmartSchool më ka dhënë një kontroll të plotë mbi ecurinë e shkollës. Mund të shoh performancën e çdo klase në kohë reale dhe të ndihmoj mësuesit ku duhet.",
    rating: 5
  },
];

const filterButtons: { label: string; value: RoleFilter; emoji: string; color: string }[] = [
  { label: 'Të Gjithë', value: 'të gjithë', emoji: '✨', color: 'from-violet-600 to-indigo-600' },
  { label: 'Nxënës', value: 'nxënës', emoji: '🎓', color: 'from-violet-600 to-purple-600' },
  { label: 'Prindër', value: 'prindër', emoji: '👨‍👩‍👧‍👦', color: 'from-emerald-600 to-teal-600' },
  { label: 'Mësues', value: 'mësues', emoji: '👩‍🏫', color: 'from-blue-600 to-indigo-600' },
  { label: 'Koordinatorë', value: 'koordinatori' as RoleFilter, emoji: '🛡️', color: 'from-amber-600 to-orange-600' },
];

export default function Testimonials() {
  const [filter, setFilter] = useState<RoleFilter>('të gjithë');

  const filtered = filter === 'të gjithë'
    ? testimonials
    : testimonials.filter(t => t.category === filter);

  const categoryColors = {
    nxënës: 'bg-violet-100 text-violet-700',
    prindër: 'bg-emerald-100 text-emerald-700',
    mësues: 'bg-blue-100 text-blue-700',
    koordinatori: 'bg-amber-100 text-amber-700',
  };

  const categoryBorder = {
    nxënës: 'hover:border-violet-200',
    prindër: 'hover:border-emerald-200',
    mësues: 'hover:border-blue-200',
    koordinatori: 'hover:border-amber-200',
  };

  return (
    <section id="dëshmitë" className="py-20 sm:py-28 bg-gradient-to-b from-white to-violet-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-medium mb-4">
            💬 Dëshmitë
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Çfarë thonë{' '}
            <span className="bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-transparent">
              nxënësit, prindërit dhe mësuesit
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            Mijëra familje dhe mësues po përdorin SmartSchool çdo ditë. Dëgjojini vetë.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filterButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => setFilter(btn.value)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                filter === btn.value
                  ? `bg-gradient-to-r ${btn.color} text-white shadow-lg`
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {btn.emoji} {btn.label}
            </button>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((testimonial, index) => (
            <div
              key={`${testimonial.name}-${index}`}
              className={`relative p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${categoryBorder[testimonial.category]}`}
            >
              {/* Category Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[testimonial.category]}`}>
                  {testimonial.category === 'nxënës' && '🎓 Nxënës'}
                  {testimonial.category === 'prindër' && '👨‍👩‍👧‍👦 Prind'}
                  {testimonial.category === 'mësues' && '👩‍🏫 Mësues'}
                </span>
                <Quote className="w-6 h-6 text-gray-100" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-100 to-indigo-100 flex items-center justify-center text-xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-xs text-gray-500">{testimonial.role} · {testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
