import { useState } from 'react';
import { GraduationCap, ArrowLeft, User, Hash, CheckCircle, PartyPopper, BookOpen, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface StudentJoinProps {
  onBack: () => void;
}

export default function StudentJoin({ onBack }: StudentJoinProps) {
  const { joinClassroom, classrooms } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [joinedClass, setJoinedClass] = useState<{ name: string; subject: string; studentCount: number } | null>(null);
  const [showAvailableCodes, setShowAvailableCodes] = useState(false);
  
  const [formData, setFormData] = useState({
    code: '',
    name: ''
  });

  const handleJoin = async () => {
    setError('');
    if (formData.code.length !== 6) { setError('Kodi duhet të ketë saktësisht 6 karaktere.'); return; }
    if (!formData.name.trim()) { setError('Shkruaj emrin tënd.'); return; }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const result = joinClassroom(formData.code, formData.name.trim());
    
    if (result.success && result.classroom) {
      setJoinedClass({ 
        name: result.classroom.name, 
        subject: result.classroom.subject,
        studentCount: result.classroom.students.length 
      });
      setStep(2);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleCodeChange = (value: string) => {
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    setFormData({ ...formData, code: cleaned });
    setError(''); // Clear error when typing
  };

  // Check if current code matches any classroom (live feedback)
  const codeMatch = formData.code.length === 6 
    ? classrooms.find(c => c.joinCode.toUpperCase() === formData.code.toUpperCase()) 
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="absolute top-20 left-20 w-64 h-64 bg-violet-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kthehu
        </button>

        {step === 1 ? (
          <div className="bg-white rounded-3xl shadow-2xl shadow-violet-100/50 p-8 border border-gray-100">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 shadow-lg shadow-violet-200 mb-4">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Bashkohu në Klasë</h1>
              <p className="text-gray-500 mt-2">Shkruaj kodin 6-shifror që të dha mësuesi</p>
            </div>

            {error && (
              <div className="mb-5 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">{error}</div>
            )}

            <div className="space-y-5">
              {/* Join code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kodi i Klasës</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 focus:ring-2 outline-none transition-all text-center text-2xl font-mono font-bold tracking-[0.3em] uppercase ${
                      codeMatch 
                        ? 'border-green-400 bg-green-50 focus:ring-green-100 text-green-700' 
                        : formData.code.length === 6 && !codeMatch
                        ? 'border-red-300 bg-red-50 focus:ring-red-100 text-red-600'
                        : 'border-gray-200 focus:border-violet-500 focus:ring-violet-100'
                    }`}
                    placeholder="ABC123"
                    maxLength={6}
                    autoFocus
                  />
                </div>
                
                {/* Live code feedback */}
                {codeMatch && (
                  <div className="mt-2 flex items-center gap-2 p-2.5 bg-green-50 border border-green-200 rounded-xl">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    <div className="text-sm">
                      <span className="font-bold text-green-700">{codeMatch.name}</span>
                      <span className="text-green-600"> · {codeMatch.subject} · {codeMatch.students.length} nxënës</span>
                    </div>
                  </div>
                )}
                {formData.code.length === 6 && !codeMatch && (
                  <p className="mt-2 text-sm text-red-500">❌ Ky kod nuk u gjet. Kontrollo dhe provo përsëri.</p>
                )}
                {formData.code.length > 0 && formData.code.length < 6 && (
                  <p className="mt-2 text-xs text-gray-400 text-center">{formData.code.length}/6 karaktere</p>
                )}
              </div>

              {/* Student name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emri & Mbiemri</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all"
                    placeholder="p.sh. Arta Gashi"
                  />
                </div>
              </div>

              <button
                onClick={handleJoin}
                disabled={formData.code.length !== 6 || !formData.name.trim() || loading || !codeMatch}
                className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-violet-200 hover:shadow-violet-300 hover:from-violet-700 hover:to-purple-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <><CheckCircle className="w-5 h-5" /> Bashkohu</>
                )}
              </button>
            </div>

            {/* Show available codes (demo help) */}
            <div className="mt-6">
              <button 
                onClick={() => setShowAvailableCodes(!showAvailableCodes)}
                className="w-full flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-violet-600 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                {showAvailableCodes ? 'Fshih kodet' : 'Nuk e di kodin? Shiko kodet e disponueshme'}
              </button>
              
              {showAvailableCodes && classrooms.length > 0 && (
                <div className="mt-3 bg-violet-50 rounded-xl p-4 border border-violet-100 space-y-2">
                  <p className="text-xs font-bold text-violet-700 mb-2">📋 Klasat e disponueshme:</p>
                  {classrooms.map(c => (
                    <button 
                      key={c.id} 
                      onClick={() => setFormData({ ...formData, code: c.joinCode })}
                      className="w-full flex items-center justify-between p-2.5 bg-white rounded-lg hover:bg-violet-100 transition-colors text-left"
                    >
                      <div>
                        <div className="text-sm font-bold text-gray-900">{c.name}</div>
                        <div className="text-xs text-gray-500">{c.subject} · {c.grade}</div>
                      </div>
                      <div className="font-mono font-bold text-violet-600 tracking-wider text-sm">{c.joinCode}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Help text */}
            <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
              <div className="flex gap-3">
                <div className="text-xl">💡</div>
                <div className="text-sm text-amber-800">
                  <strong>Nuk ke kodin?</strong> Pyete mësuesin tënd. Kodi ka 6 shkronja/numra (p.sh. <span className="font-mono font-bold">AB3K7P</span>).
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Success view */
          <div className="bg-white rounded-3xl shadow-2xl shadow-violet-100/50 p-8 border border-gray-100 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200 animate-bounce">
              <PartyPopper className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">U bashkove me sukses! 🎉</h2>
            <p className="text-gray-500 mb-6">Tani je pjesë e klasës</p>

            <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-6 mb-6 border border-violet-100">
              <div className="flex items-center justify-center gap-3 mb-2">
                <BookOpen className="w-6 h-6 text-violet-600" />
                <span className="text-xl font-bold text-gray-900">{joinedClass?.name}</span>
              </div>
              <p className="text-sm text-gray-500">{joinedClass?.subject} · {joinedClass?.studentCount} nxënës</p>
              <p className="text-sm text-violet-600 mt-2">Përshëndetje, {formData.name}! 👋</p>
            </div>

            <button
              onClick={onBack}
              className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-violet-200 transition-all"
            >
              Vazhdo në SmartSchool
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
