import { Trash2, User, Phone } from 'lucide-react';
import { PhoneNumber } from '../lib/supabase';

interface PhoneNumberListProps {
  phoneNumbers: PhoneNumber[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PhoneNumberList({ phoneNumbers, selectedId, onSelect, onDelete }: PhoneNumberListProps) {
  if (phoneNumbers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
        <Phone size={48} className="mx-auto mb-3 text-gray-400" />
        <p>אין מספרי טלפון שמורים</p>
        <p className="text-sm mt-1">הוסף מספר טלפון</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">מספרי טלפון</h2>
      <div className="space-y-2">
        {phoneNumbers.map((contact) => (
          <div
            key={contact.id}
            onClick={() => onSelect(contact.id)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedId === contact.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {contact.name ? (
                    <>
                      <User size={16} className="text-gray-600" />
                      <span className="font-medium text-gray-800">{contact.name}</span>
                    </>
                  ) : (
                    <>
                      <Phone size={16} className="text-gray-600" />
                      <span className="font-medium text-gray-800">איש קשר</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-600">{contact.phone_number}</p>
                
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(contact.id);
                }}
                className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                aria-label="Delete contact"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
