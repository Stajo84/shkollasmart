import { useState, useRef } from 'react';
import { X, Sparkles, Loader2, RotateCcw, Printer, FileUp, File, Check, Layers } from 'lucide-react';

interface Card { front: string; back: string }

function generateCards(text: string): Card[] {
  const sentences = text.split(/[.!?\n]+/).map(s => s.trim()).filter(s => s.length > 10);
  const cards: Card[] = [];
  const templates = [
    (s: string) => ({ front: `Çfarë është "${s.split(' ').slice(0, 4).join(' ')}"?`, back: s }),
    (s: string) => ({ front: `Shpjegoni: ${s.slice(0, 40)}...`, back: s }),
    (s: string) => ({ front: `Plotëso: ${s.slice(0, 30)}____`, back: s }),
  ];
  sentences.slice(0, 12).forEach((s, i) => {
    cards.push(templates[i % templates.length](s));
  });
  if (cards.length === 0) {
    cards.push({ front: 'Koncepti Kryesor', back: text.slice(0, 150) || 'Përgjigja' });
  }
  return cards;
}

interface Props { onClose: () => void }

export default function FlashcardGenerator({ onClose }: Props) {
  const [text, setText] = useState('');
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [currentIdx, setCurrentIdx] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');

  const handleFile = async (file: globalThis.File) => {
    setFileName(file.name);
    try {
      if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        setText(await file.text());
      } else if (file.name.endsWith('.pdf')) {
        const raw = new TextDecoder('utf-8', { fatal: false }).decode(new Uint8Array(await file.arrayBuffer()));
        const m = raw.match(/\(([^)]{3,})\)/g);
        setText(m ? m.map(x => x.slice(1, -1)).filter(t => /[a-zA-ZÀ-ÿ]/.test(t)).join(' ').slice(0, 5000) : '[PDF]');
      }
    } catch { setText('[Gabim]'); }
  };

  const handleGenerate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
    setCards(generateCards(text));
    setFlippedCards(new Set());
    setCurrentIdx(0);
    setLoading(false);
  };

  const toggleFlip = (idx: number) => {
    setFlippedCards(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  const handlePrint = () => window.print();

  const cardColors = [
    'from-violet-500 to-purple-600', 'from-blue-500 to-indigo-600', 'from-emerald-500 to-teal-600',
    'from-orange-500 to-amber-600', 'from-pink-500 to-rose-600', 'from-cyan-500 to-blue-600',
  ];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center"><Layers className="w-5 h-5 text-white" /></div>
            <div><h2 className="text-lg font-bold text-gray-900">Flashcards me AI</h2><p className="text-xs text-gray-500">Karta mësimore dypalëshe</p></div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {cards.length === 0 ? (
            <>
              <textarea value={text} onChange={e => setText(e.target.value)} rows={5}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 outline-none resize-none text-sm"
                placeholder="Ngjisni tekstin e leksionit ose ngarkoni dokument..." />
              <div className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all ${fileName ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-amber-300'}`} onClick={() => fileRef.current?.click()}>
                <input ref={fileRef} type="file" className="hidden" accept=".pdf,.txt" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }} />
                {fileName ? <div className="flex items-center justify-center gap-2"><File className="w-4 h-4 text-green-600" /><span className="text-sm">{fileName}</span><Check className="w-4 h-4 text-green-500" /></div>
                : <div className="flex items-center justify-center gap-2 text-gray-500"><FileUp className="w-4 h-4" /><span className="text-sm">Ngarko PDF/TXT</span></div>}
              </div>
              <button onClick={handleGenerate} disabled={!text.trim() || loading}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl shadow-lg disabled:opacity-40 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                {loading ? 'Duke gjeneruar...' : 'Gjenero Flashcards'}
              </button>
            </>
          ) : (
            <>
              {/* Current card — large flip view */}
              <div className="flex justify-center mb-2">
                <div onClick={() => toggleFlip(currentIdx)} className="cursor-pointer w-full max-w-md perspective-1000">
                  <div className={`relative h-56 rounded-2xl shadow-xl transition-all duration-500 transform-style-3d ${flippedCards.has(currentIdx) ? 'rotate-y-180' : ''}`}
                    style={{ transformStyle: 'preserve-3d', transform: flippedCards.has(currentIdx) ? 'rotateY(180deg)' : '' }}>
                    {/* Front */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${cardColors[currentIdx % cardColors.length]} p-6 flex flex-col items-center justify-center text-center backface-hidden`}
                      style={{ backfaceVisibility: 'hidden' }}>
                      <div className="text-white/50 text-xs font-bold mb-3">PYETJE — Karta {currentIdx + 1}/{cards.length}</div>
                      <p className="text-white text-lg font-bold leading-relaxed">{cards[currentIdx].front}</p>
                      <div className="mt-4 text-white/40 text-xs flex items-center gap-1"><RotateCcw className="w-3 h-3" /> Kliko për përgjigjen</div>
                    </div>
                    {/* Back */}
                    <div className="absolute inset-0 rounded-2xl bg-white border-2 border-gray-200 p-6 flex flex-col items-center justify-center text-center"
                      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                      <div className="text-gray-400 text-xs font-bold mb-3">PËRGJIGJE</div>
                      <p className="text-gray-800 text-sm leading-relaxed">{cards[currentIdx].back}</p>
                      <div className="mt-4 text-gray-300 text-xs flex items-center gap-1"><RotateCcw className="w-3 h-3" /> Kliko për pyetjen</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Navigation */}
              <div className="flex items-center justify-center gap-3">
                <button onClick={() => { setCurrentIdx(Math.max(0, currentIdx - 1)); setFlippedCards(new Set()); }} disabled={currentIdx === 0}
                  className="px-4 py-2 bg-gray-100 rounded-xl font-medium disabled:opacity-30">← Para</button>
                <span className="text-sm text-gray-500">{currentIdx + 1} / {cards.length}</span>
                <button onClick={() => { setCurrentIdx(Math.min(cards.length - 1, currentIdx + 1)); setFlippedCards(new Set()); }} disabled={currentIdx === cards.length - 1}
                  className="px-4 py-2 bg-amber-100 text-amber-700 rounded-xl font-medium disabled:opacity-30">Tjetra →</button>
              </div>
              {/* Mini grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {cards.map((c, i) => (
                  <button key={i} onClick={() => { setCurrentIdx(i); setFlippedCards(new Set()); }}
                    className={`p-3 rounded-xl border-2 text-left text-xs transition-all ${i === currentIdx ? 'border-amber-500 bg-amber-50' : 'border-gray-100 hover:border-gray-200'}`}>
                    <div className="font-bold text-gray-700 truncate">{i + 1}. {c.front.slice(0, 25)}</div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        {cards.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-gray-50 flex gap-3 shrink-0">
            <button onClick={() => { setCards([]); setFlippedCards(new Set()); }} className="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-white">← Tjetër</button>
            <button onClick={handlePrint} className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2">
              <Printer className="w-5 h-5" /> Printo Kartat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
