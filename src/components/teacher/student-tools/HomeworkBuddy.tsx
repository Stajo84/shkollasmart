import { useState } from 'react';
import { X, Loader2, Send, BookOpen, Lightbulb } from 'lucide-react';

interface Message {
  role: 'student' | 'ai';
  text: string;
}

function getAIResponse(question: string): string {
  const q = question.toLowerCase();
  
  if (q.includes('zgjidhje') || q.includes('rezultat') || q.includes('sa bën')) {
    return `🤔 Pyetje e mirë! Në vend që të të jap përgjigjen direkt, le të mendojmë së bashku:\n\n**Hapi 1:** Identifiko çfarë të dhënash ke në pyetje.\n**Hapi 2:** Çfarë formule ose rregulle njeh që lidhet me këtë temë?\n**Hapi 3:** Provo ta zbatosh formulën me të dhënat që ke.\n\n💡 **Këshillë:** Fillo duke shkruar çfarë di tashmë për këtë temë. Edhe nëse nuk je i/e sigurt, kjo ndihmon!\n\nNëse ngec në ndonjë hap, shkruaj saktësisht ku ke vështirësi dhe do të ndihmoj më tepër.`;
  }
  
  if (q.includes('çfarë') || q.includes('cfare') || q.includes('pse') || q.includes('si')) {
    return `📖 Kjo është një pyetje që kërkon kuptim!\n\n**Le ta zbërthejmë:**\n1. Së pari, mendo: çfarë fjalë kyçe sheh në pyetje?\n2. A ke lexuar mbi këtë temë në tekst? Cilin kapitull?\n3. Provo ta shpjegosh me fjalët e tua — edhe thjesht.\n\n💡 **Shembull i ngjashëm:** Imagjino sikur po ia shpjegon një shoku/shoqes — si do filloje?\n\n📝 **Detyrë:** Shkruaj 2-3 fjali me fjalët e tua dhe do t'i shohim së bashku.`;
  }

  return `👋 Mirë se erdhe! Pashë pyetjen tënde rreth: "${question.slice(0, 50)}..."\n\n**Ja si do punojmë:**\n1. 📝 Lexoje pyetjen edhe një herë me kujdes\n2. 🔍 Identifiko fjalët kyçe (termat e rëndësishëm)\n3. 📖 Kujto: a ke mësuar diçka të ngjashme në klasë?\n4. ✏️ Provo ta zgjidhësh vetë — edhe pak\n\n💡 **Këshillë:** Nuk ka përgjigje të gabuar kur po mëson! Çdo përpjekje të çon përpara.\n\nShkruaj çfarë ke provuar deri tani dhe do të ndihmoj me hapin e radhës! 💪`;
}

interface Props { onClose: () => void }

export default function HomeworkBuddy({ onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'student', text: userMsg }]);
    setInput('');
    setLoading(true);
    
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 1500));
    const response = getAIResponse(userMsg);
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center"><BookOpen className="w-5 h-5 text-white" /></div>
            <div><h2 className="text-lg font-bold text-gray-900">Asistenti i Detyrave 📚</h2><p className="text-xs text-gray-500">Nuk jap përgjigje — të ndihmoj të mësosh!</p></div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-sky-50/50 to-white">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-sky-100 flex items-center justify-center mx-auto mb-4 text-3xl">🎒</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Përshëndetje!</h3>
              <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">Shkruaj pyetjen ose detyrën tënde dhe do të ndihmoj me hapa, këshilla dhe shembuj — pa ta dhënë përgjigjen gati!</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Si ta zgjidh këtë problem?', 'Çfarë është fotosinteza?', 'Ndihmë me esenë'].map((q) => (
                  <button key={q} onClick={() => setInput(q)} className="px-3 py-2 bg-white border border-sky-200 rounded-xl text-xs font-medium text-sky-700 hover:bg-sky-50 transition-colors flex items-center gap-1">
                    <Lightbulb className="w-3 h-3" />{q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'student' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === 'student'
                  ? 'bg-sky-500 text-white rounded-br-md'
                  : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm'
              }`}>
                {msg.role === 'ai' && <div className="text-xs font-bold text-sky-600 mb-1">🤖 Asistenti</div>}
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2 text-sky-600"><Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm">Duke menduar...</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-100 bg-white shrink-0">
          <div className="flex gap-2">
            <input type="text" value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sky-500 outline-none text-sm"
              placeholder="Shkruaj pyetjen ose detyrën tënde..." />
            <button onClick={handleSend} disabled={!input.trim() || loading}
              className="px-4 py-3 bg-gradient-to-r from-sky-400 to-blue-500 text-white rounded-xl font-semibold disabled:opacity-40 flex items-center gap-2">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
