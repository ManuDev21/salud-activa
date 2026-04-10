import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Pill, Plus, Trash2, Edit3, X, Clock, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  GET_MEDICAMENTOS_BY_USUARIO, CREATE_MEDICAMENTO, UPDATE_MEDICAMENTO, REMOVE_MEDICAMENTO,
} from '../graphql/queries';

const empty = { nombre: '', dosis: '', frecuencia: '', fecha_inicio: '', fecha_fin: '', notas: '' };

export default function MedicamentosPage() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const { data, loading, refetch } = useQuery(GET_MEDICAMENTOS_BY_USUARIO, {
    variables: { usuarioId: user?.id }, skip: !user?.id,
  });

  const [createMed] = useMutation(CREATE_MEDICAMENTO, { onCompleted: () => { refetch(); closeForm(); } });
  const [updateMed] = useMutation(UPDATE_MEDICAMENTO, { onCompleted: () => { refetch(); closeForm(); } });
  const [removeMed] = useMutation(REMOVE_MEDICAMENTO, { onCompleted: () => refetch() });

  const meds = data?.medicamentosByUsuario || [];

  const closeForm = () => { setShowForm(false); setEditing(null); setForm(empty); };
  const openNew = () => { setForm(empty); setEditing(null); setShowForm(true); };
  const openEdit = (m) => {
    setForm({
      nombre: m.nombre, dosis: m.dosis, frecuencia: m.frecuencia,
      fecha_inicio: m.fecha_inicio, fecha_fin: m.fecha_fin, notas: m.notas || '',
    });
    setEditing(m.id);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      updateMed({ variables: { input: { id: editing, ...form } } });
    } else {
      createMed({ variables: { input: { usuario_id: user.id, ...form } } });
    }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-sm input-glow';

  const isActive = (m) => {
    const now = new Date().toISOString().split('T')[0];
    return m.fecha_inicio <= now && m.fecha_fin >= now;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Pill className="w-7 h-7 text-accent-500" /> Medicamentos
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Control de tu tratamiento</p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Nuevo
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeForm}
          >
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} className="glass-card p-6 w-full max-w-lg"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold">{editing ? 'Editar' : 'Nuevo'} Medicamento</h2>
                <button onClick={closeForm} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input required value={form.nombre} onChange={set('nombre')} className={inputCls} placeholder="Nombre del medicamento" />
                <div className="grid grid-cols-2 gap-3">
                  <input required value={form.dosis} onChange={set('dosis')} className={inputCls} placeholder="Dosis (ej: 500mg)" />
                  <input required value={form.frecuencia} onChange={set('frecuencia')} className={inputCls} placeholder="Frecuencia (ej: cada 8h)" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Inicio</label>
                    <input type="date" required value={form.fecha_inicio} onChange={set('fecha_inicio')} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Fin</label>
                    <input type="date" required value={form.fecha_fin} onChange={set('fecha_fin')} className={inputCls} />
                  </div>
                </div>
                <textarea value={form.notas} onChange={set('notas')} className={inputCls} rows={2} placeholder="Notas (opcional)" />
                <button type="submit" className="w-full btn-primary py-2.5">
                  {editing ? 'Actualizar' : 'Crear'} Medicamento
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Cargando...</div>
      ) : meds.length === 0 ? (
        <div className="text-center py-16 glass-card">
          <Pill className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No hay medicamentos registrados</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {meds.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{m.nombre}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{m.dosis} · {m.frecuencia}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  isActive(m)
                    ? 'bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                }`}>
                  {isActive(m) ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <p className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {m.fecha_inicio} → {m.fecha_fin}</p>
              </div>
              {m.notas && <p className="text-xs text-gray-400 italic">{m.notas}</p>}
              <div className="flex gap-2 pt-1">
                <button onClick={() => openEdit(m)} className="flex-1 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center gap-1 transition-colors">
                  <Edit3 className="w-3.5 h-3.5" /> Editar
                </button>
                <button onClick={() => removeMed({ variables: { id: m.id } })} className="flex-1 py-1.5 text-xs font-medium rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 flex items-center justify-center gap-1 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" /> Eliminar
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
