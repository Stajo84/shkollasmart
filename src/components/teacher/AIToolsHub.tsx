import { useState } from 'react';
import {
  Presentation, ClipboardList, Image, BookOpen, Calendar,
  FileText, Sparkles, ArrowRight, Brain, MessageSquare,
  Heart, Table, Layers, PenTool
} from 'lucide-react';
import PresentationGenerator from './PresentationGenerator';
import TestGenerator from './TestGenerator';
import InfographicGenerator from './InfographicGenerator';
import LessonCreator from './LessonCreator';
import LessonPlanner from './LessonPlanner';
import AIImageGenerator from './AIImageGenerator';
import SMIPComments from './ai-tools/SMIPComments';
import PEIAssistant from './ai-tools/PEIAssistant';
import RubricCreator from './ai-tools/RubricCreator';
import FlashcardGenerator from './ai-tools/FlashcardGenerator';
import EssayCorrector from './ai-tools/EssayCorrector';

type ToolId = 'prezantim' | 'test' | 'infografik' | 'leksion' | 'plan' | 'imazh' | 'smip' | 'pei' | 'rubrike' | 'flashcard' | 'ese';

interface Props {
  onStartLive?: (slides: { title: string; bullets: string[]; teacher_notes: string }[]) => void;
}

const TOOLS: {
  id: ToolId;
  title: string;
  description: string;
  icon: typeof Presentation;
  gradient: string;
  shadow: string;
  badge?: string;
  category: 'krijim' | 'vleresim' | 'ndihmese';
}[] = [
  // ── Krijim ──
  { id: 'prezantim', title: 'Gjenero Prezantim (PPTX)', description: 'Sllajde profesionale — shkarko PowerPoint ose fillo Live', icon: Presentation, gradient: 'from-violet-500 to-indigo-600', shadow: 'shadow-violet-200', badge: 'Live ✨', category: 'krijim' },
  { id: 'test', title: 'Test Kontrolli Zyrtar (PDF)', description: '7 lloje pyetjesh, skemë vlerësimi, tabelë notash', icon: ClipboardList, gradient: 'from-gray-700 to-gray-900', shadow: 'shadow-gray-300', badge: 'PDF', category: 'krijim' },
  { id: 'infografik', title: 'Krijo Infografik', description: '6 stile vizuale — kronologjik, krahasues, piramidë', icon: Image, gradient: 'from-fuchsia-500 to-violet-600', shadow: 'shadow-fuchsia-200', badge: 'PNG', category: 'krijim' },
  { id: 'leksion', title: 'Krijo Leksion me AI', description: 'Hyrje, pika kryesore, fjalorth, përmbledhje', icon: BookOpen, gradient: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-200', category: 'krijim' },
  { id: 'plan', title: 'Planifikuesi i Orës', description: 'Plan ditar ERR me objektivat dhe rubrikën', icon: Calendar, gradient: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-200', category: 'krijim' },
  { id: 'imazh', title: 'Gjenero Imazh Edukativ', description: 'Përshkruani dhe AI vizaton — për fletë pune', icon: FileText, gradient: 'from-pink-500 to-orange-500', shadow: 'shadow-pink-200', category: 'krijim' },
  // ── Vlerësim ──
  { id: 'rubrike', title: 'Rubrikë Vlerësimi', description: 'Tabelë me kritere dhe nivele pikësh — shkarko PDF', icon: Table, gradient: 'from-indigo-500 to-blue-600', shadow: 'shadow-indigo-200', badge: 'PDF', category: 'vleresim' },
  { id: 'smip', title: 'Komente për SMIP', description: 'Komente zyrtare për regjistrin digjital SMIP', icon: MessageSquare, gradient: 'from-teal-500 to-cyan-600', shadow: 'shadow-teal-200', category: 'vleresim' },
  { id: 'ese', title: 'Korrigjuesi i Eseve', description: 'Analizë gramatikore, strukturore dhe notë e sugjeruar', icon: PenTool, gradient: 'from-red-500 to-rose-600', shadow: 'shadow-red-200', category: 'vleresim' },
  // ── Ndihmëse ──
  { id: 'pei', title: 'Asistenti PEI', description: 'Përshtatje materialesh për edukimin special', icon: Heart, gradient: 'from-rose-500 to-pink-600', shadow: 'shadow-rose-200', category: 'ndihmese' },
  { id: 'flashcard', title: 'Flashcards (Karta Memorie)', description: 'Karta dypalëshe me efekt flip — printo', icon: Layers, gradient: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-200', category: 'ndihmese' },
];

const CATEGORIES = [
  { id: 'all', label: 'Të Gjitha', emoji: '✨' },
  { id: 'krijim', label: 'Krijim Materialesh', emoji: '📝' },
  { id: 'vleresim', label: 'Vlerësim', emoji: '📊' },
  { id: 'ndihmese', label: 'Ndihmëse', emoji: '🤝' },
];

export default function AIToolsHub({ onStartLive }: Props) {
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('all');

  const closeTool = () => setActiveTool(null);

  const filteredTools = categoryFilter === 'all' ? TOOLS : TOOLS.filter(t => t.category === categoryFilter);

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-200">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Mjetet AI</h2>
              <p className="text-gray-500">{TOOLS.length} asistentë të gatshëm për ju</p>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setCategoryFilter(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                categoryFilter === cat.id
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className="group relative bg-white rounded-2xl border border-gray-100 p-5 text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300`} />

              {tool.badge && (
                <div className="absolute top-4 right-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r ${tool.gradient} text-white`}>{tool.badge}</span>
                </div>
              )}

              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg ${tool.shadow}`}>
                <tool.icon className="w-5 h-5 text-white" />
              </div>

              <h3 className="text-sm font-bold text-gray-900 mb-1.5 pr-10">{tool.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">{tool.description}</p>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 group-hover:gap-2.5 transition-all">
                <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                <span>Fillo</span>
                <ArrowRight className="w-3.5 h-3.5 text-violet-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>

        {/* Info */}
        <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-2xl p-5 border border-violet-100">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-violet-500 mt-0.5 shrink-0" />
            <div className="text-sm text-violet-700">
              <strong>Të gjitha mjetet funksionojnë me AI</strong> — vendosni temën dhe AI gjeneron gjithçka automatikisht në shqip. Materialet shkarkohen si PDF, PNG ose kopjohen direkt.
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeTool === 'prezantim' && <PresentationGenerator onClose={closeTool} onStartLive={onStartLive} />}
      {activeTool === 'test' && <TestGenerator onClose={closeTool} />}
      {activeTool === 'infografik' && <InfographicGenerator onClose={closeTool} />}
      {activeTool === 'leksion' && <LessonCreator onClose={closeTool} />}
      {activeTool === 'plan' && <LessonPlanner onClose={closeTool} />}
      {activeTool === 'imazh' && <AIImageGenerator onClose={closeTool} />}
      {activeTool === 'smip' && <SMIPComments onClose={closeTool} />}
      {activeTool === 'pei' && <PEIAssistant onClose={closeTool} />}
      {activeTool === 'rubrike' && <RubricCreator onClose={closeTool} />}
      {activeTool === 'flashcard' && <FlashcardGenerator onClose={closeTool} />}
      {activeTool === 'ese' && <EssayCorrector onClose={closeTool} />}
    </>
  );
}
