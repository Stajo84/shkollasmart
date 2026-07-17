import { useState } from 'react';
import { ArrowLeft, Mail, Phone, Lock, Eye, EyeOff, Heart, CheckCircle } from 'lucide-react';

interface ParentAuthProps {
  onBack: () => void;
  onSuccess: (parent: { name: string; contact: string; method: string }) => void;
}

export default function ParentAuth({ onBack, onSuccess }: ParentAuthProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const contact = method === 'email' ? form.email : form.phone;
    if (!contact) { setError(method === 'email' ? 'Shkruani email-in.' : 'Shkruani numrin e telefonit.'); return; }
    if (!form.password || form.password.length < 4) { setError('Fjalëkalimi duhet të ketë të paktën 4 karaktere.'); return; }
    if (mode === 'register' && !form.name) { setError('Shkruani emrin tuaj.'); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 800));

    const name = mode === 'register' ? form.name : (method === 'email' ? form.email.split('@')[0] : 'Prind');
    onSuccess({ name: name.charAt(0).toUpperCase() + name.slice(1), contact, method });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-teal-200/30 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4" /> Kthehu
        </button>

        <div className="bg-white rounded-3xl shadow-2xl shadow-emerald-100/50 p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-200 mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {mode === 'login' ? 'Portali i Prindit' : 'Regjistrohu si Prind'}
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              {mode === 'login' ? 'Ndiqni progresin e fëmijës suaj' : 'Krijoni llogari për të ndjekur fëmijën'}
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm text-center">{error}</div>
          )}

          {/* Login Method Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1 gap-1 mb-6">
            <button onClick={() => setMethod('email')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${method === 'email' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500'}`}>
              <Mail className="w-4 h-4" /> Email
            </button>
            <button onClick={() => setMethod('phone')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${method === 'phone' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500'}`}>
              <Phone className="w-4 h-4" /> Telefon
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name (register only) */}
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Emri juaj</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
                  placeholder="p.sh. Elona Berisha" />
              </div>
            )}

            {/* Email or Phone */}
            {method === 'email' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
                    placeholder="email@shembull.com" required />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Numri i Telefonit</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
                    placeholder="+355 69 XXX XXXX" required />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Fjalëkalimi</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
                  placeholder="••••••" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <><CheckCircle className="w-5 h-5" /> {mode === 'login' ? 'Hyr' : 'Regjistrohu'}</>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              {mode === 'login' ? 'Nuk keni llogari?' : 'Keni tashmë llogari?'}
              <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
                className="ml-2 text-emerald-600 font-semibold hover:text-emerald-700">
                {mode === 'login' ? 'Regjistrohuni' : 'Hyni'}
              </button>
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          {[{ e: '📊', t: 'Ndiq Notat' }, { e: '📅', t: 'Detyrat' }, { e: '💬', t: 'Mesazhe' }].map((f, i) => (
            <div key={i} className="p-3 bg-white/60 backdrop-blur rounded-xl">
              <div className="text-2xl mb-1">{f.e}</div>
              <div className="text-xs text-gray-600 font-medium">{f.t}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
