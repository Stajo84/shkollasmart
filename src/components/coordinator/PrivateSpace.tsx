import { useState, useRef } from 'react';
import { FolderLock, Upload, FileText, Share2, Eye, Trash2, Plus, Lock, Unlock, Check, X, Users, File, Image, Video, Presentation, FileSpreadsheet } from 'lucide-react';

interface PrivateMaterial {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  isShared: boolean;
  sharedWith: string[];
  notes: string;
}

const initialMaterials: PrivateMaterial[] = [
  { id: '1', name: 'Strategjia Vjetore e Shkollës.pdf', type: 'pdf', size: '4.2 MB', uploadedAt: '15 Prill 2024', isShared: false, sharedWith: [], notes: 'Dokumenti i planifikimit strategjik për vitin akademik 2024-2025' },
  { id: '2', name: 'Vlerësimi i Performancës - Mësuesit.xlsx', type: 'xlsx', size: '1.8 MB', uploadedAt: '10 Prill 2024', isShared: true, sharedWith: ['Drejtoria'], notes: 'Vlerësimi tremujor i mësuesve' },
  { id: '3', name: 'Plani i Trajnimeve 2024.docx', type: 'docx', size: '0.9 MB', uploadedAt: '5 Prill 2024', isShared: true, sharedWith: ['Ekipi Koordinues', 'Drejtoria'], notes: 'Plani i trajnimeve profesionale' },
  { id: '4', name: 'Buxheti - Projekt Propozimi.pptx', type: 'pptx', size: '12.5 MB', uploadedAt: '1 Prill 2024', isShared: false, sharedWith: [], notes: 'Prezantimi për kërkesën e buxhetit shtesë' },
];

const shareTargets = [
  { id: '1', name: 'Drejtoria' },
  { id: '2', name: 'Ekipi Koordinues' },
  { id: '3', name: 'Ekipi Matematikë' },
  { id: '4', name: 'Ekipi Gjuhë Shqipe' },
  { id: '5', name: 'Ekipi Shkencë' },
  { id: '6', name: 'Të gjithë Mësuesit' },
  { id: '7', name: 'Klasa 7A' },
  { id: '8', name: 'Klasa 8A' },
  { id: '9', name: 'Klasa 9A' },
];

