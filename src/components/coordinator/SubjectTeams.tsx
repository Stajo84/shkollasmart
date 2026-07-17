import { useState } from 'react';
import { Plus, Search, UserPlus, X, Check, Edit2, Trash2 } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  subject: string;
  avatar: string;
  email: string;
  phone: string;
  isLeader: boolean;
}

interface Team {
  id: string;
  name: string;
  emoji: string;
  color: string;
  members: TeamMember[];
}

const initialTeams: Team[] = [
  {
    id: '1',
    name: 'Ekipi i Matematikës',
    emoji: '📐',
    color: 'from-violet-500 to-purple-600',
    members: [
      { id: '1', name: 'Arta Krasniqi', role: 'Drejtues Ekipi', subject: 'Matematikë', avatar: '👩‍🏫', email: 'arta@shkolla.al', phone: '+355 69 123 4567', isLeader: true },
      { id: '2', name: 'Besnik Hoxha', role: 'Mësues', subject: 'Matematikë', avatar: '👨‍🏫', email: 'besnik@shkolla.al', phone: '+355 69 234 5678', isLeader: false },
      { id: '3', name: 'Drita Berisha', role: 'Mësues', subject: 'Matematikë', avatar: '👩‍🏫', email: 'drita@shkolla.al', phone: '+355 69 345 6789', isLeader: false },
    ]
  },
  {
    id: '2',
    name: 'Ekipi i Gjuhës Shqipe',
    emoji: '📚',
    color: 'from-blue-500 to-indigo-600',
    members: [
      { id: '4', name: 'Erion Murati', role: 'Drejtues Ekipi', subject: 'Gjuhë Shqipe', avatar: '👨‍🏫', email: 'erion@shkolla.al', phone: '+355 69 456 7890', isLeader: true },
      { id: '5', name: 'Flora Gashi', role: 'Mësues', subject: 'Gjuhë Shqipe', avatar: '👩‍🏫', email: 'flora@shkolla.al', phone: '+355 69 567 8901', isLeader: false },
    ]
  },
  {
    id: '3',
    name: 'Ekipi i Shkencës',
    emoji: '🔬',
    color: 'from-emerald-500 to-teal-600',
    members: [
      { id: '6', name: 'Genti Rexha', role: 'Drejtues Ekipi', subject: 'Fizikë', avatar: '👨‍🔬', email: 'genti@shkolla.al', phone: '+355 69 678 9012', isLeader: true },
      { id: '7', name: 'Hana Malaj', role: 'Mësues', subject: 'Kimi', avatar: '👩‍🔬', email: 'hana@shkolla.al', phone: '+355 69 789 0123', isLeader: false },
      { id: '8', name: 'Ilir Duka', role: 'Mësues', subject: 'Biologji', avatar: '👨‍🏫', email: 'ilir@shkolla.al', phone: '+355 69 890 1234', isLeader: false },
    ]
  },
  {
    id: '4',
    name: 'Ekipi i Historisë & Gjeografisë',
    emoji: '🌍',
    color: 'from-orange-500 to-amber-600',
    members: [
      { id: '9', name: 'Jeta Brahimi', role: 'Drejtues Ekipi', subject: 'Histori', avatar: '👩‍🏫', email: 'jeta@shkolla.al', phone: '+355 69 901 2345', isLeader: true },
      { id: '10', name: 'Klodi Shehu', role: 'Mësues', subject: 'Gjeografi', avatar: '👨‍🏫', email: 'klodi@shkolla.al', phone: '+355 69 012 3456', isLeader: false },
    ]
  },
];

