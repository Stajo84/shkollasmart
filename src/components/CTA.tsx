import { ArrowRight, Sparkles } from 'lucide-react';

interface CTAProps {
  onStudentClick?: () => void;
  onTeacherClick?: () => void;
}

export default function CTA({ onStudentClick, onTeacherClick }: CTAProps) {
  return (
    <section className="py-20 sm:py-28 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      {/* Floating Shapes */}
      <div className="absolute top-20 left-20 w-4 h-4 rounded-full bg-white/20 animate-float" />
      <div className="absolute top-40 right-32 w-6 h-6 rounded-full bg-white/10 animate-float delay-200" />
      <div className="absolute bottom-20 left-1/3 w-3 h-3 rounded-full bg-white/15 animate-float delay-400" />
      <div className="absolute bottom-32 right-20 w-5 h-5 rounded-full bg-white/10 animate-float delay-300" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white/80 rounded-full text-sm font-medium mb-6 border border-white/20">
          <Sparkles className="w-4 h-4" />
          Bashkohuni me miliona përdorues
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
          Gati për të transformuar{' '}
          <br className="hidden sm:block" />
          përvojën e mësimit?
        </h2>

        <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
          Nxënës, prindër apo mësues — SmartSchool është platforma që lidh të gjithë në një ekosistem arsimor të jashtëzakonshëm.
        </p>

        {/* Three CTA Buttons */}
        <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
          <button 
            onClick={onStudentClick}
            className="inline-flex items-center justify-center gap-2 px-6 py-4 text-base font-semibold text-violet-700 bg-white rounded-2xl hover:bg-gray-50 transition-all shadow-xl hover:-translate-y-0.5"
          >
            🎓 Jam Nxënës
            <ArrowRight className="w-4 h-4" />
          </button>
          <button 
            onClick={onStudentClick}
            className="inline-flex items-center justify-center gap-2 px-6 py-4 text-base font-semibold text-white bg-white/15 border-2 border-white/30 rounded-2xl hover:bg-white/25 transition-all hover:-translate-y-0.5"
          >
            👨‍👩‍👧‍👦 Jam Prind
            <ArrowRight className="w-4 h-4" />
          </button>
          <button 
            onClick={onTeacherClick}
            className="inline-flex items-center justify-center gap-2 px-6 py-4 text-base font-semibold text-white bg-white/15 border-2 border-white/30 rounded-2xl hover:bg-white/25 transition-all hover:-translate-y-0.5"
          >
            👩‍🏫 Jam Mësues
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-6 text-white/50 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            Pa kartë krediti
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            Konfigurim në 30 sekonda
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            Falas për nxënës & prindër
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            Privatësi e garantuar
          </div>
        </div>
      </div>
    </section>
  );
}
