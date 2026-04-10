import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarClock, Plus, Trash2, Edit3, X, MapPin, Stethoscope,
  CheckCircle2, Clock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  GET_CITAS_BY_USUARIO, CREATE_CITA, UPDATE_CITA, REMOVE_CITA,
} from '../graphql/queries';

const empty = {
  medico: '', especialidad: '', lugar: '', fecha_hora: '', estado: 'PENDIENTE', notas: '',
};

export default function CitasPage() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const { data, loading, refetch } = useQuery(GET_CITAS_BY_USUARIO, {
    variables: { usuarioId: user?.id },
    skip: !user?.id,
  });

  const [createCita] = useMutation(CREATE_CITA, { onCompleted: () => { refetch(); closeForm(); } });
  const [updateCita] = useMutation(UPDATE_CITA, { onCompleted: () => { refetch(); closeForm(); } });
  const [removeCita] = useMutation(REMOVE_CITA, { onCompleted: () => refetch() });

  const citas = data?.citasByUsuario || [];

  const closeForm = () => { setShowForm(false); setEditing(null); setForm(empty); };
  const openNew = () => { setForm(empty); setEditing(null); setShowForm(true); };
  const openEdit = (c) => {
    setForm({
      medico: c.medico, especialidad: c.especialidad, lugar: c.lugar,
      fecha_hora: c.fecha_hora?.slice(0, 16), estado: c.estado?.toUpperCase() || 'PENDIENTE', notas: c.notas || '',
    });
    setEditing(c.id);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      updateCita({ variables: { input: { id: editing, ...form } } });
    } else {
      createCita({ variables: { input: { usuario_id: user.id, ...form } } });
    }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-sm input-glow';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CalendarClock className="w-7 h-7 text-primary-500" /> Citas Médicas
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gestiona tus citas médicas</p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Nueva Cita
        </button>
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeForm}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card p-6 w-full max-w-lg"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold">{editing ? 'Editar Cita' : 'Nueva Cita'}</h2>
                <button onClick={closeForm} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <input required value={form.medico} onChange={set('medico')} className={inputCls} placeholder="Médico" />
                  <input required value={form.especialidad} onChange={set('especialidad')} className={inputCls} placeholder="Especialidad" />
                </div>
                <input required value={form.lugar} onChange={set('lugar')} className={inputCls} placeholder="Lugar" />
                <input type="datetime-local" required value={form.fecha_hora} onChange={set('fecha_hora')} className={inputCls} />
                <select value={form.estado} onChange={set('estado')} className={inputCls}>
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="COMPLETADA">Completada</option>
                </select>
                <textarea value={form.notas} onChange={set('notas')} className={inputCls} rows={2} placeholder="Notas (opcional)" />
                <button type="submit" className="w-full btn-primary py-2.5">
                  {editing ? 'Actualizar' : 'Crear'} Cita
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Cargando...</div>
      ) : citas.length === 0 ? (
        <div className="text-center py-16 glass-card">
          <CalendarClock className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No hay citas registradas</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {citas.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-5 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{c.medico}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                    <Stethoscope className="w-3.5 h-3.5" /> {c.especialidad}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    (c.estado === 'completada' || c.estado === 'COMPLETADA')
                      ? 'bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300'
                      : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                  }`}
                >
                  {(c.estado === 'completada' || c.estado === 'COMPLETADA') ? (
                    <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Completada</span>
                  ) : (
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Pendiente</span>
                  )}
                </span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <p className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {c.lugar}</p>
                <p className="flex items-center gap-1">
                  <CalendarClock className="w-3.5 h-3.5" />
                  {new Date(c.fecha_hora).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
              {c.notas && <p className="text-xs text-gray-400 italic">{c.notas}</p>}
              <div className="flex gap-2 pt-1">
                <button onClick={() => openEdit(c)} className="flex-1 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center gap-1 transition-colors">
                  <Edit3 className="w-3.5 h-3.5" /> Editar
                </button>
                <button onClick={() => removeCita({ variables: { id: c.id } })} className="flex-1 py-1.5 text-xs font-medium rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 flex items-center justify-center gap-1 transition-colors">
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
