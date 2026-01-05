import { useState } from 'react';
import { Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AddPhoneNumberProps {
  onAdd: () => void;
}

export function AddPhoneNumber({ onAdd }: AddPhoneNumberProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsAdding(true);

    try {
      const { error: insertError } = await supabase
        .from('phone_numbers')
        .insert({ phone_number: phoneNumber, name: name || '' });

      if (insertError) {
        if (insertError.code === '23505') {
          setError('מספר הטלפון כבר קיים במערכת');
        } else {
          setError('הוספת מספר טלפון נכשלה');
        }
        return;
      }

      setPhoneNumber('');
      setName('');
      onAdd();
    } catch (err) {
      setError('אירעה שגיאה');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">הוסף מספר טלפון</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            מספר טלפון
          </label>
          <input
            id="phone"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+1234567890"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">יש לכלול קידומת (+972)</p>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            שם
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ישראל ישראלי"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={isAdding || !phoneNumber}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
        >
          <Plus size={20} />
          {isAdding ? 'מוסיף' : 'הוסף מספר טלפון'}
        </button>
      </div>
    </form>
  );
}