function getFileIcon(type: string) {
  const t = type.toLowerCase();
  if (t === 'pdf') return { icon: FileText, color: 'text-red-500 bg-red-50', label: 'PDF' };
  if (['doc', 'docx'].includes(t)) return { icon: FileText, color: 'text-blue-500 bg-blue-50', label: 'Word' };
  if (['ppt', 'pptx'].includes(t)) return { icon: Presentation, color: 'text-orange-500 bg-orange-50', label: 'PPT' };
  if (['xls', 'xlsx'].includes(t)) return { icon: FileSpreadsheet, color: 'text-emerald-500 bg-emerald-50', label: 'Excel' };
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(t)) return { icon: Image, color: 'text-purple-500 bg-purple-50', label: 'Imazh' };
  if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(t)) return { icon: Video, color: 'text-pink-500 bg-pink-50', label: 'Video' };
  return { icon: File, color: 'text-gray-500 bg-gray-100', label: t.toUpperCase() };
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function PrivateSpace() {
  const [materials, setMaterials] = useState<PrivateMaterial[]>(initialMaterials);
  const [showShareModal, setShowShareModal] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<{ name: string; progress: number }[]>([]);
  const [noteInput, setNoteInput] = useState('');
  const [showNoteFor, setShowNoteFor] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = (fileList: FileList) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    // Show uploading state
    const uploading = files.map(f => ({ name: f.name, progress: 0 }));
    setUploadingFiles(uploading);

    // Simulate progressive upload for each file
    files.forEach((file, index) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30 + 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);

          // Add to materials
          const ext = file.name.split('.').pop() || 'other';
          const newMaterial: PrivateMaterial = {
            id: Date.now().toString() + '-' + index,
            name: file.name,
            type: ext,
            size: formatFileSize(file.size),
            uploadedAt: new Date().toLocaleDateString('sq-AL', { day: 'numeric', month: 'long', year: 'numeric' }),
            isShared: false,
            sharedWith: [],
            notes: ''
          };

          setMaterials(prev => [newMaterial, ...prev]);

          // Remove from uploading list after a short delay
          setTimeout(() => {
            setUploadingFiles(prev => prev.filter(f => f.name !== file.name));
          }, 500);
        }

        setUploadingFiles(prev =>
          prev.map(f => f.name === file.name ? { ...f, progress: Math.min(progress, 100) } : f)
        );
      }, 200 + Math.random() * 300);
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  };

  const toggleShare = (materialId: string, targetName: string) => {
    setMaterials(prev => prev.map(m => {
      if (m.id === materialId) {
        const isCurrentlyShared = m.sharedWith.includes(targetName);
        const newSharedWith = isCurrentlyShared
          ? m.sharedWith.filter(t => t !== targetName)
          : [...m.sharedWith, targetName];
        return { ...m, sharedWith: newSharedWith, isShared: newSharedWith.length > 0 };
      }
      return m;
    }));
  };

  const handleDelete = (id: string) => {
    if (confirm('A jeni i sigurt që dëshironi ta fshini këtë material?')) {
      setMaterials(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleSaveNote = (id: string) => {
    setMaterials(prev => prev.map(m => m.id === id ? { ...m, notes: noteInput } : m));
    setShowNoteFor(null);
    setNoteInput('');
  };

  const privateCount = materials.filter(m => !m.isShared).length;
  const sharedCount = materials.filter(m => m.isShared).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Hapësira Ime Private</h2>
          <p className="text-sm text-gray-500">Ngarkoni, menaxhoni dhe ndani materialet tuaja</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <FolderLock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{materials.length}</div>
              <div className="text-sm text-gray-500">Totali</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
              <Lock className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{privateCount}</div>
              <div className="text-sm text-gray-500">Private</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Unlock className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{sharedCount}</div>
              <div className="text-sm text-gray-500">Të Ndara</div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Area — Drag & Drop + File Picker */}
      <div
        className={`relative border-2 border-dashed rounded-2xl transition-all duration-200 ${
          dragActive
            ? 'border-amber-500 bg-amber-50 scale-[1.01]'
            : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50/30'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.svg,.mp4,.mov,.avi,.zip,.rar,.txt,.csv"
        />

        <div className="p-8 text-center">
          <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-colors ${dragActive ? 'bg-amber-200' : 'bg-amber-100'}`}>
            <Upload className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {dragActive ? 'Lëshoni skedarët këtu!' : 'Ngarkoni materiale'}
          </h3>
          <p className="text-sm text-gray-500 mb-5">
            Tërhiqni dhe lëshoni skedarët ose klikoni butonin për t'i zgjedhur
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold shadow-lg shadow-amber-200 hover:shadow-amber-300 hover:-translate-y-0.5 transition-all"
            >
              <Plus className="w-5 h-5" />
              Zgjidh Skedarë
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
            {[
              { label: 'PDF', color: 'bg-red-100 text-red-600' },
              { label: 'Word', color: 'bg-blue-100 text-blue-600' },
              { label: 'PPT', color: 'bg-orange-100 text-orange-600' },
              { label: 'Excel', color: 'bg-emerald-100 text-emerald-600' },
              { label: 'Imazhe', color: 'bg-purple-100 text-purple-600' },
              { label: 'Video', color: 'bg-pink-100 text-pink-600' },
              { label: '+Të tjera', color: 'bg-gray-100 text-gray-600' },
            ].map((f) => (
              <span key={f.label} className={`px-2.5 py-1 rounded-lg text-xs font-medium ${f.color}`}>
                {f.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Uploading Progress */}
      {uploadingFiles.length > 0 && (
        <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-amber-100 bg-amber-50">
            <h4 className="text-sm font-bold text-amber-700">⏳ Duke ngarkuar ({uploadingFiles.length} skedarë)...</h4>
          </div>
          <div className="divide-y divide-gray-50">
            {uploadingFiles.map((file) => (
              <div key={file.name} className="flex items-center gap-4 px-5 py-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <Upload className="w-5 h-5 text-amber-600 animate-bounce" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{file.name}</div>
                  <div className="w-full bg-gray-100 rounded-full h-2 mt-1.5">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-semibold text-amber-600 whitespace-nowrap">
                  {Math.round(file.progress)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Materials List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Materialet e Mia ({materials.length})</h3>
        </div>

        {materials.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <FolderLock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Asnjë material ende</h3>
            <p className="text-gray-500 text-sm">Ngarkoni materialin tuaj të parë duke përdorur zonën e mësipërme.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {materials.map((material) => {
              const fileIcon = getFileIcon(material.type);
              return (
                <div key={material.id} className="p-4 sm:p-5 hover:bg-gray-50 transition-colors group">
                  <div className="flex items-start gap-4">
                    {/* File icon */}
                    <div className={`w-12 h-12 rounded-xl ${fileIcon.color} flex items-center justify-center shrink-0`}>
                      <fileIcon.icon className="w-6 h-6" />
                    </div>

                    {/* File details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-medium text-gray-900 truncate">{material.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${fileIcon.color}`}>
                          {fileIcon.label}
                        </span>
                        {material.isShared ? (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                            <Unlock className="w-3 h-3" />
                            Ndarë
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                            <Lock className="w-3 h-3" />
                            Private
                          </span>
                        )}
                      </div>

                      {/* Notes */}
                      {material.notes ? (
                        <p className="text-sm text-gray-500 mb-1.5">{material.notes}</p>
                      ) : null}

                      <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                        <span>{material.size}</span>
                        <span>•</span>
                        <span>{material.uploadedAt}</span>
                        {material.sharedWith.length > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-600">Ndarë me: {material.sharedWith.join(', ')}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setShowNoteFor(material.id); setNoteInput(material.notes); }}
                        className="p-2 hover:bg-amber-50 rounded-lg transition-colors text-gray-400 hover:text-amber-600"
                        title="Shënim"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowShareModal(material.id)}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-gray-400 hover:text-blue-600"
                        title="Ndaj me ekipe/klasa"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600" title="Shiko">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(material.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-600"
                        title="Fshi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Note Modal */}
      {showNoteFor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Shënim / Përshkrim</h3>
              <button onClick={() => setShowNoteFor(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <textarea
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none resize-none"
              rows={4}
              placeholder="Shkruani një shënim për këtë material..."
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowNoteFor(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Anulo
              </button>
              <button
                onClick={() => handleSaveNote(showNoteFor)}
                className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-medium shadow-lg shadow-amber-200 flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Ruaj
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Ndaj Materialin</h3>
              <button onClick={() => setShowShareModal(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">Zgjidhni kush do ta shoh këtë material:</p>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {shareTargets.map((target) => {
                const material = materials.find(m => m.id === showShareModal);
                const isShared = material?.sharedWith.includes(target.name);
                return (
                  <label
                    key={target.id}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                      isShared ? 'bg-emerald-50 border border-emerald-200' : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isShared}
                      onChange={() => toggleShare(showShareModal!, target.name)}
                      className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">{target.name}</span>
                    </div>
                  </label>
                );
              })}
            </div>
            <button
              onClick={() => setShowShareModal(null)}
              className="w-full mt-5 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-medium flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Ruaj Ndryshimet
            </button>
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <FolderLock className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900">Hapësira juaj e sigurt</h4>
            <p className="text-sm text-gray-600 mt-1">
              Materialet janë private si parazgjedhje. Përdorni butonin <strong>Ndaj</strong> për t'i ndarë me ekipe ose klasa specifike. Formatet e pranuara: PDF, Word, PowerPoint, Excel, Imazhe, Video, dhe shumë të tjera.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