export default function SubjectTeams() {
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [editingMember, setEditingMember] = useState<{ teamId: string, member: TeamMember } | null>(null);
  const [newMember, setNewMember] = useState({ name: '', email: '', phone: '', subject: '' });
  const [newTeam, setNewTeam] = useState({ name: '', subject: '', emoji: '📚', leaderName: '', leaderEmail: '' });

  const teamColors = [
    'from-violet-500 to-purple-600',
    'from-blue-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-amber-600',
    'from-pink-500 to-rose-600',
    'from-cyan-500 to-blue-600',
    'from-red-500 to-orange-600',
  ];

  const emojiOptions = ['📐', '📚', '🔬', '🌍', '🎨', '💻', '🎵', '⚽', '🧪', '📊', '✏️', '🌍'];

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.members.some(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddMember = () => {
    if (selectedTeam && newMember.name && newMember.email) {
      const updatedTeams = teams.map(team => {
        if (team.id === selectedTeam.id) {
          return {
            ...team,
            members: [...team.members, {
              id: Date.now().toString(),
              name: newMember.name,
              role: 'Mësues',
              subject: newMember.subject || selectedTeam.name.replace('Ekipi i ', ''),
              avatar: '👩‍🏫',
              email: newMember.email,
              phone: newMember.phone,
              isLeader: false
            }]
          };
        }
        return team;
      });
      setTeams(updatedTeams);
      setNewMember({ name: '', email: '', phone: '', subject: '' });
      setShowAddMember(false);
    }
  };

  const handleUpdateMember = () => {
    if (editingMember) {
      const updatedTeams = teams.map(team => {
        if (team.id === editingMember.teamId) {
          return {
            ...team,
            members: team.members.map(m => m.id === editingMember.member.id ? editingMember.member : m)
          };
        }
        return team;
      });
      setTeams(updatedTeams);
      setEditingMember(null);
    }
  };

  const handleDeleteMember = (teamId: string, memberId: string) => {
    if (confirm('A jeni i sigurt që dëshironi të fshini këtë anëtar?')) {
      const updatedTeams = teams.map(team => {
        if (team.id === teamId) {
          return {
            ...team,
            members: team.members.filter(m => m.id !== memberId)
          };
        }
        return team;
      });
      setTeams(updatedTeams);
    }
  };

  const handleCreateTeam = () => {
    if (!newTeam.name || !newTeam.subject || !newTeam.leaderName) return;

    const leader: TeamMember = {
      id: Date.now().toString(),
      name: newTeam.leaderName,
      role: 'Drejtues Ekipi',
      subject: newTeam.subject,
      avatar: '👩‍🏫',
      email: newTeam.leaderEmail || '',
      phone: '',
      isLeader: true
    };

    const team: Team = {
      id: Date.now().toString(),
      name: newTeam.name,
      emoji: newTeam.emoji,
      color: teamColors[teams.length % teamColors.length],
      members: [leader]
    };

    setTeams([...teams, team]);
    setNewTeam({ name: '', subject: '', emoji: '📚', leaderName: '', leaderEmail: '' });
    setShowAddTeam(false);
  };

  const handleDeleteTeam = (teamId: string, teamName: string) => {
    if (confirm(`A jeni i sigurt që dëshironi të fshini ekipin "${teamName}"? Të gjithë anëtarët do të fshihen.`)) {
      setTeams(teams.filter(t => t.id !== teamId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Ekipet Lëndore</h2>
          <p className="text-sm text-gray-500">Menaxhoni ekipet e mësuesve sipas lëndëve</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Kërko mësues..."
              className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none text-sm w-64"
            />
          </div>
          <button 
            onClick={() => setShowAddTeam(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-medium shadow-lg shadow-amber-200 hover:shadow-amber-300 transition-all"
          >
            <Plus className="w-4 h-4" />
            Ekip i Ri
          </button>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredTeams.map((team) => (
          <div key={team.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            {/* Team Header */}
            <div className={`bg-gradient-to-r ${team.color} p-5 text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{team.emoji}</span>
                  <div>
                    <h3 className="font-bold text-lg">{team.name}</h3>
                    <p className="text-white/80 text-sm">{team.members.length} anëtarë</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => handleDeleteTeam(team.id, team.name)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    title="Fshi Ekipin"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Members List */}
            <div className="p-5">
              <div className="space-y-3">
                {team.members.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center text-xl">
                      {member.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 truncate">{member.name}</span>
                        {member.isLeader && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                            Drejtues
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">{member.subject}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => setEditingMember({ teamId: team.id, member: { ...member } })}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteMember(team.id, member.id)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Member Button */}
              <button
                onClick={() => { setSelectedTeam(team); setShowAddMember(true); }}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-amber-300 hover:text-amber-600 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Shto Anëtar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Member Modal */}
      {showAddMember && selectedTeam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Shto Anëtar të Ri</h3>
              <button onClick={() => setShowAddMember(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emri i Plotë</label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none"
                  placeholder="p.sh. Arta Gashi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none"
                  placeholder="email@shkolla.al"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                <input
                  type="tel"
                  value={newMember.phone}
                  onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none"
                  placeholder="+355 69 XXX XXXX"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowAddMember(false)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Anulo
                </button>
                <button
                  onClick={handleAddMember}
                  className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-medium shadow-lg shadow-amber-200 flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Shto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {editingMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Edito Anëtarin</h3>
              <button onClick={() => setEditingMember(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emri i Plotë</label>
                <input
                  type="text"
                  value={editingMember.member.name}
                  onChange={(e) => setEditingMember({ ...editingMember, member: { ...editingMember.member, name: e.target.value }})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Roli</label>
                <select
                  value={editingMember.member.role}
                  onChange={(e) => setEditingMember({ ...editingMember, member: { ...editingMember.member, role: e.target.value }})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none"
                >
                  <option value="Mësues">Mësues</option>
                  <option value="Drejtues Ekipi">Drejtues Ekipi</option>
                  <option value="Asistent">Asistent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editingMember.member.email}
                  onChange={(e) => setEditingMember({ ...editingMember, member: { ...editingMember.member, email: e.target.value }})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setEditingMember(null)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Anulo
                </button>
                <button
                  onClick={handleUpdateMember}
                  className="flex-1 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Ruaj
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Team Modal */}
      {showAddTeam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Krijo Ekip të Ri</h3>
              <button onClick={() => setShowAddTeam(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emri i Ekipit</label>
                <input
                  type="text"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none"
                  placeholder="p.sh. Ekipi i Matematikës"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lënda</label>
                <select
                  value={newTeam.subject}
                  onChange={(e) => setNewTeam({ ...newTeam, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none"
                >
                  <option value="">Zgjidhni lëndën</option>
                  <option value="Matematikë">Matematikë</option>
                  <option value="Gjuhë Shqipe">Gjuhë Shqipe</option>
                  <option value="Shkencë">Shkencë</option>
                  <option value="Histori">Histori</option>
                  <option value="Gjeografi">Gjeografi</option>
                  <option value="Fizikë">Fizikë</option>
                  <option value="Kimi">Kimi</option>
                  <option value="Biologji">Biologji</option>
                  <option value="Anglisht">Anglisht</option>
                  <option value="Tjetër">Tjetër</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ikona e Ekipit</label>
                <div className="flex flex-wrap gap-2">
                  {emojiOptions.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewTeam({ ...newTeam, emoji })}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all ${
                        newTeam.emoji === emoji
                          ? 'bg-amber-100 border-2 border-amber-500'
                          : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Drejtuesi i Ekipit</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Emri i Drejtuesit</label>
                    <input
                      type="text"
                      value={newTeam.leaderName}
                      onChange={(e) => setNewTeam({ ...newTeam, leaderName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none"
                      placeholder="p.sh. Arta Krasniqi"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email i Drejtuesit</label>
                    <input
                      type="email"
                      value={newTeam.leaderEmail}
                      onChange={(e) => setNewTeam({ ...newTeam, leaderEmail: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none"
                      placeholder="email@shkolla.al"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddTeam(false)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Anulo
                </button>
                <button
                  onClick={handleCreateTeam}
                  disabled={!newTeam.name || !newTeam.subject || !newTeam.leaderName}
                  className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-medium shadow-lg shadow-amber-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  Krijo Ekip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
