import { useState } from 'react';
import { Shirt, GraduationCap, ClipboardList, Send } from 'lucide-react';

interface MessageButtonsProps {
  selectedPhoneNumber: string | null;
  onSendMessage: (messageType: 'laundry' | 'class' | 'task') => Promise<void>;
}

export function MessageButtons({ selectedPhoneNumber, onSendMessage }: MessageButtonsProps) {
  const [sending, setSending] = useState<string | null>(null);

  const handleSend = async (messageType: 'laundry' | 'class' | 'task') => {
    if (!selectedPhoneNumber) return;

    setSending(messageType);
    try {
      await onSendMessage(messageType);
    } finally {
      setSending(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-2 text-gray-800">שלח הודעה</h2>
      {!selectedPhoneNumber && (
        <p className="text-sm text-gray-500 mb-4">בחר מספר טלפון לשליחת הודעה</p>
      )}
      {selectedPhoneNumber && (
        <p className="text-sm text-green-600 mb-4">מוכן לשלוח להודעה למספר שנבחר</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => handleSend('laundry')}
          disabled={!selectedPhoneNumber || sending !== null}
          className="flex flex-col items-center justify-center gap-3 p-6 bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <Shirt size={32} />
          <span className="font-semibold text-lg">כביסה</span>
          <span className="text-xs text-center opacity-90">
            {sending === 'laundry' ? 'שולח...' : '"הכביסה שלך מוכנה"'}
          </span>
        </button>

        <button
          onClick={() => handleSend('class')}
          disabled={!selectedPhoneNumber || sending !== null}
          className="flex flex-col items-center justify-center gap-3 p-6 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <GraduationCap size={32} />
          <span className="font-semibold text-lg">כיתה</span>
          <span className="text-xs text-center opacity-90">
            {sending === 'class' ? 'שולח...' : '"הכיתה ששריינת מוכנה"'}
          </span>
        </button>

        <button
          onClick={() => handleSend('task')}
          disabled={!selectedPhoneNumber || sending !== null}
          className="flex flex-col items-center justify-center gap-3 p-6 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <ClipboardList size={32} />
          <span className="font-semibold text-lg">מטלה</span>
          <span className="text-xs text-center opacity-90">
            {sending === 'task' ? 'שולח...' : '"יש לך מטלה חדשה"'}
          </span>
        </button>
      </div>
    </div>
  );
}
