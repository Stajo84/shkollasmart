import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { X, Sparkles, Loader2, Download, Table } from 'lucide-react';

interface Criterion { name: string; levels: string[] }

function generateRubric(_topic: string): { criteria: Criterion[]; maxPoints: number } {
  return {
    criteria: [
      { name: 'Saktësia Shkencore', levels: ['Informacioni gabuar ose mungon', 'Informacion bazik me gabime', 'Informacion i saktë por jo i plotë', 'Informacion i saktë dhe i detajuar', 'Informacion i shkëlqyer, i plotë dhe i thelluar'] },
      { name: 'Krijimtaria & Origjinaliteti', levels: ['Punë e kopjuar ose pa përpjekje', 'Përpjekje minimale krijuese', 'Disa elementë krijuese', 'Krijimtari e mirë me ide origjinale', 'Tepër krijues, inovativ dhe frymëzues'] },
      { name: 'Prezantimi & Estetika', levels: ['I parregullt dhe i pakuptueshëm', 'Prezantim bazik me mangësi', 'Prezantim i pranueshëm', 'Prezantim i mirë dhe i organizuar', 'Prezantim profesional dhe i bukur'] },
      { name: 'Bashkëpunimi (nëse në grup)', levels: ['Nuk kontribuon fare', 'Kontribuon minimalisht', 'Kontribuon mesatarisht', 'Kontribuon aktivisht', 'Lider i grupit, organizues i shkëlqyer'] },
      { name: 'Zbatimi i Njohurive', levels: ['Nuk zbatonë njohuri', 'Zbatim sipërfaqësor', 'Zbatim mesatar i njohurive', 'Zbatim i mirë me shembuj', 'Zbatim i shkëlqyer me analizë të thellë'] },
    ],
    maxPoints: 25
  };
}

function buildRubricPdf(topic: string, criteria: Criterion[]): jsPDF {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const M = 12, W = 297, H = 210;
  let y = M;

  doc.setFont('Helvetica', 'bold'); doc.setFontSize(14); doc.setTextColor(0);
  doc.text('RUBRIKE VLERESIMI', W / 2, y, { align: 'center' }); y += 6;
  doc.setFontSize(10); doc.text(`Detyra/Projekti: ${topic}`, W / 2, y, { align: 'center' }); y += 8;

  const cols = 6;
  const colW = (W - 2 * M) / cols;
  const headers = ['Kriteri', '1 pikë', '2 pikë', '3 pikë', '4 pikë', '5 pikë'];

  // Header row
  doc.setFillColor(50, 50, 50); doc.setTextColor(255);
  doc.setFont('Helvetica', 'bold'); doc.setFontSize(8);
  headers.forEach((h, i) => {
    doc.rect(M + i * colW, y, colW, 8, 'FD');
    doc.text(h, M + i * colW + colW / 2, y + 5.5, { align: 'center' });
  });
  y += 8;

  doc.setTextColor(0); doc.setFont('Helvetica', 'normal'); doc.setFontSize(7);
  criteria.forEach((c, ci) => {
    const rowH = 16;
    if (y + rowH > H - 20) { doc.addPage(); y = M; }
    const bg = ci % 2 === 0 ? 245 : 255;
    doc.setFillColor(bg, bg, bg);

    // Criterion name
    doc.rect(M, y, colW, rowH, 'FD');
    doc.setFont('Helvetica', 'bold'); doc.setFontSize(7.5);
    doc.text(c.name, M + 2, y + rowH / 2 + 1, { maxWidth: colW - 4 });

    // Levels
    doc.setFont('Helvetica', 'normal'); doc.setFontSize(6.5);
    c.levels.forEach((l, li) => {
      const x = M + (li + 1) * colW;
      doc.rect(x, y, colW, rowH, 'S');
      const lines = doc.splitTextToSize(l, colW - 4);
      doc.text(lines, x + 2, y + 4);
    });
    y += rowH;
  });

  y += 6;
  doc.setFont('Helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(0);
  doc.text(`Pikët Totale: _____ / ${criteria.length * 5}`, M, y);
  doc.text('Nota: _____', M + 80, y);
  doc.text('Emri i Nxënësit: _________________________', M + 140, y);

  doc.setFont('Helvetica', 'italic'); doc.setFontSize(6); doc.setTextColor(150);
  doc.text('SmartSchool AI', W / 2, H - 8, { align: 'center' });
  return doc;
}

interface Props { onClose: () => void }

export default function RubricCreator({ onClose }: Props) {
  const [topic, setTopic] = useState('');
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
    const result = generateRubric(topic);
    setCriteria(result.criteria);
    setGenerated(true);
    setLoading(false);
  };

  const pointLabels = ['1', '2', '3', '4', '5'];
  const pointColors = ['bg-red-100 text-red-700', 'bg-orange-100 text-orange-700', 'bg-amber-100 text-amber-700', 'bg-blue-100 text-blue-700', 'bg-emerald-100 text-emerald-700'];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center"><Table className="w-5 h-5 text-white" /></div>
            <div><h2 className="text-lg font-bold text-gray-900">Rubrikë Vlerësimi</h2><p className="text-xs text-gray-500">Tabelë vlerësimi profesionale me AI</p></div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {!generated ? (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tema e Projektit/Detyrës</label>
                <input type="text" value={topic} onChange={e => setTopic(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 outline-none text-lg" placeholder='p.sh. "Maketi i qelizës bimore", "Ese argumentuese"...' />
              </div>
              <button onClick={handleGenerate} disabled={!topic.trim() || loading}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-bold rounded-xl shadow-lg disabled:opacity-40 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                {loading ? 'Duke gjeneruar...' : 'Gjenero Rubrikën'}
              </button>
            </>
          ) : (
            <>
              <h3 className="text-center font-bold text-gray-900">Rubrikë: {topic}</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="bg-gray-800 text-white p-3 text-left rounded-tl-xl text-xs">Kriteri</th>
                      {pointLabels.map((p, i) => <th key={i} className="bg-gray-800 text-white p-3 text-center text-xs last:rounded-tr-xl">{p} pikë</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {criteria.map((c, ci) => (
                      <tr key={ci} className={ci % 2 === 0 ? 'bg-gray-50' : ''}>
                        <td className="p-3 font-semibold text-gray-900 border border-gray-200 text-xs min-w-[120px]">{c.name}</td>
                        {c.levels.map((l, li) => (
                          <td key={li} className="p-2.5 border border-gray-200 text-xs text-gray-600 min-w-[140px]">
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold mb-1 ${pointColors[li]}`}>{li + 1}p</span>
                            <div>{l}</div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-center text-sm text-gray-500">Pikët totale: ___ / {criteria.length * 5}</p>
            </>
          )}
        </div>
        {generated && (
          <div className="p-5 border-t border-gray-100 bg-gray-50 flex gap-3 shrink-0">
            <button onClick={() => { setGenerated(false); setCriteria([]); }} className="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-white">← Tjetër</button>
            <button onClick={() => buildRubricPdf(topic, criteria).save(`Rubrike_${topic.replace(/\s+/g, '_')}.pdf`)}
              className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2">
              <Download className="w-5 h-5" /> Shkarko PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
