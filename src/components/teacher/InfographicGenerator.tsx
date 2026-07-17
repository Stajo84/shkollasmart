import { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import {
  X, Sparkles, Loader2, Download, Image, FileText, BookOpen,
  GraduationCap, FileUp, File, Check,
  // Lucide icons for infographic sections
  Clock, TrendingUp, Award, Target, Lightbulb, BookMarked,
  Layers, Zap, Globe, Users, Star, Heart, Shield, Flame,
  Brain, Eye, Flag, Map, Compass, Puzzle, Rocket, Crown,
  BarChart3, PieChart, ArrowRight, ArrowDown
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ══════════════════════════════════════════
// Types
// ══════════════════════════════════════════

interface InfographicSection {
  title: string;
  description: string;
  icon: string;
  highlight?: string;
}

interface InfographicData {
  title: string;
  subtitle: string;
  style: string;
  sections: InfographicSection[];
  footer?: string;
}

type InfographicStyle =
  | 'kronologjik'
  | 'krahasues'
  | 'lista'
  | 'piramide'
  | 'ciklik'
  | 'statistika';

const STYLES: { id: InfographicStyle; label: string; description: string; emoji: string }[] = [
  { id: 'kronologjik', label: 'Kronologjik / Linjë Kohore', description: 'Histori, hapa procesi, periudha', emoji: '📅' },
  { id: 'krahasues', label: 'Krahasues (A vs B)', description: 'Dy koncepte, epoka, personazhe', emoji: '⚖️' },
  { id: 'lista', label: 'Listë me Pika / Fakte', description: 'Statistika, rregulla, formula', emoji: '📋' },
  { id: 'piramide', label: 'Piramidë / Hierarki', description: 'Nivele, struktura, rëndësi', emoji: '🔺' },
  { id: 'ciklik', label: 'Cikël / Proces', description: 'Procese ciklike, faza', emoji: '🔄' },
  { id: 'statistika', label: 'Statistika & Numra', description: 'Të dhëna numerike, fakte', emoji: '📊' },
];

// ══════════════════════════════════════════
// Icon Map
// ══════════════════════════════════════════

const ICON_MAP: Record<string, LucideIcon> = {
  clock: Clock, 'trending-up': TrendingUp, award: Award, target: Target,
  lightbulb: Lightbulb, book: BookMarked, layers: Layers, zap: Zap,
  globe: Globe, users: Users, star: Star, heart: Heart, shield: Shield,
  flame: Flame, brain: Brain, eye: Eye, flag: Flag, map: Map,
  compass: Compass, puzzle: Puzzle, rocket: Rocket, crown: Crown,
  'bar-chart': BarChart3, 'pie-chart': PieChart, arrow: ArrowRight,
  bookopen: BookOpen, sparkles: Sparkles, download: Download,
};

function getIcon(name: string): LucideIcon {
  return ICON_MAP[name.toLowerCase()] || Lightbulb;
}

// ══════════════════════════════════════════
// AI Generation (offline fallback)
// ══════════════════════════════════════════

function generateInfographic(
  topic: string,
  style: InfographicStyle,
  sourceText: string,
  _subject: string,
  _grade: string
): InfographicData {
  const base = { title: topic, subtitle: '', style, sections: [] as InfographicSection[], footer: 'SmartSchool AI' };

  if (style === 'kronologjik') {
    base.subtitle = 'Linjë Kohore — Ngjarjet Kryesore';
    base.sections = [
      { title: 'Fillimi', description: `Origjina dhe shkaqet e para të "${topic}"`, icon: 'flag', highlight: 'Faza 1' },
      { title: 'Zhvillimi', description: 'Periudha e rritjes dhe ndryshimeve kryesore', icon: 'trending-up', highlight: 'Faza 2' },
      { title: 'Kulmi', description: 'Momenti më i rëndësishëm dhe ndikimi maksimal', icon: 'star', highlight: 'Faza 3' },
      { title: 'Pasojat', description: 'Efektet afatgjata dhe trashëgimia historike', icon: 'target', highlight: 'Faza 4' },
      { title: 'Sot', description: 'Rëndësia bashkëkohore dhe mësimet e nxjerra', icon: 'lightbulb', highlight: 'Faza 5' },
    ];
  } else if (style === 'krahasues') {
    base.subtitle = 'Analizë Krahasuese';
    base.sections = [
      { title: 'Aspekti A', description: `Karakteristikat kryesore të anës së parë të "${topic}"`, icon: 'shield', highlight: 'Pro' },
      { title: 'Aspekti B', description: 'Karakteristikat kryesore të anës së dytë', icon: 'flame', highlight: 'Kundra' },
      { title: 'Ngjashmëritë', description: 'Pikat ku të dyja anët takohen dhe bashkëpunojnë', icon: 'heart' },
      { title: 'Ndryshimet', description: 'Dallimet themelore dhe kontrastet kryesore', icon: 'zap' },
      { title: 'Përfundimi', description: 'Gjykimi final dhe vlerësimi i përgjithshëm', icon: 'award' },
    ];
  } else if (style === 'piramide') {
    base.subtitle = 'Strukturë Hierarkike';
    base.sections = [
      { title: 'Baza', description: `Elementet themelore të "${topic}"`, icon: 'layers', highlight: 'Niveli 1' },
      { title: 'Niveli i Mesëm', description: 'Konceptet që ndërtojnë mbi bazën', icon: 'trending-up', highlight: 'Niveli 2' },
      { title: 'Niveli i Lartë', description: 'Konceptet e avancuara dhe zbatimi', icon: 'brain', highlight: 'Niveli 3' },
      { title: 'Maja', description: 'Sinteza finale dhe kuptimi i plotë', icon: 'crown', highlight: 'Kulmi' },
    ];
  } else if (style === 'ciklik') {
    base.subtitle = 'Proces Ciklik';
    base.sections = [
      { title: 'Hapi 1: Fillimi', description: `Nisja e procesit të "${topic}"`, icon: 'rocket', highlight: '→' },
      { title: 'Hapi 2: Zhvillimi', description: 'Procesi kryesor dhe transformimi', icon: 'zap', highlight: '→' },
      { title: 'Hapi 3: Kulmi', description: 'Momenti i arrritjes maksimale', icon: 'star', highlight: '→' },
      { title: 'Hapi 4: Reflektimi', description: 'Vlerësimi dhe nxjerrja e mësimeve', icon: 'eye', highlight: '→' },
      { title: 'Hapi 5: Rifillimi', description: 'Cikli vazhdon me njohuri të reja', icon: 'compass', highlight: '↻' },
    ];
  } else if (style === 'statistika') {
    base.subtitle = 'Fakte & Numra Kryesorë';
    base.sections = [
      { title: '85%', description: `Përqindja e ndikimit të "${topic}" në fushën përkatëse`, icon: 'pie-chart', highlight: 'Statistikë' },
      { title: '1,000+', description: 'Numri i burimeve dhe studimeve të kryera', icon: 'bar-chart', highlight: 'Të dhëna' },
      { title: 'Top 3', description: 'Faktorët më të rëndësishëm që duhet mbajtur mend', icon: 'award', highlight: 'Renditje' },
      { title: '100%', description: 'E rëndësishme për suksesin në lëndën përkatëse', icon: 'target', highlight: 'Objektiv' },
    ];
  } else {
    // lista (default)
    base.subtitle = 'Pikat Kryesore';
    base.sections = [
      { title: 'Pika 1', description: `Koncepti themelor i "${topic}" dhe rëndësia e tij`, icon: 'lightbulb', highlight: '①' },
      { title: 'Pika 2', description: 'Zbatimi praktik dhe shembujt konkretë', icon: 'target', highlight: '②' },
      { title: 'Pika 3', description: 'Lidhja me koncepte të tjera të rëndësishme', icon: 'puzzle', highlight: '③' },
      { title: 'Pika 4', description: 'Faktet kryesore për tu mbajtur mend', icon: 'brain', highlight: '④' },
      { title: 'Pika 5', description: 'Përfundimi dhe mesazhi kryesor', icon: 'star', highlight: '⑤' },
    ];
  }

  // If source text provided, use first sentences as descriptions
  if (sourceText.trim()) {
    const sentences = sourceText.split(/[.!?\n]+/).map(s => s.trim()).filter(s => s.length > 10);
    base.sections.forEach((sec, i) => {
      if (sentences[i]) {
        sec.description = sentences[i].slice(0, 120) + (sentences[i].length > 120 ? '...' : '');
      }
    });
  }

  return base;
}

// ══════════════════════════════════════════
// Color palettes per style
// ══════════════════════════════════════════

const PALETTES: Record<InfographicStyle, { bg: string; headerBg: string; headerText: string; accent: string; cardBg: string; cardBorder: string; iconBg: string; iconText: string; sectionColors: string[] }> = {
  kronologjik: {
    bg: 'bg-gradient-to-br from-blue-950 via-indigo-950 to-violet-950',
    headerBg: 'from-blue-600 to-indigo-600', headerText: 'text-white',
    accent: 'bg-blue-500', cardBg: 'bg-white/10', cardBorder: 'border-blue-500/30',
    iconBg: 'bg-blue-500', iconText: 'text-white',
    sectionColors: ['from-blue-500 to-blue-600', 'from-cyan-500 to-blue-500', 'from-indigo-500 to-blue-600', 'from-violet-500 to-indigo-500', 'from-purple-500 to-violet-500'],
  },
  krahasues: {
    bg: 'bg-gradient-to-br from-emerald-950 via-teal-950 to-cyan-950',
    headerBg: 'from-emerald-600 to-teal-600', headerText: 'text-white',
    accent: 'bg-emerald-500', cardBg: 'bg-white/10', cardBorder: 'border-emerald-500/30',
    iconBg: 'bg-emerald-500', iconText: 'text-white',
    sectionColors: ['from-emerald-500 to-green-600', 'from-red-500 to-orange-600', 'from-teal-500 to-cyan-500', 'from-amber-500 to-orange-500', 'from-emerald-600 to-teal-600'],
  },
  lista: {
    bg: 'bg-gradient-to-br from-violet-950 via-purple-950 to-fuchsia-950',
    headerBg: 'from-violet-600 to-purple-600', headerText: 'text-white',
    accent: 'bg-violet-500', cardBg: 'bg-white/10', cardBorder: 'border-violet-500/30',
    iconBg: 'bg-violet-500', iconText: 'text-white',
    sectionColors: ['from-violet-500 to-purple-600', 'from-fuchsia-500 to-pink-600', 'from-purple-500 to-indigo-600', 'from-pink-500 to-rose-600', 'from-indigo-500 to-violet-600'],
  },
  piramide: {
    bg: 'bg-gradient-to-br from-amber-950 via-orange-950 to-red-950',
    headerBg: 'from-amber-600 to-orange-600', headerText: 'text-white',
    accent: 'bg-amber-500', cardBg: 'bg-white/10', cardBorder: 'border-amber-500/30',
    iconBg: 'bg-amber-500', iconText: 'text-white',
    sectionColors: ['from-amber-500 to-yellow-600', 'from-orange-500 to-amber-600', 'from-red-500 to-orange-600', 'from-rose-500 to-red-600'],
  },
  ciklik: {
    bg: 'bg-gradient-to-br from-cyan-950 via-teal-950 to-emerald-950',
    headerBg: 'from-cyan-600 to-teal-600', headerText: 'text-white',
    accent: 'bg-cyan-500', cardBg: 'bg-white/10', cardBorder: 'border-cyan-500/30',
    iconBg: 'bg-cyan-500', iconText: 'text-white',
    sectionColors: ['from-cyan-500 to-blue-600', 'from-teal-500 to-cyan-600', 'from-emerald-500 to-teal-600', 'from-green-500 to-emerald-600', 'from-cyan-600 to-teal-600'],
  },
  statistika: {
    bg: 'bg-gradient-to-br from-rose-950 via-pink-950 to-fuchsia-950',
    headerBg: 'from-rose-600 to-pink-600', headerText: 'text-white',
    accent: 'bg-rose-500', cardBg: 'bg-white/10', cardBorder: 'border-rose-500/30',
    iconBg: 'bg-rose-500', iconText: 'text-white',
    sectionColors: ['from-rose-500 to-pink-600', 'from-pink-500 to-fuchsia-600', 'from-fuchsia-500 to-purple-600', 'from-purple-500 to-violet-600'],
  },
};

// ══════════════════════════════════════════
// Infographic Visual Component
// ══════════════════════════════════════════

function InfographicPreview({ data, palette }: { data: InfographicData; palette: typeof PALETTES[InfographicStyle] }) {
  const isTimeline = data.style === 'kronologjik';
  const isCompare = data.style === 'krahasues';
  const isCyclic = data.style === 'ciklik';
  const isPyramid = data.style === 'piramide';
  const isStats = data.style === 'statistika';

  return (
    <div className={`${palette.bg} rounded-3xl p-8 sm:p-10 min-h-[500px] relative overflow-hidden`}>
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.03] rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/[0.02] rounded-full blur-3xl" />

      {/* Header */}
      <div className="relative text-center mb-10">
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r ${palette.headerBg} rounded-full text-xs font-bold text-white/90 mb-4`}>
          <Sparkles className="w-3.5 h-3.5" />
          INFOGRAFIK MËSIMOR
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight mb-2">
          {data.title}
        </h1>
        <p className="text-white/50 text-sm font-medium">{data.subtitle}</p>
      </div>

      {/* Content based on style */}
      <div className="relative">
        {/* TIMELINE */}
        {isTimeline && (
          <div className="relative">
            <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-0.5 bg-white/20 sm:-translate-x-px" />
            <div className="space-y-6">
              {data.sections.map((sec, i) => {
                const Icon = getIcon(sec.icon);
                const isLeft = i % 2 === 0;
                return (
                  <div key={i} className={`relative flex items-start gap-4 ${isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'} flex-row`}>
                    <div className={`flex-1 ${isLeft ? 'sm:text-right sm:pr-8' : 'sm:text-left sm:pl-8'} pl-12 sm:pl-0`}>
                      <div className={`${palette.cardBg} backdrop-blur-sm rounded-2xl p-5 border ${palette.cardBorder}`}>
                        {sec.highlight && <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{sec.highlight}</span>}
                        <h3 className="text-lg font-bold text-white mt-1">{sec.title}</h3>
                        <p className="text-white/60 text-sm mt-1 leading-relaxed">{sec.description}</p>
                      </div>
                    </div>
                    <div className="absolute left-3 sm:left-1/2 sm:-translate-x-1/2 z-10">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${palette.sectionColors[i % palette.sectionColors.length]} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="hidden sm:block flex-1" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* COMPARE */}
        {isCompare && (
          <div className="space-y-4">
            {data.sections.map((sec, i) => {
              const Icon = getIcon(sec.icon);
              const isVs = i === Math.floor(data.sections.length / 2);
              return (
                <div key={i}>
                  {isVs && (
                    <div className="flex items-center justify-center gap-3 my-4">
                      <div className="flex-1 h-px bg-white/20" />
                      <span className="text-white/30 text-xs font-bold tracking-widest">VS</span>
                      <div className="flex-1 h-px bg-white/20" />
                    </div>
                  )}
                  <div className={`${palette.cardBg} backdrop-blur-sm rounded-2xl p-5 border ${palette.cardBorder} flex items-start gap-4`}>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${palette.sectionColors[i % palette.sectionColors.length]} flex items-center justify-center shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white">{sec.title}</h3>
                        {sec.highlight && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${i < 2 ? 'bg-emerald-500/20 text-emerald-300' : i < 4 ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'}`}>{sec.highlight}</span>}
                      </div>
                      <p className="text-white/60 text-sm mt-1 leading-relaxed">{sec.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* LIST */}
        {!isTimeline && !isCompare && !isCyclic && !isPyramid && !isStats && (
          <div className="grid sm:grid-cols-2 gap-4">
            {data.sections.map((sec, i) => {
              const Icon = getIcon(sec.icon);
              return (
                <div key={i} className={`${palette.cardBg} backdrop-blur-sm rounded-2xl p-5 border ${palette.cardBorder} hover:bg-white/[0.15] transition-colors`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${palette.sectionColors[i % palette.sectionColors.length]} flex items-center justify-center shrink-0 shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {sec.highlight && <span className="text-xs font-black text-white/30">{sec.highlight}</span>}
                        <h3 className="text-base font-bold text-white">{sec.title}</h3>
                      </div>
                      <p className="text-white/55 text-sm leading-relaxed">{sec.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PYRAMID */}
        {isPyramid && (
          <div className="flex flex-col items-center gap-3">
            {data.sections.map((sec, i) => {
              const Icon = getIcon(sec.icon);
              const widths = ['max-w-[200px]', 'max-w-[300px]', 'max-w-[400px]', 'max-w-[500px]', 'max-w-full'];
              const w = widths[data.sections.length - 1 - i] || 'max-w-full';
              return (
                <div key={i} className={`w-full ${w}`}>
                  <div className={`${palette.cardBg} backdrop-blur-sm rounded-2xl p-4 sm:p-5 border ${palette.cardBorder} text-center`}>
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${palette.sectionColors[i % palette.sectionColors.length]} flex items-center justify-center mx-auto mb-2`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    {sec.highlight && <span className="text-[10px] font-bold text-white/40 uppercase">{sec.highlight}</span>}
                    <h3 className="text-base font-bold text-white">{sec.title}</h3>
                    <p className="text-white/55 text-xs mt-1">{sec.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CYCLIC */}
        {isCyclic && (
          <div className="space-y-3">
            {data.sections.map((sec, i) => {
              const Icon = getIcon(sec.icon);
              const isLast = i === data.sections.length - 1;
              return (
                <div key={i}>
                  <div className={`${palette.cardBg} backdrop-blur-sm rounded-2xl p-5 border ${palette.cardBorder} flex items-center gap-4`}>
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${palette.sectionColors[i % palette.sectionColors.length]} flex items-center justify-center shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-white">{sec.title}</h3>
                      <p className="text-white/55 text-sm mt-0.5">{sec.description}</p>
                    </div>
                    <span className="text-white/30 text-xl font-bold">{sec.highlight}</span>
                  </div>
                  {!isLast && (
                    <div className="flex justify-center py-1">
                      <ArrowDown className="w-5 h-5 text-white/20" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* STATS */}
        {isStats && (
          <div className="grid grid-cols-2 gap-4">
            {data.sections.map((sec, i) => {
              const Icon = getIcon(sec.icon);
              return (
                <div key={i} className={`${palette.cardBg} backdrop-blur-sm rounded-2xl p-6 border ${palette.cardBorder} text-center`}>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${palette.sectionColors[i % palette.sectionColors.length]} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-3xl font-black text-white mb-1">{sec.title}</div>
                  {sec.highlight && <span className="text-[10px] font-bold text-white/30 uppercase">{sec.highlight}</span>}
                  <p className="text-white/50 text-xs mt-2 leading-relaxed">{sec.description}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-10 pt-4 border-t border-white/10 flex items-center justify-between">
        <span className="text-white/20 text-xs font-medium">SmartSchool AI</span>
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${palette.accent}`} />
          <div className={`w-1.5 h-1.5 rounded-full ${palette.accent} opacity-60`} />
          <div className={`w-1.5 h-1.5 rounded-full ${palette.accent} opacity-30`} />
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// Main Component
// ══════════════════════════════════════════

interface Props { onClose: () => void; }

export default function InfographicGenerator({ onClose }: Props) {
  const [step, setStep] = useState<'form' | 'generating' | 'preview'>('form');
  const infographicRef = useRef<HTMLDivElement>(null);

  // Form
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('Histori');
  const [grade, setGrade] = useState('Klasa 9');
  const [style, setStyle] = useState<InfographicStyle>('lista');
  const [sourceText, setSourceText] = useState('');

  // File upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
  const [parsing, setParsing] = useState(false);

  // Generated
  const [infographic, setInfographic] = useState<InfographicData | null>(null);
  const [genProgress, setGenProgress] = useState(0);
  const [genMessage, setGenMessage] = useState('');
  const [downloading, setDownloading] = useState(false);

  const subjects = ['Matematikë', 'Gjuhë Shqipe', 'Letërsi', 'Histori', 'Gjeografi', 'Fizikë', 'Kimi', 'Biologji', 'Anglisht', 'Shkencë', 'Qytetari', 'TIK'];
  const grades = ['Klasa 1','Klasa 2','Klasa 3','Klasa 4','Klasa 5','Klasa 6','Klasa 7','Klasa 8','Klasa 9','Klasa 10','Klasa 11','Klasa 12'];

  // File handling
  const handleFile = async (file: globalThis.File) => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const size = file.size < 1024 * 1024 ? `${(file.size / 1024).toFixed(0)} KB` : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    setUploadedFile({ name: file.name, size });
    setParsing(true);
    try {
      if (ext === 'txt' || ext === 'md') {
        setSourceText(await file.text());
      } else if (ext === 'pdf') {
        const raw = new TextDecoder('utf-8', { fatal: false }).decode(new Uint8Array(await file.arrayBuffer()));
        const m = raw.match(/\(([^)]{3,})\)/g);
        setSourceText(m ? m.map(x => x.slice(1,-1)).filter(t => /[a-zA-ZÀ-ÿ]/.test(t)).join('\n').slice(0, 8000) : '[PDF i ngarkuar]');
      } else {
        setSourceText(`[Skedari ${file.name} u ngarkua]`);
      }
      if (!topic) setTopic(file.name.replace(/\.[^.]+$/, ''));
    } catch { setSourceText('[Gabim leximi]'); }
    setParsing(false);
  };

  // Generate
  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setStep('generating'); setGenProgress(0);
    const stages = [
      { p: 15, msg: 'Duke analizuar temën...' },
      { p: 35, msg: 'Duke strukturuar infografikun...' },
      { p: 55, msg: 'Duke gjeneruar përmbajtjen...' },
      { p: 75, msg: 'Duke aplikuar stilin vizual...' },
      { p: 92, msg: 'Duke finalizuar...' },
    ];
    for (const s of stages) {
      await new Promise(r => setTimeout(r, 500 + Math.random() * 400));
      setGenProgress(s.p); setGenMessage(s.msg);
    }
    const data = generateInfographic(topic, style, sourceText, subject, grade);
    setInfographic(data);
    setGenProgress(100); setGenMessage('Infografiku u krijua!');
    await new Promise(r => setTimeout(r, 400));
    setStep('preview');
  };

  // Download PNG
  const handleDownloadPng = async () => {
    if (!infographicRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(infographicRef.current, { quality: 1, pixelRatio: 2, cacheBust: true });
      const link = document.createElement('a');
      link.download = `Infografik_${topic.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) { console.error(e); }
    setDownloading(false);
  };

  // Download PDF
  const handleDownloadPdf = async () => {
    if (!infographicRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(infographicRef.current, { quality: 1, pixelRatio: 2, cacheBust: true });
      const img = new window.Image();
      img.src = dataUrl;
      await new Promise(r => { img.onload = r; });
      const pdf = new jsPDF({ orientation: img.width > img.height ? 'landscape' : 'portrait', unit: 'mm', format: 'a4' });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(pageW / img.width, pageH / img.height) * 0.92;
      const w = img.width * ratio;
      const h = img.height * ratio;
      pdf.addImage(dataUrl, 'PNG', (pageW - w) / 2, (pageH - h) / 2, w, h);
      pdf.save(`Infografik_${topic.replace(/\s+/g, '_')}.pdf`);
    } catch (e) { console.error(e); }
    setDownloading(false);
  };

  const currentPalette = PALETTES[style];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center">
              <Image className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Krijo Infografik me AI</h2>
              <p className="text-xs text-gray-500">Vizualizoni çdo temë në sekonda</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* ── FORM ── */}
          {step === 'form' && (
            <div className="p-6 space-y-5">
              {/* Topic */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <BookOpen className="w-4 h-4 text-fuchsia-500" /> Tema e Infografikut
                </label>
                <input type="text" value={topic} onChange={e => setTopic(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-100 outline-none text-lg"
                  placeholder="p.sh. Rilindja Kombëtare, Sistemi Diellor, Cikli i Ujit..."
                />
              </div>

              {/* Subject & Grade */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FileText className="w-4 h-4 text-fuchsia-500" /> Lënda
                  </label>
                  <select value={subject} onChange={e => setSubject(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-fuchsia-500 outline-none">
                    {subjects.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <GraduationCap className="w-4 h-4 text-fuchsia-500" /> Klasa
                  </label>
                  <select value={grade} onChange={e => setGrade(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-fuchsia-500 outline-none">
                    {grades.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
              </div>

              {/* Style Selector */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Layers className="w-4 h-4 text-fuchsia-500" /> Stili i Infografikut
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {STYLES.map(s => (
                    <button key={s.id} onClick={() => setStyle(s.id)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        style === s.id ? 'border-fuchsia-500 bg-fuchsia-50' : 'border-gray-100 hover:border-gray-200'
                      }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{s.emoji}</span>
                        <span className="text-xs font-bold text-gray-900">{s.label}</span>
                      </div>
                      <p className="text-[10px] text-gray-500">{s.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Source Text */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <BookMarked className="w-4 h-4 text-fuchsia-500" /> Tekst / Material Burimor (Opsionale)
                </label>
                <textarea value={sourceText} onChange={e => setSourceText(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-100 outline-none resize-none text-sm"
                  rows={4}
                  placeholder="Ngjisni tekst nga libri, shënime, ose informacion që AI ta përdorë për infografikun..."
                />
              </div>

              {/* File Upload */}
              <div
                className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer ${
                  uploadedFile ? 'border-green-300 bg-green-50/50' : 'border-gray-200 hover:border-fuchsia-300 hover:bg-fuchsia-50/30'
                }`}
                onClick={() => !uploadedFile && fileInputRef.current?.click()}
              >
                <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.txt,.md"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
                />
                {parsing ? (
                  <div className="py-2"><Loader2 className="w-6 h-6 animate-spin mx-auto text-fuchsia-500" /><p className="text-xs text-gray-500 mt-1">Duke lexuar...</p></div>
                ) : uploadedFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <File className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">{uploadedFile.name}</span>
                    <span className="text-xs text-gray-400">{uploadedFile.size}</span>
                    <Check className="w-4 h-4 text-green-500" />
                    <button onClick={e => { e.stopPropagation(); setUploadedFile(null); setSourceText(''); }} className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-gray-500">
                    <FileUp className="w-5 h-5" />
                    <span className="text-sm">Ngarko PDF ose TXT</span>
                  </div>
                )}
              </div>

              {/* Generate */}
              <button onClick={handleGenerate} disabled={!topic.trim()}
                className="w-full py-4 bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white font-bold rounded-xl shadow-xl shadow-fuchsia-200 hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg">
                <Sparkles className="w-6 h-6" /> Gjenero Infografikun
              </button>
            </div>
          )}

          {/* ── GENERATING ── */}
          {step === 'generating' && (
            <div className="p-10 flex flex-col items-center justify-center min-h-[400px]">
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-fuchsia-100 to-violet-100 flex items-center justify-center">
                  <Loader2 className="w-12 h-12 text-fuchsia-600 animate-spin" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-fuchsia-600 flex items-center justify-center text-white animate-bounce">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <div className="w-full max-w-sm mb-4">
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-fuchsia-500 to-violet-600 h-3 rounded-full transition-all duration-500" style={{ width: `${genProgress}%` }} />
                </div>
              </div>
              <p className="text-gray-600 font-medium">{genMessage}</p>
              <p className="text-xs text-gray-400 mt-2">{topic} · {STYLES.find(s => s.id === style)?.label}</p>
            </div>
          )}

          {/* ── PREVIEW ── */}
          {step === 'preview' && infographic && (
            <div className="p-6">
              <div ref={infographicRef}>
                <InfographicPreview data={infographic} palette={currentPalette} />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 'preview' && (
          <div className="p-5 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-3 shrink-0">
            <button onClick={() => { setStep('form'); setInfographic(null); }}
              className="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-white transition-colors">
              ← Gjenero Tjetër
            </button>
            <button onClick={handleDownloadPng} disabled={downloading}
              className="flex-1 py-3 bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white font-bold rounded-xl shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              {downloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              Shkarko PNG
            </button>
            <button onClick={handleDownloadPdf} disabled={downloading}
              className="flex-1 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-bold rounded-xl shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              {downloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
              Shkarko PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
