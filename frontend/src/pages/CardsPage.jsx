import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, CreditCard } from 'lucide-react';
import { CardTable } from '../components/cards/CardTable';
import { CardFormModal } from '../components/cards/CardFormModal';
import { cardsService } from '../api/services';

export const CardsPage = () => {
  const location = useLocation();
  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [initialUid, setInitialUid] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.state?.prefillUid) {
      setInitialUid(location.state.prefillUid);
      setIsModalOpen(true);
    }
  }, [location.state]);

  const loadCards = async () => {
    try {
      setLoading(true);
      const res = await cardsService.getCards(search);
      setCards(res.data || []);
    } catch (err) {
      console.error('Failed to load card mappings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCards();
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingCard) {
        await cardsService.updateCard(editingCard._id, formData);
      } else {
        await cardsService.createCard(formData);
      }
      setIsModalOpen(false);
      setEditingCard(null);
      setInitialUid('');
      loadCards();
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to save card mapping.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this card mapping?')) {
      try {
        await cardsService.deleteCard(id);
        loadCards();
      } catch (err) {
        alert('Failed to delete card mapping.');
      }
    }
  };

  const handleEdit = (card) => {
    setEditingCard(card);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm">
              <CreditCard className="h-6 w-6" />
            </div>
            NFC UID Card Directory
          </h2>
          <p className="text-xs text-slate-500 font-semibold pt-1">
            Single source of truth mapping hardware NFC card UIDs to names (replaces device RAM list)
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCard(null);
            setInitialUid('');
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold px-4 py-3 text-xs shadow-lg shadow-indigo-500/20 transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          Add New Card Mapping
        </button>
      </div>

      {/* Card Table */}
      <CardTable
        cards={cards}
        search={search}
        setSearch={setSearch}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Form Modal */}
      <CardFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCard(null);
          setInitialUid('');
        }}
        onSubmit={handleCreateOrUpdate}
        editingCard={editingCard}
        initialUid={initialUid}
      />
    </div>
  );
};
