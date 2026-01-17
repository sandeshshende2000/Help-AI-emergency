
import React from 'react';
import { Plus, User, Trash2, ShieldAlert, Users } from 'lucide-react';
import { Contact, ContactType } from '../types';

interface ContactsScreenProps {
  contacts: Contact[];
  onUpdate: (contacts: Contact[]) => void;
}

const ContactsScreen: React.FC<ContactsScreenProps> = ({ contacts, onUpdate }) => {
  const sosContact = contacts.find(c => c.type === ContactType.SOS);
  const normalContacts = contacts.filter(c => c.type === ContactType.NORMAL);

  const handleAdd = (type: ContactType) => {
    if (type === ContactType.NORMAL && normalContacts.length >= 3) {
      alert("Maximum 3 normal contacts allowed.");
      return;
    }
    const name = prompt("Contact Name:");
    const phone = prompt("Phone Number:");
    if (name && phone) {
      const newC = { id: Math.random().toString(36).substr(2, 9), name, phone, type };
      onUpdate([...contacts, newC]);
    }
  };

  const removeContact = (id: string) => onUpdate(contacts.filter(c => c.id !== id));

  return (
    <div className="p-8 pb-32 min-h-full bg-[#F7F9FC]">
      <header className="mb-10 pt-4">
        <h2 className="text-3xl font-black tracking-tight text-[#1F2937]">Safety Circle</h2>
        <p className="text-[#6B7280] text-sm font-medium mt-1">Trusted people to receive your alerts.</p>
      </header>

      <div className="space-y-10">
        {/* SOS Contact Section */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#FEE2E2] flex items-center justify-center text-[#EF4444]">
              <ShieldAlert size={16} />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#374151]">SOS Primary</h3>
          </div>
          
          {sosContact ? (
            <ContactCard contact={sosContact} onRemove={removeContact} accent="#EF4444" />
          ) : (
            <AddButton label="SOS Contact" onClick={() => handleAdd(ContactType.SOS)} variant="red" />
          )}
        </section>

        {/* Normal Contacts Section */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#D1FAE5] flex items-center justify-center text-[#10B981]">
              <Users size={16} />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#374151]">Safety Circle</h3>
          </div>
          
          <div className="space-y-4">
            {normalContacts.map(c => (
              <ContactCard key={c.id} contact={c} onRemove={removeContact} accent="#22C55E" />
            ))}
            {normalContacts.length < 3 && (
              <AddButton label="Circle Member" onClick={() => handleAdd(ContactType.NORMAL)} variant="green" />
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

const ContactCard = ({ contact, onRemove, accent }: any) => {
  return (
    <div className="bg-white rounded-[2rem] p-6 flex items-center justify-between border border-[#E5E7EB] shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white`} style={{ backgroundColor: accent }}>
          <User size={24} />
        </div>
        <div>
          <p className="font-extrabold text-[#1F2937] text-base">{contact.name}</p>
          <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">{contact.phone}</p>
        </div>
      </div>
      <button 
        onClick={() => onRemove(contact.id)} 
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#F9FAFB] text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 transition-all border border-[#F3F4F6]"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

const AddButton = ({ label, onClick, variant }: any) => {
  const isRed = variant === 'red';
  return (
    <button 
      onClick={onClick}
      className={`w-full bg-white border-2 border-dashed rounded-[2rem] p-8 flex flex-col items-center gap-2 transition-all active:scale-[0.98] ${isRed ? 'border-red-100 text-red-400 hover:border-red-200' : 'border-[#E5E7EB] text-[#6B7280] hover:border-[#D1FAE5]'}`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isRed ? 'bg-red-50' : 'bg-[#F9FAFB]'}`}>
        <Plus size={20} />
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Add {label}</span>
    </button>
  );
};

export default ContactsScreen;
