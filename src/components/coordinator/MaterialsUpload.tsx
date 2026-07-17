import { useState, useRef } from 'react';
import { Upload, FileText, File, Image, Video, Trash2, Share2, Eye, Download, X, Check, FolderPlus } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  type: 'pdf' | 'word' | 'ppt' | 'excel' | 'image' | 'video' | 'other';
  size: string;
  uploadedAt: string;
  sharedWith: string[];
  aiProcessed: boolean;
}

const initialFiles: UploadedFile[] = [
  { id: '1', name: 'Plani Mësimor - Matematikë Klasa 7.pdf', type: 'pdf', size: '2.4 MB', uploadedAt: '20 Prill 2024', sharedWith: ['Ekipi Matematikë'], aiProcessed: true },
  { id: '2', name: 'Prezantim - Historia e Shqipërisë.pptx', type: 'ppt', size: '15.8 MB', uploadedAt: '18 Prill 2024', sharedWith: ['Ekipi Histori', 'Klasa 9A'], aiProcessed: true },
  { id: '3', name: 'Ushtrime Fizikë.docx', type: 'word', size: '1.2 MB', uploadedAt: '15 Prill 2024', sharedWith: [], aiProcessed: false },
  { id: '4', name: 'Video Tutorial - Eksperiment Kimi.mp4', type: 'video', size: '156 MB', uploadedAt: '12 Prill 2024', sharedWith: ['Ekipi Shkencë'], aiProcessed: false },
  { id: '5', name: 'Grafik Rezultatesh.xlsx', type: 'excel', size: '0.8 MB', uploadedAt: '10 Prill 2024', sharedWith: ['Të gjithë mësuesit'], aiProcessed: false },
];

const fileIcons = {
  pdf: { icon: FileText, color: 'text-red-500 bg-red-50' },
  word: { icon: FileText, color: 'text-blue-500 bg-blue-50' },
  ppt: { icon: FileText, color: 'text-orange-500 bg-orange-50' },
  excel: { icon: FileText, color: 'text-emerald-500 bg-emerald-50' },
  image: { icon: Image, color: 'text-purple-500 bg-purple-50' },
  video: { icon: Video, color: 'text-pink-500 bg-pink-50' },
  other: { icon: File, color: 'text-gray-500 bg-gray-50' },
};

export default function MaterialsUpload() {
  const [files, setFiles] = useState<UploadedFile[]>(initialFiles);
  const [dragActive, setDragActive] = useState(false);
  const [showShareModal, setShowShareModal] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    setUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      const newFiles: UploadedFile[] = Array.from(fileList).map((file, index) => {
        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        let type: UploadedFile['type'] = 'other';
        if (ext === 'pdf') type = 'pdf';
        else if (['doc', 'docx'].includes(ext)) type = 'word';
        else if (['ppt', 'pptx'].includes(ext)) type = 'ppt';
        else if (['xls', 'xlsx'].includes(ext)) type = 'excel';
        else if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) type = 'image';
        else if (['mp4', 'mov', 'avi'].includes(ext)) type = 'video';

        return {
          id: Date.now().toString() + index,
          name: file.name,
          type,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          uploadedAt: new Date().toLocaleDateString('sq-AL', { day: 'numeric', month: 'long', year: 'numeric' }),
          sharedWith: [],
          aiProcessed: false,
        };
      });

      setFiles(prev => [...newFiles, ...prev]);
      setUploading(false);
    }, 1500);
  };

  const handleDelete = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const shareTargets = [
    'Të gjithë mësuesit',
    'Ekipi Matematikë',
    'Ekipi Gjuhë Shqipe',
    'Ekipi Shkencë',
    'Ekipi Histori',
    'Klasa 7A',
    'Klasa 7B',
    'Klasa 8A',
    'Klasa 9A',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Ngarkimi i Materialeve</h2>
          <p className="text-sm text-gray-500">Ngarkoni dhe menaxhoni materialet mësimore</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
            <FolderPlus className="w-4 h-4" />
            Folder i Ri
          </button>
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
          dragActive 
            ? 'border-pink-500 bg-pink-50' 
            : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50/50'
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
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.mp4,.mov"
        />
        
        {uploading ? (
          <div className="py-8">
            <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Duke ngarkuar...</p>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 rounded-2xl bg-pink-100 flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Tërhiqni dhe lëshoni skedarët këtu
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              ose klikoni për të zgjedhur skedarë
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl font-medium shadow-lg shadow-pink-200 hover:shadow-pink-300 transition-all"
            >
              Zgjidh Skedarë
            </button>
            <p className="text-xs text-gray-400 mt-4">
              PDF, Word, PowerPoint, Excel, Imazhe, Video (max 200MB)
            </p>
          </>
        )}
      </div>

      {/* Files List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Materialet e Ngarkuara ({files.length})</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {files.map((file) => {
            const fileConfig = fileIcons[file.type];
            return (
              <div key={file.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className={`w-12 h-12 rounded-xl ${fileConfig.color} flex items-center justify-center`}>
                  <fileConfig.icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 truncate">{file.name}</span>
                    {file.aiProcessed && (
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                        AI ✓
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span>{file.size}</span>
                    <span>•</span>
                    <span>{file.uploadedAt}</span>
                    {file.sharedWith.length > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-blue-600">Ndarë me {file.sharedWith.length} grupe</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowShareModal(file.id)}
                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-gray-400 hover:text-blue-600"
                    title="Ndaj"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600" title="Shiko">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600" title="Shkarko">
                    <Download className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(file.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-600"
                    title="Fshi"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Ndaj Materialin</h3>
              <button onClick={() => setShowShareModal(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {shareTargets.map((target, index) => {
                const file = files.find(f => f.id === showShareModal);
                const isShared = file?.sharedWith.includes(target);
                return (
                  <label
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                      isShared ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isShared}
                      onChange={() => {
                        setFiles(prev => prev.map(f => {
                          if (f.id === showShareModal) {
                            const newSharedWith = isShared
                              ? f.sharedWith.filter(t => t !== target)
                              : [...f.sharedWith, target];
                            return { ...f, sharedWith: newSharedWith };
                          }
                          return f;
                        }));
                      }}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">{target}</span>
                  </label>
                );
              })}
            </div>
            <button
              onClick={() => setShowShareModal(null)}
              className="w-full mt-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Ruaj Ndryshimet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
