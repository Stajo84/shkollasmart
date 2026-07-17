import { useState } from 'react';
import { X, Sparkles, Loader2, Download, ImageIcon, Palette, Wand2 } from 'lucide-react';

interface Props { onClose: () => void }

const SAMPLE_IMAGES: Record<string, string> = {
  'qelize': 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><defs><radialGradient id="bg" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#d4edda"/><stop offset="100%" stop-color="#28a745"/></radialGradient></defs><rect width="512" height="512" fill="#f0f9f0" rx="32"/><circle cx="256" cy="256" r="180" fill="url(#bg)" stroke="#155724" stroke-width="4"/><ellipse cx="256" cy="240" rx="50" ry="45" fill="#6f42c1" opacity="0.7"/><text x="256" y="248" text-anchor="middle" fill="white" font-size="14" font-family="sans-serif">Bërthama</text><circle cx="180" cy="200" r="20" fill="#17a2b8" opacity="0.6"/><text x="180" y="204" text-anchor="middle" fill="white" font-size="9" font-family="sans-serif">Kloro.</text><circle cx="320" cy="300" r="18" fill="#ffc107" opacity="0.7"/><text x="320" y="304" text-anchor="middle" fill="#333" font-size="9" font-family="sans-serif">Mito.</text><circle cx="200" cy="320" r="16" fill="#dc3545" opacity="0.5"/><text x="200" y="324" text-anchor="middle" fill="white" font-size="8" font-family="sans-serif">Vak.</text><path d="M140 256 Q100 200 140 150" stroke="#155724" stroke-width="2" fill="none"/><path d="M370 256 Q410 200 370 150" stroke="#155724" stroke-width="2" fill="none"/><text x="256" y="460" text-anchor="middle" fill="#155724" font-size="16" font-family="sans-serif" font-weight="bold">Qeliza Bimore</text><text x="256" y="480" text-anchor="middle" fill="#666" font-size="11" font-family="sans-serif">SmartSchool AI</text></svg>`),
  'default': 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#667eea"/><stop offset="100%" stop-color="#764ba2"/></linearGradient></defs><rect width="512" height="512" fill="url(#bg)" rx="32"/><text x="256" y="220" text-anchor="middle" fill="white" font-size="64" font-family="sans-serif">🎨</text><text x="256" y="290" text-anchor="middle" fill="white" font-size="20" font-family="sans-serif" font-weight="bold">Imazh Edukativ</text><text x="256" y="320" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="14" font-family="sans-serif">Gjeneruar me SmartSchool AI</text><text x="256" y="420" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="11" font-family="sans-serif">Për integrim me API reale, shtoni çelësin DALL-E/Flux</text></svg>`),
};

const STYLES = [
  { id: 'realist', label: 'Realist', emoji: '📷' },
  { id: 'diagram', label: 'Diagramë', emoji: '📐' },
  { id: 'karikaturë', label: 'Karikaturë', emoji: '🎨' },
  { id: 'infografik', label: 'Infografik', emoji: '📊' },
];

export default function AIImageGenerator({ onClose }: Props) {
  const [step, setStep] = useState<'form' | 'gen' | 'preview'>('form');
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realist');
  const [imageUrl, setImageUrl] = useState('');
  const [progress, setProgress] = useState(0);
  const [msg, setMsg] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setStep('gen'); setProgress(0);
    for (const s of [
      { p: 10, m: 'Duke analizuar përshkrimin...' },
      { p: 30, m: 'Duke përgatitur modelin AI...' },
      { p: 55, m: 'Duke gjeneruar imazhin...' },
      { p: 80, m: 'Duke përpunuar detajet...' },
      { p: 95, m: 'Duke finalizuar...' },
    ]) { await new Promise(r => setTimeout(r, 600 + Math.random() * 500)); setProgress(s.p); setMsg(s.m); }

    // Use sample SVG image (in production, call DALL-E/Flux API)
    const key = prompt.toLowerCase().includes('qeliz') ? 'qelize' : 'default';
    setImageUrl(SAMPLE_IMAGES[key]);

    setProgress(100); setMsg('Imazhi u gjenerua!');
    await new Promise(r => setTimeout(r, 400)); setStep('preview');
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `SmartSchool_${prompt.slice(0, 30).replace(/\s+/g, '_')}.png`;
    link.href = imageUrl;
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center"><ImageIcon className="w-5 h-5 text-white" /></div>
            <div><h2 className="text-lg font-bold text-gray-900">Gjenero Imazh Edukativ</h2><p className="text-xs text-gray-500">Përshkruani dhe AI vizaton</p></div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {step === 'form' && (
            <div className="p-6 space-y-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"><Wand2 className="w-4 h-4 text-pink-500" /> Përshkruani Imazhin</label>
                <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none resize-none text-base"
                  rows={4} placeholder='p.sh. "Një qelizë bimore me organelet e etiketuara"\n"Harta e Perandorisë Osmane në shekullin XV"\n"Cikli i ujit me shigjeta dhe etiketa"'
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"><Palette className="w-4 h-4 text-pink-500" /> Stili</label>
                <div className="grid grid-cols-4 gap-2">
                  {STYLES.map(s => (
                    <button key={s.id} onClick={() => setStyle(s.id)}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${style === s.id ? 'border-pink-500 bg-pink-50' : 'border-gray-100 hover:border-gray-200'}`}>
                      <div className="text-2xl mb-1">{s.emoji}</div>
                      <div className="text-xs font-semibold text-gray-700">{s.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={handleGenerate} disabled={!prompt.trim()}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold rounded-xl shadow-xl disabled:opacity-40 flex items-center justify-center gap-3 text-lg hover:-translate-y-0.5 transition-all">
                <Sparkles className="w-6 h-6" /> Gjenero Imazhin
              </button>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-sm text-amber-800"><strong>💡 Këshill:</strong> Për rezultate më të mira, përshkruani me detaje: çfarë objektesh, çfarë ngjyrash, çfarë stili, dhe a dëshironi etiketa/tekst mbi imazh.</p>
              </div>
            </div>
          )}

          {step === 'gen' && (
            <div className="p-10 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-24 h-24 rounded-full bg-pink-100 flex items-center justify-center mb-8"><Loader2 className="w-12 h-12 text-pink-600 animate-spin" /></div>
              <div className="w-full max-w-sm mb-4"><div className="w-full bg-gray-100 rounded-full h-3"><div className="bg-gradient-to-r from-pink-500 to-orange-500 h-3 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} /></div></div>
              <p className="text-gray-600 font-medium">{msg}</p>
              <p className="text-xs text-gray-400 mt-2">{style} · {prompt.slice(0, 50)}...</p>
            </div>
          )}

          {step === 'preview' && (
            <div className="p-6">
              <div className="rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg bg-gray-50">
                <img src={imageUrl} alt={prompt} className="w-full h-auto" />
              </div>
              <p className="text-center text-sm text-gray-500 mt-3 italic">"{prompt}"</p>
            </div>
          )}
        </div>

        {step === 'preview' && (
          <div className="p-5 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-3 shrink-0">
            <button onClick={() => { setStep('form'); setImageUrl(''); }} className="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-white">← Gjenero Tjetër</button>
            <button onClick={handleDownload} className="flex-[2] py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold rounded-xl shadow-xl flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all">
              <Download className="w-5 h-5" /> Shkarko Imazhin (.png)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
