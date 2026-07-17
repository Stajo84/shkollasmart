import { useState } from 'react';
import { X, BookOpen, GraduationCap, Check, Copy, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface CreateClassroomModalProps {
  onClose: () => void;
}

const subjects = [
  { value: 'Matematikë', emoji: '📐' },
  { value: 'Gjuhë Shqipe', emoji: '📚' },
  { value: 'Letërsi', emoji: '📖' },
  { value: 'Anglisht', emoji: '🇬🇧' },
  { value: 'Frëngjisht', emoji: '🇫🇷' },
  { value: 'Histori', emoji: '🏛️' },
  { value: 'Gjeografi', emoji: '🌍' },
  { value: 'Qytetari', emoji: '⚖️' },
  { value: 'Fizikë', emoji: '⚛️' },
  { value: 'Kimi', emoji: '🧪' },
  { value: 'Biologji', emoji: '🧬' },
  { value: 'Shkencë', emoji: '🔬' },
  { value: 'Dituri Natyre', emoji: '🌿' },
  { value: 'TIK', emoji: '💻' },
  { value: 'Art Pamor', emoji: '🎨' },
  { value: 'Muzikë', emoji: '🎵' },
  { value: 'Teatër', emoji: '🎭' },
  { value: 'Edukim Fizik', emoji: '⚽' },
  { value: 'Tjetër', emoji: '📝' },
];

const grades = [
  'Klasa 1', 'Klasa 2', 'Klasa 3', 'Klasa 4', 'Klasa 5',
  'Klasa 6', 'Klasa 7', 'Klasa 8', 'Klasa 9',
  'Klasa 10', 'Klasa 11', 'Klasa 12'
];

export default function CreateClassroomModal({ onClose }: CreateClassroomModalProps) {
  const { createClassroom } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [createdClassroom, setCreatedClassroom] = useState<{ name: string; joinCode: string } | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    grade: ''
  });

  const handleCreate = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const classroom = createClassroom(formData.name, formData.subject, formData.grade);
    setCreatedClassroom({ name: classroom.name, joinCode: classroom.joinCode });
    setStep(2);
    setLoading(false);
  };

  const copyCode = async () => {
    if (createdClassroom) {
      await navigator.clipboard.writeText(createdClassroom.joinCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const isValid = formData.name && formData.subject && formData.grade;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        {step === 1 ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Krijo Klasë të Re</h2>
                <p className="text-sm text-gray-500 mt-1">Plotësoni të dhënat për klasën tuaj</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-5">
              {/* Class name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emri i Klasës
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    placeholder="p.sh. Matematikë 7A"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lënda
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-64 overflow-y-auto pr-1">
                  {subjects.map((subject) => (
                    <button
                      key={subject.value}
                      onClick={() => setFormData({ ...formData, subject: subject.value })}
                      className={`p-2.5 rounded-xl border-2 transition-all text-center ${
                        formData.subject === subject.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                      title={subject.value}
                    >
                      <div className="text-lg mb-0.5">{subject.emoji}</div>
                      <div className="text-[10px] text-gray-600 truncate leading-tight">{subject.value}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Grade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Klasa
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none bg-white"
                  >
                    <option value="">Zgjidhni klasën</option>
                    {grades.map((grade) => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Anulo
              </button>
              <button
                onClick={handleCreate}
                disabled={!isValid || loading}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Krijo Klasën
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Success view */}
            <div className="p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200">
                <Check className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Klasa u Krijua! 🎉
              </h2>
              <p className="text-gray-500 mb-8">
                Ndajeni kodin me nxënësit tuaj për t'u bashkuar
              </p>

              {/* Join code display */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6 border border-blue-100">
                <div className="text-sm text-gray-500 mb-2">Kodi i Bashkimit</div>
                <div className="flex items-center justify-center gap-3">
                  <div className="text-4xl font-mono font-bold tracking-[0.3em] text-gray-900">
                    {createdClassroom?.joinCode}
                  </div>
                  <button
                    onClick={copyCode}
                    className={`p-3 rounded-xl transition-all ${
                      copiedCode
                        ? 'bg-green-100 text-green-600'
                        : 'bg-white text-gray-600 hover:bg-blue-100 hover:text-blue-600 shadow-sm'
                    }`}
                  >
                    {copiedCode ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-4 text-left mb-6 border border-amber-100">
                <div className="flex gap-3">
                  <div className="text-xl">💡</div>
                  <div className="text-sm text-amber-800">
                    <strong>Si ta përdorni:</strong> Nxënësit shkojnë te SmartSchool, klikojnë "Bashkohu në Klasë" dhe shkruajnë këtë kod.
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 transition-all"
              >
                Shko te Dashboard
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
