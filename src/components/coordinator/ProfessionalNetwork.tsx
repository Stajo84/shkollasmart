import { useState } from 'react';
import { Search, UserPlus, MessageCircle, Building, MapPin, Check, X } from 'lucide-react';

interface Connection {
  id: string;
  name: string;
  role: string;
  school: string;
  city: string;
  avatar: string;
  connected: boolean;
  pending: boolean;
}

const initialConnections: Connection[] = [
  { id: '1', name: 'Sokol Berisha', role: 'Koordinator', school: 'Shkolla "Naim Frashëri"', city: 'Tiranë', avatar: '👨‍💼', connected: true, pending: false },
  { id: '2', name: 'Lira Malaj', role: 'Koordinator', school: 'Shkolla "Ismail Qemali"', city: 'Vlorë', avatar: '👩‍💼', connected: true, pending: false },
  { id: '3', name: 'Ermal Krasniqi', role: 'Drejtor', school: 'Shkolla "Sami Frashëri"', city: 'Prishtinë', avatar: '👨‍💼', connected: true, pending: false },
  { id: '4', name: 'Dorina Hoxha', role: 'Koordinator', school: 'Shkolla "Abdyl Frashëri"', city: 'Durrës', avatar: '👩‍💼', connected: false, pending: true },
  { id: '5', name: 'Artan Murati', role: 'Koordinator', school: 'Shkolla "Fan Noli"', city: 'Korçë', avatar: '👨‍💼', connected: false, pending: false },
  { id: '6', name: 'Besa Gashi', role: 'Koordinator', school: 'Shkolla "Pjetër Budi"', city: 'Shkodër', avatar: '👩‍💼', connected: false, pending: false },
];

export default function ProfessionalNetwork() {
  const [connections, setConnections] = useState<Connection[]>(initialConnections);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'connected' | 'pending'>('all');

  const filteredConnections = connections.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'connected') return matchesSearch && c.connected;
    if (filter === 'pending') return matchesSearch && c.pending;
    return matchesSearch;
  });

  const handleConnect = (id: string) => {
    setConnections(prev => prev.map(c => 
      c.id === id ? { ...c, pending: true } : c
    ));
  };

  const handleAccept = (id: string) => {
    setConnections(prev => prev.map(c => 
      c.id === id ? { ...c, connected: true, pending: false } : c
    ));
  };

  const connectedCount = connections.filter(c => c.connected).length;
  const pendingCount = connections.filter(c => c.pending).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Rrjeti Profesional</h2>
          <p className="text-sm text-gray-500">Lidhuni me koordinatorë dhe drejtorë të shkolllave të tjera</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Kërko profesionistë..."
            className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm w-64"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{connectedCount}</div>
              <div className="text-sm text-gray-500">Lidhje Aktive</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{pendingCount}</div>
              <div className="text-sm text-gray-500">Në Pritje</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Building className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{new Set(connections.filter(c => c.connected).map(c => c.school)).size}</div>
              <div className="text-sm text-gray-500">Shkolla</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[
          { value: 'all' as const, label: 'Të Gjitha' },
          { value: 'connected' as const, label: 'Të Lidhur' },
          { value: 'pending' as const, label: 'Në Pritje' },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Connections Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredConnections.map((connection) => (
          <div key={connection.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-2xl">
                {connection.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900">{connection.name}</h4>
                <p className="text-sm text-blue-600 font-medium">{connection.role}</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building className="w-4 h-4 text-gray-400" />
                <span className="truncate">{connection.school}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{connection.city}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              {connection.connected ? (
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    Mesazh
                  </button>
                  <span className="flex items-center gap-1 px-3 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-medium">
                    <Check className="w-4 h-4" />
                    Lidhur
                  </span>
                </div>
              ) : connection.pending ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAccept(connection.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Prano
                  </button>
                  <button className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleConnect(connection.id)}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-blue-600 hover:to-indigo-700 transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  Lidhu
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
