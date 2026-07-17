import { useState } from 'react';
import { Video, Plus, Calendar, Clock, Users, Copy, Check, Play, Phone, PhoneOff, Mic, MicOff, Camera, CameraOff, MonitorUp, Trash2, X } from 'lucide-react';

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  participants: string[];
  meetLink: string;
  status: 'planifikuar' | 'live' | 'përfunduar';
  type: 'ekip' | 'individual' | 'shkollë';
}

const meetings: Meeting[] = [
  {
    id: '1',
    title: 'Mbledhje Ekipi Matematikë',
    date: '25 Prill 2024',
    time: '14:00',
    duration: '1 orë',
    participants: ['Arta Krasniqi', 'Besnik Hoxha', 'Drita Berisha'],
    meetLink: 'https://meet.smartschool.al/math-team-25',
    status: 'planifikuar',
    type: 'ekip'
  },
  {
    id: '2',
    title: 'Konsultim Individual - Flora Gashi',
    date: '24 Prill 2024',
    time: '16:00',
    duration: '30 min',
    participants: ['Flora Gashi'],
    meetLink: 'https://meet.smartschool.al/consult-flora',
    status: 'live',
    type: 'individual'
  },
  {
    id: '3',
    title: 'Mbledhje e Përgjithshme e Shkollës',
    date: '20 Prill 2024',
    time: '10:00',
    duration: '2 orë',
    participants: ['Të gjithë mësuesit'],
    meetLink: 'https://meet.smartschool.al/school-meeting-20',
    status: 'përfunduar',
    type: 'shkollë'
  },
];

export default function VideoMeet() {
  const [items, setItems] = useState<Meeting[]>(meetings);
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [inCall, setInCall] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [newMeeting, setNewMeeting] = useState({ title: '', date: '', time: '', type: 'ekip' });

  const handleAdd = () => {
    const meeting: Meeting = {
      id: Date.now().toString(),
      ...newMeeting,
      type: newMeeting.type as any,
      duration: '1 orë',
      participants: ['Ekipi'],
      meetLink: `https://meet.smartschool.al/${Date.now()}`,
      status: 'planifikuar'
    };
    setItems([meeting, ...items]);
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('A jeni i sigurt?')) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  const copyLink = async (link: string) => {
    await navigator.clipboard.writeText(link);
    setCopiedLink(link);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const statusConfig = {
    planifikuar: { color: 'bg-blue-100 text-blue-700', label: 'Planifikuar' },
    live: { color: 'bg-red-100 text-red-700 animate-pulse', label: '🔴 Live' },
    përfunduar: { color: 'bg-gray-100 text-gray-700', label: 'Përfunduar' },
  };

  const typeConfig = {
    ekip: { color: 'bg-violet-100 text-violet-700', label: 'Ekip' },
    individual: { color: 'bg-emerald-100 text-emerald-700', label: 'Individual' },
    shkollë: { color: 'bg-amber-100 text-amber-700', label: 'Shkollë' },
  };

  if (inCall) {
    return (
      <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
        {/* Video Area */}
        <div className="flex-1 flex items-center justify-center relative">
          <div className="text-center text-white">
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-4 text-5xl">
              🛡️
            </div>
            <h2 className="text-2xl font-bold">Koordinatori i Shkollës</h2>
            <p className="text-gray-400 mt-2">Duke folur...</p>
          </div>
          
          {/* Self View */}
          <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-xl flex items-center justify-center">
            {cameraOn ? (
              <div className="text-4xl">👤</div>
            ) : (
              <CameraOff className="w-8 h-8 text-gray-500" />
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-800/80 backdrop-blur p-4">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setMicOn(!micOn)}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                micOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {micOn ? <Mic className="w-6 h-6 text-white" /> : <MicOff className="w-6 h-6 text-white" />}
            </button>
            <button
              onClick={() => setCameraOn(!cameraOn)}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                cameraOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {cameraOn ? <Camera className="w-6 h-6 text-white" /> : <CameraOff className="w-6 h-6 text-white" />}
            </button>
            <button className="w-14 h-14 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center">
              <MonitorUp className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={() => setInCall(false)}
              className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center"
            >
              <PhoneOff className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Video Meet</h2>
          <p className="text-sm text-gray-500">Planifikoni dhe filloni takime video me ekipin</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setInCall(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors"
          >
            <Play className="w-4 h-4" />
            Fillo Takim Tani
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-medium shadow-lg shadow-red-200 hover:shadow-red-300 transition-all"
          >
            <Plus className="w-4 h-4" />
            Planifiko Takim
          </button>
        </div>
      </div>

      {/* Quick Start */}
      <div className="bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <Video className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Filloni një takim të menjëhershëm</h3>
              <p className="text-white/70 text-sm">Krijoni dhe ndani linkun me pjesëmarrësit</p>
            </div>
          </div>
          <button
            onClick={() => setInCall(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white text-red-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            <Phone className="w-5 h-5" />
            Fillo Tani
          </button>
        </div>
      </div>

      {/* Meetings List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Takimet ({meetings.length})</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {meetings.map((meeting) => {
            const status = statusConfig[meeting.status];
            const type = typeConfig[meeting.type];
            
            return (
              <div key={meeting.id} className="p-5 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${type.color}`}>
                        {type.label}
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-900">{meeting.title}</h4>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{meeting.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{meeting.time} ({meeting.duration})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{meeting.participants.length} pjesëmarrës</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleDelete(meeting.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => copyLink(meeting.meetLink)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        copiedLink === meeting.meetLink
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {copiedLink === meeting.meetLink ? (
                        <>
                          <Check className="w-4 h-4" />
                          Kopjuar!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Kopjo Link
                        </>
                      )}
                    </button>
                    {meeting.status === 'live' ? (
                      <button
                        onClick={() => setInCall(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        Bashkohu
                      </button>
                    ) : meeting.status === 'planifikuar' ? (
                      <button
                        onClick={() => setInCall(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl text-sm font-medium transition-all"
                      >
                        <Video className="w-4 h-4" />
                        Fillo
                      </button>
                    ) : (
                      <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium">
                        Shiko
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Meeting Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Planifiko Takim të Ri</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titulli i Takimit</label>
                <input
                  type="text"
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none"
                  placeholder="p.sh. Mbledhje për Planin"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                  <input
                    type="text"
                    value={newMeeting.date}
                    onChange={(e) => setNewMeeting({...newMeeting, date: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none"
                    placeholder="25 Prill"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ora</label>
                  <input
                    type="text"
                    value={newMeeting.time}
                    onChange={(e) => setNewMeeting({...newMeeting, time: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none"
                    placeholder="14:00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lloji</label>
                <select
                  value={newMeeting.type}
                  onChange={(e) => setNewMeeting({...newMeeting, type: e.target.value as any})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none"
                >
                  <option value="ekip">Ekip</option>
                  <option value="individual">Individual</option>
                  <option value="shkollë">Shkollë</option>
                </select>
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
                  className="flex-1 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-medium shadow-lg shadow-red-200 flex items-center justify-center gap-2"
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
