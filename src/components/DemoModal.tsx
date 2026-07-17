import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Sparkles, Users, BookOpen, Brain, Trophy, ClipboardList, Image } from 'lucide-react';

interface DemoStep {
  title: string;
  description: string;
  emoji: string;
  visual: 'dashboard' | 'ai-tools' | 'live' | 'test' | 'results';
  color: string;
}

const STEPS: DemoStep[] = [
  {
    title: 'Hyr si Mësues',
    description: 'Shkruani email-in dhe fjalëkalimin tuaj. Në sekonda jeni brenda panelit të mësuesit me klasat dhe mjetet AI.',
    emoji: '👩‍🏫',
    visual: 'dashboard',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    title: '11 Mjete AI të Gatshme',
    description: 'Gjeneroni prezantime, teste, infografika, leksione, plane ditare — gjithçka me një klik. AI punon për ju!',
    emoji: '🧠',
    visual: 'ai-tools',
    color: 'from-violet-500 to-purple-600',
  },
  {
    title: 'Prezantim Live me Nxënës',
    description: 'Filloni prezantimin live — nxënësit bashkohen me kod 6-shifror, përgjigjen pyetjeve dhe garojnë për pikë!',
    emoji: '📡',
    visual: 'live',
    color: 'from-red-500 to-rose-600',
  },
  {
    title: 'Teste Zyrtare PDF',
    description: '7 lloje pyetjesh, skemë vlerësimi, tabelë notash — shkarkoni PDF të gatshëm për printim brenda sekondash.',
    emoji: '📝',
    visual: 'test',
    color: 'from-gray-700 to-gray-900',
  },
  {
    title: 'Rezultate në Kohë Reale',
    description: 'Ndiqni performancën e nxënësve, shikoni leaderboard-in live dhe merrni raporte të detajuara menjëherë.',
    emoji: '🏆',
    visual: 'results',
    color: 'from-amber-500 to-orange-600',
  },
];

