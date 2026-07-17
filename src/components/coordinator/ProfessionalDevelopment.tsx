import { useState } from 'react';
import { Calendar, Clock, Users, MapPin, Video, Plus, CheckCircle, PlayCircle, BookOpen, Trash2, X, Check } from 'lucide-react';

interface Training {
  id: string;
  title: string;
  description: string;
  type: 'online' | 'fizik' | 'hibrid';
  date: string;
  time: string;
  duration: string;
  location: string;
  instructor: string;
  participants: number;
  maxParticipants: number;
  status: 'planifikuar' | 'live' | 'përfunduar';
  category: string;
}

const trainings: Training[] = [
  {
    id: '1',
    title: 'Metodat e Mësimdhënies Interaktive',
    description: 'Teknika moderne për angazhimin e nxënësve në klasë',
    type: 'online',
    date: '25 Prill 2024',
    time: '14:00',
    duration: '2 orë',
    location: 'Google Meet',
    instructor: 'Dr. Alma Bekteshi',
    participants: 18,
    maxParticipants: 25,
    status: 'planifikuar',
    category: 'Metodologji'
  },
  {
    id: '2',
    title: 'Përdorimi i AI në Arsim',
    description: 'Si të integroni inteligjencën artificiale në mësimdhënie',
    type: 'hibrid',
    date: '28 Prill 2024',
    time: '10:00',
    duration: '3 orë',
    location: 'Salla e Konferencave',
    instructor: 'Prof. Ermal Hoxha',
    participants: 22,
    maxParticipants: 30,
    status: 'planifikuar',
    category: 'Teknologji'
  },
  {
    id: '3',
    title: 'Vlerësimi Formativ',
    description: 'Strategji për vlerësimin e vazhdueshëm të nxënësve',
    type: 'online',
    date: '20 Prill 2024',
    time: '15:00',
    duration: '1.5 orë',
    location: 'Zoom',
    instructor: 'Dr. Lira Malaj',
    participants: 24,
    maxParticipants: 24,
    status: 'live',
    category: 'Vlerësim'
  },
  {
    id: '4',
    title: 'Menaxhimi i Klasës',
    description: 'Teknika për krijimin e një mjedisi pozitiv mësimor',
    type: 'fizik',
    date: '15 Prill 2024',
    time: '09:00',
    duration: '4 orë',
    location: 'Salla e Trajnimeve',
    instructor: 'Msc. Sokol Berisha',
    participants: 20,
    maxParticipants: 20,
    status: 'përfunduar',
    category: 'Menaxhim'
  },
];

export default function ProfessionalDevelopment() {
  const [items, setItems] = useState<Training[]>(trainings);
  const [filter, setFilter] = useState<'all' | 'planifikuar' | 'live' | 'përfunduar'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTraining, setNewTraining] = useState({ title: '', description: '', type: 'online', date: '', time: '', duration: '', location: '', instructor: '', maxParticipants: 20 });

  const filteredTrainings = filter === 'all' 
    ? items 
    : items.filter(t => t.status === filter);

  const handleAdd = () => {
    const training: Training = {
      id: Date.now().toString(),
      ...newTraining,
      type: newTraining.type as any,
      participants: 0,
      status: 'planifikuar',
      category: 'Tjetër'
    };
    setItems([training, ...items]);
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('A jeni i sigurt?')) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  const statusConfig = {
    planifikuar: { color: 'bg-blue-100 text-blue-700', icon: Calendar, label: 'Planifikuar' },
    live: { color: 'bg-red-100 text-red-700', icon: PlayCircle, label: 'Live Tani' },
    përfunduar: { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle, label: 'Përfunduar' },
  };

  const typeConfig = {
    online: { color: 'bg-violet-100 text-violet-700', icon: Video, label: 'Online' },
    fizik: { color: 'bg-amber-100 text-amber-700', icon: MapPin, label: 'Fizik' },
    hibrid: { color: 'bg-cyan-100 text-cyan-700', icon: Users, label: 'Hibrid' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Zhvillimi Profesional</h2>
          <p className="text-sm text-gray-500">Trajnime dhe aktivitete për zhvillimin e stafit</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl font-medium shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all"
        >
          <Plus className="w-4 h-4" />
          Trajnim i Ri
        </button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{trainings.filter(t => t.status === 'planifikuar').length}</div>
              <div className="text-sm text-gray-500">Planifikuar</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
              <PlayCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{trainings.filter(t => t.status === 'live').length}</div>
              <div className="text-sm text-gray-500">Live Tani</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{trainings.filter(t => t.status === 'përfunduar').length}</div>
              <div className="text-sm text-gray-500">Përfunduar</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{trainings.reduce((sum, t) => sum + t.participants, 0)}</div>
              <div className="text-sm text-gray-500">Pjesëmarrës</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[
          { value: 'all' as const, label: 'Të Gjitha' },
          { value: 'planifikuar' as const, label: 'Planifikuar' },
          { value: 'live' as const, label: 'Live' },
          { value: 'përfunduar' as const, label: 'Përfunduar' },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f.value
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Trainings Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredTrainings.map((training) => {
          const status = statusConfig[training.status];
          const type = typeConfig[training.type];
          
          return (
            <div key={training.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                        <status.icon className="w-3 h-3" />
                        {status.label}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${type.color}`}>
                        <type.icon className="w-3 h-3" />
                        {type.label}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{training.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{training.description}</p>
                  </div>
                  <button 
                    onClick={() => handleDelete(training.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{training.date} në {training.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{training.duration}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{training.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <BookOpen className="w-4 h-4 text-gray-400" />
                    <span>{training.instructor}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {training.participants}/{training.maxParticipants} pjesëmarrës
                    </span>
                  </div>
                  {training.status === 'live' ? (
                    <button className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors flex items-center gap-2">
                      <PlayCircle className="w-4 h-4" />
                      Bashkohu
                    </button>
                  ) : training.status === 'planifikuar' ? (
                    <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl text-sm font-medium hover:from-orange-600 hover:to-amber-700 transition-all">
                      Regjistrohu
                    </button>
                  ) : (
                    <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
                      Shiko Detajet
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Training Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Shto Trajnim të Ri</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titulli</label>
                <input
                  type="text"
                  value={newTraining.title}
                  onChange={(e) => setNewTraining({...newTraining, title: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
                  placeholder="p.sh. Trajnim për AI"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lloji</label>
                <select
                  value={newTraining.type}
                  onChange={(e) => setNewTraining({...newTraining, type: e.target.value as any})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
                >
                  <option value="online">Online</option>
                  <option value="fizik">Fizik</option>
                  <option value="hibrid">Hibrid</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                  <input
                    type="text"
                    value={newTraining.date}
                    onChange={(e) => setNewTraining({...newTraining, date: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
                    placeholder="25 Prill"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ora</label>
                  <input
                    type="text"
                    value={newTraining.time}
                    onChange={(e) => setNewTraining({...newTraining, time: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
                    placeholder="14:00"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Anulo
                </button>
                <button
                  onClick={handleAdd}
                  className="flex-1 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl font-medium shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Krijo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
