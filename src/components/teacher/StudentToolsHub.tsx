import { useState } from 'react';
import {
  BookOpen, ClipboardList, BookMarked, Calendar,
  Sparkles, Heart, Share2, Copy, Check,
  MessageCircle, X, Users
} from 'lucide-react';
import HomeworkBuddy from './student-tools/HomeworkBuddy';
import SelfQuiz from './student-tools/SelfQuiz';
import TermExplainer from './student-tools/TermExplainer';
import StudyPlanner from './student-tools/StudyPlanner';

type ToolId = 'homework' | 'quiz' | 'terms' | 'planner';

const TOOLS: {
  id: ToolId;
  title: string;
  description: string;
  icon: typeof BookOpen;
  gradient: string;
  shadow: string;
  emoji: string;
}[] = [
  {
    id: 'homework',
    title: 'Asistenti i Detyrave',
    description: 'Nuk jep përgjigje — ndihmon me hapa, këshilla dhe shembuj për të nxitur mendimin kritik',
    icon: BookOpen,
    gradient: 'from-sky-400 to-blue-500',
    shadow: 'shadow-sky-200',
    emoji: '🎒',
  },
  {
    id: 'quiz',
    title: 'Kuiz Vetëvlerësimi',
    description: 'Gjeneron pyetje me zgjedhje për t\'u testuar para provimit — me shpjegime në fund',
    icon: ClipboardList,
    gradient: 'from-purple-400 to-violet-500',
    shadow: 'shadow-purple-200',
    emoji: '🧠',
  },
  {
    id: 'terms',
    title: 'Shpjeguesi i Termave',
    description: 'Përkthim, përkufizim i thjeshtë dhe shembull nga jeta reale për çdo term të vështirë',
    icon: BookMarked,
    gradient: 'from-amber-400 to-orange-500',
    shadow: 'shadow-amber-200',
    emoji: '📖',
  },
  {
    id: 'planner',
    title: 'Planifikuesi i Studimit',
    description: 'Krijon plan studimi me Time Blocking — bllokime kohe për menaxhim efektiv',
    icon: Calendar,
    gradient: 'from-green-400 to-emerald-500',
    shadow: 'shadow-green-200',
    emoji: '⏰',
  },
];

export default function StudentToolsHub() {
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  const [shareModal, setShareModal] = useState<ToolId | null>(null);
  const [copied, setCopied] = useState(false);

  const closeTool = () => setActiveTool(null);

  const getShareLink = (toolId: ToolId) => {
    const tool = TOOLS.find(t => t.id === toolId);
    return `SmartSchool — ${tool?.title}: Hap këtë mjet AI për nxënësit`;
  };

  const handleCopyLink = (toolId: ToolId) => {
    navigator.clipboard.writeText(getShareLink(toolId));
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = (toolId: ToolId) => {
    const text = encodeURIComponent(getShareLink(toolId));
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleShareClassroom = (toolId: ToolId) => {
    const text = encodeURIComponent(getShareLink(toolId));
    window.open(`https://classroom.google.com/share?url=${text}`, '_blank');
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center shadow-lg shadow-sky-200">
            <Heart className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Mjete AI për Nxënësit</h2>
            <p className="text-gray-500">Asistentë inteligjentë që nxisin të menduarit — jo kopjimin</p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl p-5 border border-sky-100">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div className="text-sm text-sky-800">
              <strong>Si funksionojnë:</strong> Këto mjete janë projektuar që nxënësit të mësojnë duke menduar — AI nuk jep përgjigje gati por udhëzon me hapa, pyetje orientuese dhe shembuj. Mund t'i ndani direkt me klasën!
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid sm:grid-cols-2 gap-5">
          {TOOLS.map((tool) => (
            <div key={tool.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
              {/* Card Header */}
              <div className={`bg-gradient-to-r ${tool.gradient} p-5 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{tool.emoji}</span>
                    <h3 className="text-lg font-bold">{tool.title}</h3>
                  </div>
                  <tool.icon className="w-6 h-6 text-white/50" />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5">
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{tool.description}</p>

                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTool(tool.id)}
                    className={`flex-1 py-2.5 bg-gradient-to-r ${tool.gradient} text-white font-semibold rounded-xl flex items-center justify-center gap-2 text-sm hover:-translate-y-0.5 transition-all shadow-lg ${tool.shadow}`}
                  >
                    <Sparkles className="w-4 h-4" /> Hap Mjetin
                  </button>
                  <button
                    onClick={() => setShareModal(tool.id)}
                    className="px-3 py-2.5 border-2 border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors"
                    title="Nda me klasën"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom hint */}
        <div className="bg-gradient-to-r from-violet-50 to-pink-50 rounded-2xl p-5 border border-violet-100">
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-violet-500 mt-0.5 shrink-0" />
            <div className="text-sm text-violet-700">
              <strong>Nda me klasën:</strong> Klikoni ikonën <Share2 className="w-3.5 h-3.5 inline" /> te çdo mjet për ta ndarë me nxënësit përmes WhatsApp, Google Classroom, ose duke kopjuar linkun.
            </div>
          </div>
        </div>
      </div>

      {/* Tool Modals */}
      {activeTool === 'homework' && <HomeworkBuddy onClose={closeTool} />}
      {activeTool === 'quiz' && <SelfQuiz onClose={closeTool} />}
      {activeTool === 'terms' && <TermExplainer onClose={closeTool} />}
      {activeTool === 'planner' && <StudyPlanner onClose={closeTool} />}

      {/* Share Modal */}
      {shareModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900">Nda me Klasën</h3>
              <button onClick={() => { setShareModal(null); setCopied(false); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-5">
              Zgjidhni si ta ndani mjetin "{TOOLS.find(t => t.id === shareModal)?.title}" me nxënësit:
            </p>

            <div className="space-y-3">
              {/* Copy Link */}
              <button onClick={() => handleCopyLink(shareModal)}
                className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-left">
                {copied ? <Check className="w-5 h-5 text-green-500 shrink-0" /> : <Copy className="w-5 h-5 text-gray-500 shrink-0" />}
                <div>
                  <div className="text-sm font-semibold text-gray-900">{copied ? 'Kopjuar!' : 'Kopjo Linkun'}</div>
                  <div className="text-xs text-gray-500">Ngjise në çdo platformë</div>
                </div>
              </button>

              {/* WhatsApp */}
              <button onClick={() => handleShareWhatsApp(shareModal)}
                className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors text-left">
                <div className="w-5 h-5 flex items-center justify-center text-green-600 shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Dërgo në WhatsApp</div>
                  <div className="text-xs text-gray-500">Grupi i klasës ose individual</div>
                </div>
              </button>

              {/* Google Classroom */}
              <button onClick={() => handleShareClassroom(shareModal)}
                className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-colors text-left">
                <div className="w-5 h-5 flex items-center justify-center text-amber-600 shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Google Classroom</div>
                  <div className="text-xs text-gray-500">Posto si detyrë ose material</div>
                </div>
              </button>

              {/* Direct in class */}
              <button onClick={() => { setShareModal(null); setActiveTool(shareModal); }}
                className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors text-left">
                <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-blue-900">Përdor Tani në Klasë</div>
                  <div className="text-xs text-blue-600">Hap mjetin dhe shfaqe në ekran</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
