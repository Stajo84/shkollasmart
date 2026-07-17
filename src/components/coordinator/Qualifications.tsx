import { useState } from 'react';
import { Award, Search, TrendingUp, Clock, CheckCircle, AlertCircle, Edit2, X, Check } from 'lucide-react';

interface Qualification {
  id: string;
  teacherName: string;
  teacherAvatar: string;
  subject: string;
  currentLevel: string;
  targetLevel: string;
  progress: number;
  certifications: string[];
  lastUpdated: string;
  status: 'active' | 'expiring' | 'expired';
}

const qualifications: Qualification[] = [
  {
    id: '1',
    teacherName: 'Arta Krasniqi',
    teacherAvatar: '👩‍🏫',
    subject: 'Matematikë',
    currentLevel: 'Kategoria II',
    targetLevel: 'Kategoria I',
    progress: 75,
    certifications: ['ECDL', 'Metodat Interaktive', 'Mësimdhënia Digjitale'],
    lastUpdated: '15 Mars 2024',
    status: 'active'
  },
  {
    id: '2',
    teacherName: 'Besnik Hoxha',
    teacherAvatar: '👨‍🏫',
    subject: 'Fizikë',
    currentLevel: 'Kategoria III',
    targetLevel: 'Kategoria II',
    progress: 45,
    certifications: ['ECDL', 'Laborator Virtual'],
    lastUpdated: '20 Shkurt 2024',
    status: 'active'
  },
  {
    id: '3',
    teacherName: 'Drita Berisha',
    teacherAvatar: '👩‍🏫',
    subject: 'Gjuhë Shqipe',
    currentLevel: 'Kategoria I',
    targetLevel: 'Mjeshtër',
    progress: 90,
    certifications: ['ECDL', 'Metodat Interaktive', 'Lexim Kritik', 'Gjuhësi Moderne'],
    lastUpdated: '1 Prill 2024',
    status: 'active'
  },
  {
    id: '4',
    teacherName: 'Erion Murati',
    teacherAvatar: '👨‍🔬',
    subject: 'Kimi',
    currentLevel: 'Kategoria II',
    targetLevel: 'Kategoria I',
    progress: 60,
    certifications: ['ECDL', 'Siguria në Laborator'],
    lastUpdated: '10 Janar 2024',
    status: 'expiring'
  },
  {
    id: '5',
    teacherName: 'Flora Gashi',
    teacherAvatar: '👩‍🏫',
    subject: 'Histori',
    currentLevel: 'Kategoria III',
    targetLevel: 'Kategoria II',
    progress: 30,
    certifications: ['ECDL'],
    lastUpdated: '5 Dhjetor 2023',
    status: 'expired'
  },
];

export default function Qualifications() {
  const [items, setItems] = useState<Qualification[]>(qualifications);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expiring' | 'expired'>('all');
  const [editingItem, setEditingItem] = useState<Qualification | null>(null);

  const filteredQualifications = items.filter(q => {
    const matchesSearch = q.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.subject.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && q.status === filterStatus;
  });

  const handleUpdate = () => {
    if (editingItem) {
      setItems(prev => prev.map(q => q.id === editingItem.id ? editingItem : q));
      setEditingItem(null);
    }
  };

  const statusConfig = {
    active: { color: 'text-emerald-600 bg-emerald-50', icon: CheckCircle, label: 'Aktiv' },
    expiring: { color: 'text-amber-600 bg-amber-50', icon: Clock, label: 'Skadon së shpejti' },
    expired: { color: 'text-red-600 bg-red-50', icon: AlertCircle, label: 'Skaduar' },
  };

  const activeCount = qualifications.filter(q => q.status === 'active').length;
  const expiringCount = qualifications.filter(q => q.status === 'expiring').length;
  const avgProgress = Math.round(qualifications.reduce((sum, q) => sum + q.progress, 0) / qualifications.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Kualifikimet</h2>
          <p className="text-sm text-gray-500">Ndiqni nivelin dhe certifikatat e mësuesve</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Kërko mësues..."
              className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm w-64"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Award className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{activeCount}</div>
              <div className="text-sm text-gray-500">Aktive</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{expiringCount}</div>
              <div className="text-sm text-gray-500">Skadojnë së shpejti</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{avgProgress}%</div>
              <div className="text-sm text-gray-500">Progres Mesatar</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[
          { value: 'all' as const, label: 'Të Gjitha' },
          { value: 'active' as const, label: 'Aktive' },
          { value: 'expiring' as const, label: 'Skadojnë' },
          { value: 'expired' as const, label: 'Skaduar' },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilterStatus(f.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filterStatus === f.value
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Qualifications List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Mësues</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Lënda</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Niveli Aktual</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Progres</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Certifikata</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Statusi</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Veprime</th>
              </tr>
            </thead>
            <tbody>
              {filteredQualifications.map((q) => {
                const status = statusConfig[q.status];
                return (
                  <tr key={q.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center text-xl">
                          {q.teacherAvatar}
                        </div>
                        <span className="font-medium text-gray-900">{q.teacherName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{q.subject}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{q.currentLevel}</div>
                        <div className="text-xs text-gray-500">→ {q.targetLevel}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-32">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-600">{q.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              q.progress >= 80 ? 'bg-emerald-500' :
                              q.progress >= 50 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${q.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {q.certifications.slice(0, 2).map((cert, i) => (
                          <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">
                            {cert}
                          </span>
                        ))}
                        {q.certifications.length > 2 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{q.certifications.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        <status.icon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setEditingItem({ ...q })}
                        className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Qualification Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Përditëso Kualifikimin</h3>
              <button onClick={() => setEditingItem(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Niveli Aktual</label>
                <select
                  value={editingItem.currentLevel}
                  onChange={(e) => setEditingItem({ ...editingItem, currentLevel: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
                >
                  <option value="Kategoria III">Kategoria III</option>
                  <option value="Kategoria II">Kategoria II</option>
                  <option value="Kategoria I">Kategoria I</option>
                  <option value="Mjeshtër">Mjeshtër</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Progresi (%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editingItem.progress}
                  onChange={(e) => setEditingItem({ ...editingItem, progress: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="text-right text-sm text-gray-500 mt-1">{editingItem.progress}%</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statusi</label>
                <select
                  value={editingItem.status}
                  onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value as any })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
                >
                  <option value="active">Aktiv</option>
                  <option value="expiring">Skadon së shpejti</option>
                  <option value="expired">Skaduar</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setEditingItem(null)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Anulo
                </button>
                <button
                  onClick={handleUpdate}
                  className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Ruaj
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
