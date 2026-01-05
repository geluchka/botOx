import { useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { supabase, PhoneNumber } from './lib/supabase';
import { AddPhoneNumber } from './components/AddPhoneNumber';
import { PhoneNumberList } from './components/PhoneNumberList';
import { MessageButtons } from './components/MessageButtons';

function App() {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadPhoneNumbers();
  }, []);

  const loadPhoneNumbers = async () => {
    try {
      const { data, error } = await supabase
        .from('phone_numbers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPhoneNumbers(data || []);
    } catch (error) {
      console.error('Error loading phone numbers:', error);
      showNotification('Failed to load phone numbers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('phone_numbers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      if (selectedId === id) {
        setSelectedId(null);
      }

      await loadPhoneNumbers();
      showNotification('Phone number deleted', 'success');
    } catch (error) {
      console.error('Error deleting phone number:', error);
      showNotification('Failed to delete phone number', 'error');
    }
  };

  const handleSendMessage = async (messageType: 'laundry' | 'class' | 'task') => {
    if (!selectedId) return;

    const selectedContact = phoneNumbers.find(p => p.id === selectedId);
    if (!selectedContact) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-message`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: selectedContact.phone_number,
            messageType,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      showNotification('Message sent successfully!', 'success');
    } catch (error) {
      console.error('Error sending message:', error);
      showNotification('Failed to send message', 'error');
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <h1 className="text-4xl font-bold text-gray-800">BotOX</h1>
            <MessageSquare size={40} className="text-blue-600" />
          </div>
          <p className="text-gray-600">שליחת הודעות אוטומטיות</p>
        </div>

        {notification && (
          <div
            className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white font-medium animate-fade-in ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {notification.message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <AddPhoneNumber onAdd={loadPhoneNumbers} />
          <PhoneNumberList
            phoneNumbers={phoneNumbers}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onDelete={handleDelete}
          />
        </div>

        <MessageButtons
          selectedPhoneNumber={selectedId}
          onSendMessage={handleSendMessage}
        />

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-gray-800 mb-3">Webhook Configuration</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-700">Webhook URL:</span>
              <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-xs">
                {import.meta.env.VITE_SUPABASE_URL}/functions/v1/whatsapp-webhook
              </code>
            </div>
            <div>
              <span className="font-medium text-gray-700">Verify Token:</span>
              <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-xs">
                whatsapp_webhook_verify_token_123
              </code>
            </div>
            <p className="text-gray-600 mt-3">
              Configure this webhook URL in your Meta WhatsApp Business settings to enable the interactive menu bot.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
