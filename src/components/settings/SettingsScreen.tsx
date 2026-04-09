import { useState } from 'react';
import { ChevronLeft, ChevronRight, Pencil, Trash2, ChevronDown, ChevronUp, Plus, Check, X } from 'lucide-react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { RICH_BLACK, EMERALD, EMERALD_OUTER, glassStyle, smooth, noiseUrl } from '../../theme';
import { useLanguage } from '../../contexts/LanguageContext';
import { useLayout } from '../../contexts/LayoutContext';
import { useDbCategories, useDbSubcategories } from '../../hooks/useFinanceQueries';
import {
  addCategory, updateCategory, deleteCategory, deleteSubcategory,
} from '../../lib/db';
import Reveal from '../ui/Reveal';
import { useNavigate } from 'react-router-dom';

export default function SettingsScreen() {
  const { isRtl } = useLanguage();
  const { layoutMode, containerMaxWidth } = useLayout();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: categories = [] } = useDbCategories();
  const { data: subcategories = [] } = useDbSubcategories();

  const [expanded, setExpanded] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editNameHe, setEditNameHe] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);
  const [newName, setNewName] = useState('');
  const [newNameHe, setNewNameHe] = useState('');

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['db-categories'] });
    qc.invalidateQueries({ queryKey: ['db-subcategories'] });
  };

  const addCatMutation = useMutation({
    mutationFn: ({ name, name_he }: { name: string; name_he: string }) => addCategory(name, name_he),
    onSuccess: () => { invalidate(); setAddingCategory(false); setNewName(''); setNewNameHe(''); },
  });

  const updateCatMutation = useMutation({
    mutationFn: ({ id, name, name_he }: { id: string; name: string; name_he: string }) => updateCategory(id, name, name_he),
    onSuccess: () => { invalidate(); setEditingId(null); },
  });

  const deleteCatMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: invalidate,
  });

  const deleteSubMutation = useMutation({
    mutationFn: (id: string) => deleteSubcategory(id),
    onSuccess: invalidate,
  });

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10,
    color: '#e4e4e7',
    fontSize: 13,
    padding: '8px 12px',
    outline: 'none',
    fontFamily: 'inherit',
  };

  const btnStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 6,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#52525b',
    ...smooth,
  };

  return (
    <div style={{
      minHeight: '100vh', background: RICH_BLACK, color: '#a1a1aa',
      fontFamily: "'Aeonik', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      overflowX: 'hidden', position: 'relative',
    }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 50, pointerEvents: 'none', backgroundImage: noiseUrl }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: '-5%', left: '10%', width: '40%', height: '30%', borderRadius: '50%', background: `radial-gradient(ellipse, ${EMERALD_OUTER}, transparent 70%)`, filter: 'blur(80px)', opacity: 0.3 }} />
      </div>

      <main style={{
        maxWidth: containerMaxWidth, margin: '0 auto',
        padding: layoutMode === 'web' ? '56px 48px 140px' : '56px 24px 140px',
        position: 'relative', zIndex: 10,
      }}>
        <Reveal delay={0}>
          <header style={{
            display: 'flex', alignItems: 'center', gap: 16, marginBottom: 48,
            flexDirection: isRtl ? 'row-reverse' : 'row',
          }}>
            <button
              onClick={() => navigate('/')}
              style={{
                width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.025)',
                cursor: 'pointer', color: '#71717a', ...smooth,
              }}
            >
              {isRtl ? <ChevronRight size={16} strokeWidth={1.5} /> : <ChevronLeft size={16} strokeWidth={1.5} />}
            </button>
            <p style={{ fontSize: 11, color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: 600 }}>
              SETTINGS
            </p>
          </header>
        </Reveal>

        <Reveal delay={80}>
          <section>
            <p style={{ fontSize: 11, color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.25em', fontWeight: 600, marginBottom: 16, padding: '0 4px' }}>
              Category Manager
            </p>
            <div style={{ ...glassStyle, borderRadius: 24, padding: '8px' }}>
              {categories.map((cat) => {
                const isExpanded = expanded === cat.id;
                const isEditing = editingId === cat.id;
                const catSubs = subcategories.filter(s => s.category_id === cat.id);
                return (
                  <div key={cat.id}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px',
                      borderRadius: 16, flexDirection: isRtl ? 'row-reverse' : 'row',
                    }}>
                      <button
                        onClick={() => setExpanded(isExpanded ? null : cat.id)}
                        style={{ ...btnStyle, flex: 1, justifyContent: isRtl ? 'flex-end' : 'flex-start', gap: 10, flexDirection: isRtl ? 'row-reverse' : 'row' }}
                      >
                        {isExpanded ? <ChevronUp size={14} strokeWidth={1.5} /> : <ChevronDown size={14} strokeWidth={1.5} />}
                        {isEditing ? (
                          <div style={{ display: 'flex', gap: 8, flex: 1, flexDirection: isRtl ? 'row-reverse' : 'row' }} onClick={e => e.stopPropagation()}>
                            <input
                              style={{ ...inputStyle, flex: 1 }}
                              value={editName}
                              onChange={e => setEditName(e.target.value)}
                              placeholder="Name (EN)"
                            />
                            <input
                              style={{ ...inputStyle, flex: 1 }}
                              value={editNameHe}
                              onChange={e => setEditNameHe(e.target.value)}
                              placeholder="Name (HE)"
                            />
                          </div>
                        ) : (
                          <span style={{ fontSize: 14, color: '#e4e4e7', fontWeight: 500 }}>{cat.name}</span>
                        )}
                      </button>
                      {isEditing ? (
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button
                            style={{ ...btnStyle, color: EMERALD }}
                            onClick={() => updateCatMutation.mutate({ id: cat.id, name: editName, name_he: editNameHe })}
                          >
                            <Check size={14} strokeWidth={2} />
                          </button>
                          <button style={{ ...btnStyle }} onClick={() => setEditingId(null)}>
                            <X size={14} strokeWidth={1.5} />
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button
                            style={btnStyle}
                            onClick={() => { setEditingId(cat.id); setEditName(cat.name); setEditNameHe(cat.name_he ?? ''); }}
                          >
                            <Pencil size={13} strokeWidth={1.5} />
                          </button>
                          <button
                            style={{ ...btnStyle, color: '#fb7185' }}
                            onClick={() => deleteCatMutation.mutate(cat.id)}
                          >
                            <Trash2 size={13} strokeWidth={1.5} />
                          </button>
                        </div>
                      )}
                    </div>
                    {isExpanded && (
                      <div style={{ paddingLeft: isRtl ? 0 : 48, paddingRight: isRtl ? 48 : 0, paddingBottom: 8 }}>
                        {catSubs.length === 0 && (
                          <p style={{ fontSize: 12, color: '#3f3f46', padding: '6px 16px', fontStyle: 'italic' }}>No subcategories</p>
                        )}
                        {catSubs.map(sub => (
                          <div key={sub.id} style={{
                            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
                            borderRadius: 12, flexDirection: isRtl ? 'row-reverse' : 'row',
                          }}>
                            <span style={{ flex: 1, fontSize: 13, color: '#a1a1aa', textAlign: isRtl ? 'right' : 'left' }}>{sub.name}</span>
                            {sub.is_recurring && (
                              <span style={{
                                fontSize: 9, fontWeight: 600, letterSpacing: '0.1em',
                                color: EMERALD, border: `1px solid ${EMERALD}`,
                                borderRadius: 6, padding: '2px 6px', textTransform: 'uppercase',
                              }}>⟳</span>
                            )}
                            <button
                              style={{ ...btnStyle, color: '#fb7185' }}
                              onClick={() => deleteSubMutation.mutate(sub.id)}
                            >
                              <Trash2 size={12} strokeWidth={1.5} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{ height: 1, margin: '0 16px', background: 'rgba(255,255,255,0.03)' }} />
                  </div>
                );
              })}

              {addingCategory ? (
                <div style={{ padding: '14px 16px', display: 'flex', gap: 8, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                  <input
                    style={{ ...inputStyle, flex: 1 }}
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="Name (EN)"
                    autoFocus
                  />
                  <input
                    style={{ ...inputStyle, flex: 1 }}
                    value={newNameHe}
                    onChange={e => setNewNameHe(e.target.value)}
                    placeholder="Name (HE)"
                  />
                  <button
                    style={{ ...btnStyle, color: EMERALD }}
                    onClick={() => addCatMutation.mutate({ name: newName, name_he: newNameHe })}
                  >
                    <Check size={15} strokeWidth={2} />
                  </button>
                  <button style={btnStyle} onClick={() => { setAddingCategory(false); setNewName(''); setNewNameHe(''); }}>
                    <X size={15} strokeWidth={1.5} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAddingCategory(true)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '14px 16px', borderRadius: 16, background: 'none', border: 'none',
                    cursor: 'pointer', color: '#52525b', flexDirection: isRtl ? 'row-reverse' : 'row',
                    ...smooth,
                  }}
                >
                  <Plus size={14} strokeWidth={1.5} />
                  <span style={{ fontSize: 13, fontWeight: 500 }}>+ Add Category</span>
                </button>
              )}
            </div>
          </section>
        </Reveal>
      </main>
    </div>
  );
}
