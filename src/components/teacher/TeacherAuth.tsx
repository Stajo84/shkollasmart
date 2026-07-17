import { useState } from 'react';
import { GraduationCap, Lock, User, Building, ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface TeacherAuthProps {
  onBack: () => void;
  onSuccess: (isCoordinator: boolean) => void;
}

export default function TeacherAuth({ onBack, onSuccess }: TeacherAuthProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    school: ''
  });

  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (mode === 'login') {
      const result = login(formData.email, formData.password);
      if (result.success) {
        onSuccess(result.isCoordinator);
      } else {
        setError('ID/Email ose fjalëkalimi i gabuar. Provo përsëri.');
      }
    } else {
      if (!formData.name) {
        setError('Ju lutem shkruani emrin tuaj.');
        setLoading(false);
        return;
      }
      if (formData.password.length < 6) {
        setError('Fjalëkalimi duhet të ketë të paktën 6 karaktere.');
        setLoading(false);
        return;
      }
      const success = register(formData.name, formData.email, formData.password, formData.school);
      if (success) {
        onSuccess(false);
      } else {
        setError('Regjistrimi dështoi. Provo përsëri.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kthehu
        </button>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-blue-100/50 p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-200 mb-4">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {mode === 'login' ? 'Mirë se vini përsëri!' : 'Krijo Llogari Mësuesi'}
            </h1>
            <p className="text-gray-500 mt-2">
              {mode === 'login' 
                ? 'Hyni në llogarinë tuaj për të vazhduar' 
                : 'Regjistrohuni për të filluar të krijoni klasa'
              }
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Emri i plotë
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      placeholder="p.sh. Arta Krasniqi"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Shkolla (opsionale)
                  </label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.school}
                      onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      placeholder="p.sh. Shkolla 9-vjeçare Naim Frashëri"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                ID ose Email
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  placeholder="Shkolla2026 ose email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Fjalëkalimi
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {mode === 'login' && (
              <div className="flex justify-end">
                <button type="button" className="text-sm text-blue-600 hover:text-blue-700">
                  Keni harruar fjalëkalimin?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Hyr në Llogari' : 'Regjistrohu'}
                  <CheckCircle className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Toggle mode */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {mode === 'login' ? 'Nuk keni llogari?' : 'Keni tashmë llogari?'}
              <button
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setError('');
                }}
                className="ml-2 text-blue-600 font-semibold hover:text-blue-700"
              >
                {mode === 'login' ? 'Regjistrohuni' : 'Hyni'}
              </button>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-white/60 backdrop-blur rounded-xl">
            <div className="text-2xl mb-1">🎯</div>
            <div className="text-xs text-gray-600 font-medium">Krijo Klasa</div>
          </div>
          <div className="p-3 bg-white/60 backdrop-blur rounded-xl">
            <div className="text-2xl mb-1">📊</div>
            <div className="text-xs text-gray-600 font-medium">Ndiq Progresin</div>
          </div>
          <div className="p-3 bg-white/60 backdrop-blur rounded-xl">
            <div className="text-2xl mb-1">🤖</div>
            <div className="text-xs text-gray-600 font-medium">Kuize me IA</div>
          </div>
        </div>
      </div>
    </div>
  );
}