function DemoVisual({ visual, step }: { visual: string; step: number }) {
  const [animate, setAnimate] = useState(false);
  useEffect(() => { setAnimate(false); const t = setTimeout(() => setAnimate(true), 100); return () => clearTimeout(t); }, [step]);

  const base = `transition-all duration-700 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`;

  if (visual === 'dashboard') {
    return (
      <div className={`bg-white rounded-2xl shadow-xl p-5 border border-gray-100 ${base}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center"><BookOpen className="w-4 h-4 text-white" /></div>
          <div className="text-sm font-bold text-gray-900">Dashboard i Mësuesit</div>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[{ n: '5', l: 'Klasa', c: 'bg-blue-100 text-blue-700' }, { n: '126', l: 'Nxënës', c: 'bg-emerald-100 text-emerald-700' }, { n: '11', l: 'AI Mjete', c: 'bg-violet-100 text-violet-700' }].map((s, i) => (
            <div key={i} className={`${s.c} rounded-xl p-2.5 text-center`}>
              <div className="text-lg font-black">{s.n}</div>
              <div className="text-[10px] font-medium">{s.l}</div>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {['Matematikë 7A', 'Gjuhë Shqipe 8B'].map((c, i) => (
            <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl ${i === 0 ? 'bg-violet-50 border border-violet-200' : 'bg-gray-50 border border-gray-100'}`}>
              <div className={`w-8 h-8 rounded-lg ${i === 0 ? 'bg-violet-500' : 'bg-blue-500'} flex items-center justify-center text-white text-xs font-bold`}>{c[0]}</div>
              <div className="text-xs"><div className="font-bold text-gray-900">{c}</div><div className="text-gray-500">24 nxënës</div></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (visual === 'ai-tools') {
    return (
      <div className={`space-y-3 ${base}`}>
        {[
          { icon: Sparkles, label: 'Prezantim PPTX', color: 'from-violet-500 to-indigo-600' },
          { icon: ClipboardList, label: 'Test Kontrolli PDF', color: 'from-gray-700 to-gray-900' },
          { icon: Image, label: 'Infografik', color: 'from-fuchsia-500 to-violet-600' },
          { icon: Brain, label: 'Leksion me AI', color: 'from-blue-500 to-indigo-600' },
        ].map((t, i) => (
          <div key={i} className={`flex items-center gap-3 p-3 rounded-xl bg-white shadow-md border border-gray-100 ${i === 0 ? 'ring-2 ring-violet-400 scale-[1.02]' : ''}`}
            style={{ transitionDelay: `${i * 100}ms` }}>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center`}>
              <t.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-sm font-bold text-gray-900">{t.label}</div>
            {i === 0 && <span className="ml-auto text-[10px] font-bold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">Live ✨</span>}
          </div>
        ))}
      </div>
    );
  }

  if (visual === 'live') {
    return (
      <div className={`bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-5 text-white shadow-xl ${base}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold text-red-300">LIVE</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-white/15 rounded-lg">
            <Users className="w-3.5 h-3.5" />
            <span className="text-xs font-bold">24</span>
          </div>
        </div>
        <div className="text-center mb-4">
          <div className="text-xs text-white/50 mb-1">Kodi:</div>
          <div className="text-3xl font-mono font-black tracking-[0.3em]">847295</div>
        </div>
        <div className="bg-white/10 rounded-xl p-3 mb-3">
          <div className="text-xs text-white/60 mb-1">❓ Pyetje 3/8</div>
          <div className="text-sm font-bold">Cili është kryeqyteti i Shqipërisë?</div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {['A) Tiranë', 'B) Durrës', 'C) Vlorë', 'D) Shkodër'].map((o, i) => (
            <div key={i} className={`p-2 rounded-lg text-xs font-medium text-center ${i === 0 ? 'bg-green-500/30 border border-green-400' : 'bg-white/10 border border-white/20'}`}>{o}</div>
          ))}
        </div>
      </div>
    );
  }

  if (visual === 'test') {
    return (
      <div className={`bg-white rounded-2xl shadow-xl p-5 border border-gray-100 ${base}`}>
        <div className="text-center border-b border-gray-200 pb-3 mb-4">
          <div className="text-xs text-gray-400">Shkolla: _______ | Data: __/__</div>
          <div className="text-sm font-black text-gray-900 mt-1">TEST KONTROLLI</div>
          <div className="text-xs text-gray-600">Matematikë — Klasa 7</div>
        </div>
        <div className="space-y-3">
          {['1. Pyetje Objektive', '2. Përgjigje të Shkurtër', '3. Analizë'].map((s, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-2.5">
              <div className="text-xs font-bold text-gray-800">{s}</div>
              <div className="flex gap-1 mt-1">{[...Array(3)].map((_, j) => <div key={j} className="h-1.5 flex-1 bg-gray-200 rounded" />)}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <div className="flex-1 py-1.5 bg-gray-800 text-white rounded-lg text-[10px] font-bold text-center">Shkarko PDF</div>
          <div className="flex-1 py-1.5 bg-amber-500 text-white rounded-lg text-[10px] font-bold text-center">Çelësi</div>
        </div>
      </div>
    );
  }

  // results
  return (
    <div className={`bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white shadow-xl ${base}`}>
      <div className="text-center mb-4">
        <Trophy className="w-10 h-10 text-yellow-200 mx-auto mb-2" />
        <div className="text-sm font-bold">Leaderboard Live</div>
      </div>
      <div className="space-y-2">
        {[{ n: 'Arta G.', p: 850, e: '🥇' }, { n: 'Erion M.', p: 720, e: '🥈' }, { n: 'Lira B.', p: 680, e: '🥉' }].map((s, i) => (
          <div key={i} className="flex items-center gap-3 bg-white/15 rounded-xl p-2.5">
            <span className="text-lg">{s.e}</span>
            <span className="text-sm font-bold flex-1">{s.n}</span>
            <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded">{s.p} pikë</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface Props { onClose: () => void }

export default function DemoModal({ onClose }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Auto-advance every 4 seconds
  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % STEPS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [autoPlay]);

  const step = STEPS[currentStep];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Play className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Demo Interaktiv — SmartSchool</h2>
              <p className="text-xs text-gray-500">Shikoni si funksionon platforma në 5 hapa</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left — Info */}
            <div className="p-8 flex flex-col justify-center">
              {/* Step indicator */}
              <div className="flex items-center gap-2 mb-6">
                {STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setCurrentStep(i); setAutoPlay(false); }}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === currentStep ? 'w-8 bg-gradient-to-r ' + STEPS[i].color : 'w-3 bg-gray-200'
                    }`}
                  />
                ))}
                <button
                  onClick={() => setAutoPlay(!autoPlay)}
                  className={`ml-2 p-1 rounded-full transition-colors ${autoPlay ? 'bg-violet-100 text-violet-600' : 'bg-gray-100 text-gray-400'}`}
                  title={autoPlay ? 'Ndalo autoplay' : 'Fillo autoplay'}
                >
                  <Play className="w-3 h-3" />
                </button>
              </div>

              {/* Step number */}
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${step.color} text-white w-fit mb-4`}>
                Hapi {currentStep + 1} / {STEPS.length}
              </div>

              {/* Emoji + Title */}
              <div className="text-5xl mb-4">{step.emoji}</div>
              <h3 className="text-2xl font-black text-gray-900 mb-3 leading-tight">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-8">{step.description}</p>

              {/* Navigation */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setCurrentStep(Math.max(0, currentStep - 1)); setAutoPlay(false); }}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-medium disabled:opacity-30 hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Para
                </button>
                <button
                  onClick={() => {
                    if (currentStep === STEPS.length - 1) { onClose(); }
                    else { setCurrentStep(currentStep + 1); setAutoPlay(false); }
                  }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r ${step.color} text-white font-semibold hover:-translate-y-0.5 transition-all shadow-lg`}
                >
                  {currentStep === STEPS.length - 1 ? 'Fillo Tani!' : 'Tjetra'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right — Visual */}
            <div className={`bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center min-h-[400px]`}>
              <div className="w-full max-w-xs">
                <DemoVisual visual={step.visual} step={currentStep} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
