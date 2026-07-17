import { useState } from 'react';
import { Brain, Sparkles, FileText, HelpCircle, Layers, Play, Loader2, Share2, BookOpen } from 'lucide-react';

interface Material {
  id: string;
  name: string;
  type: string;
}

interface GeneratedContent {
  id: string;
  materialName: string;
  type: 'kuiz' | 'flashcard' | 'prezantim' | 'përmbledhje';
  itemsCount: number;
  createdAt: string;
  sharedWith: string[];
}

const materials: Material[] = [
  { id: '1', name: 'Plani Mësimor - Matematikë Klasa 7.pdf', type: 'pdf' },
  { id: '2', name: 'Prezantim - Historia e Shqipërisë.pptx', type: 'ppt' },
  { id: '3', name: 'Ushtrime Fizikë.docx', type: 'word' },
  { id: '4', name: 'Teksti i Biologjisë - Kapitulli 5.pdf', type: 'pdf' },
];

const generatedContents: GeneratedContent[] = [
  { id: '1', materialName: 'Plani Mësimor - Matematikë', type: 'kuiz', itemsCount: 15, createdAt: '20 Prill 2024', sharedWith: ['Klasa 7A', 'Klasa 7B'] },
  { id: '2', materialName: 'Historia e Shqipërisë', type: 'flashcard', itemsCount: 30, createdAt: '18 Prill 2024', sharedWith: ['Klasa 9A'] },
  { id: '3', materialName: 'Prezantim Histori', type: 'prezantim', itemsCount: 12, createdAt: '15 Prill 2024', sharedWith: [] },
];

const contentTypes = [
  { id: 'kuiz', label: 'Kuiz Interaktiv', icon: HelpCircle, color: 'from-violet-500 to-purple-600', description: 'Gjenero pyetje me përgjigje të shumëfishta' },
  { id: 'flashcard', label: 'Flashcards', icon: Layers, color: 'from-blue-500 to-indigo-600', description: 'Karta mësimore për memorizim' },
  { id: 'prezantim', label: 'Prezantim', icon: Play, color: 'from-emerald-500 to-teal-600', description: 'Slide-e interaktive nga materiali' },
  { id: 'përmbledhje', label: 'Përmbledhje', icon: FileText, color: 'from-orange-500 to-amber-600', description: 'Përmbledhje e shkurtër e përmbajtjes' },
];

export default function AIInteractive() {
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<GeneratedContent[]>(generatedContents);
  const [questionCount, setQuestionCount] = useState(10);

  const handleGenerate = () => {
    if (!selectedMaterial || !selectedType) return;
    
    setGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const material = materials.find(m => m.id === selectedMaterial);
      const newContent: GeneratedContent = {
        id: Date.now().toString(),
        materialName: material?.name.split('.')[0] || 'Material',
        type: selectedType as GeneratedContent['type'],
        itemsCount: questionCount,
        createdAt: new Date().toLocaleDateString('sq-AL', { day: 'numeric', month: 'long', year: 'numeric' }),
        sharedWith: [],
      };
      setGenerated(prev => [newContent, ...prev]);
      setGenerating(false);
      setSelectedMaterial(null);
      setSelectedType(null);
    }, 3000);
  };

  const typeIcons = {
    kuiz: { icon: HelpCircle, color: 'text-violet-600 bg-violet-100' },
    flashcard: { icon: Layers, color: 'text-blue-600 bg-blue-100' },
    prezantim: { icon: Play, color: 'text-emerald-600 bg-emerald-100' },
    përmbledhje: { icon: FileText, color: 'text-orange-600 bg-orange-100' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">AI Interaktiv</h2>
          <p className="text-sm text-gray-500">Ktheni materialet në përmbajtje interaktive me AI</p>
        </div>
      </div>

      {/* AI Generator Card */}
      <div className="bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Gjeneruesi AI</h3>
            <p className="text-white/70 text-sm">Zgjidhni materialin dhe llojin e përmbajtjes</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Material Selection */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Zgjidhni Materialin</label>
            <select
              value={selectedMaterial || ''}
              onChange={(e) => setSelectedMaterial(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <option value="" className="text-gray-900">Zgjidhni një material...</option>
              {materials.map((m) => (
                <option key={m.id} value={m.id} className="text-gray-900">{m.name}</option>
              ))}
            </select>
          </div>

          {/* Question Count */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Numri i Pyetjeve/Elementeve</label>
            <input
              type="number"
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value) || 10)}
              min={5}
              max={50}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>
        </div>

        {/* Content Type Selection */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-white/80 mb-3">Zgjidhni Llojin e Përmbajtjes</label>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {contentTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  selectedType === type.id
                    ? 'border-white bg-white/20'
                    : 'border-white/20 hover:border-white/40 hover:bg-white/10'
                }`}
              >
                <type.icon className="w-6 h-6 mb-2" />
                <div className="font-medium">{type.label}</div>
                <div className="text-xs text-white/60 mt-1">{type.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!selectedMaterial || !selectedType || generating}
          className="mt-6 w-full py-4 bg-white text-violet-700 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Duke gjeneruar me AI...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Gjenero Përmbajtje
            </>
          )}
        </button>
      </div>

      {/* Generated Content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Përmbajtjet e Gjeneruara ({generated.length})</h3>
          <BookOpen className="w-5 h-5 text-gray-400" />
        </div>
        <div className="divide-y divide-gray-50">
          {generated.map((content) => {
            const typeConfig = typeIcons[content.type];
            return (
              <div key={content.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className={`w-12 h-12 rounded-xl ${typeConfig.color} flex items-center justify-center`}>
                  <typeConfig.icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{content.materialName}</span>
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full capitalize">
                      {content.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span>{content.itemsCount} elemente</span>
                    <span>•</span>
                    <span>{content.createdAt}</span>
                    {content.sharedWith.length > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-600">Ndarë me {content.sharedWith.join(', ')}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-violet-50 rounded-lg transition-colors text-gray-400 hover:text-violet-600" title="Shiko">
                    <Play className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-gray-400 hover:text-blue-600" title="Ndaj">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
