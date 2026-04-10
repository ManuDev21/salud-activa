import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Syringe, Plus, Trash2, X, Calendar, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GET_VACUNAS_BY_USUARIO, CREATE_VACUNA, REMOVE_VACUNA } from '../graphql/queries';

const empty = { nombre: '', dosis_aplicada: '', fecha_aplicacion: '', proxima_dosis_fecha: '', notas: '' };

export default function VacunasPage() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);

  const { data, loading, refetch } = useQuery(GET_VACUNAS_BY_USUARIO, {
    variables: { usuarioId: user?.id }, skip: !user?.id,
  });

  const [createVac] = useMutation(CREATE_VACUNA, { onCompleted: () => { refetch(); setShowForm(false); setForm(empty); } });
  const [removeVac] = useMutation(REMOVE_VACUNA, { onCompleted: () => refetch() });

  const vacunas = data?.vacunasByUsuario || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    const input = { usuario_id: user.id, ...form };
    if (!input.proxima_dosis_fecha) delete input.proxima_dosis_fecha;
    if (!input.notas) delete input.notas;
    createVac({ variables: { input } });
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-sm input-glow';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Syringe className="w-7 h-7 text-amber-500" /> Vacunas
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Esquema de vacunación</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Registrar
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} className="glass-card p-6 w-full max-w-lg"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold">Registrar Vacuna</h2>
                <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input required value={form.nombre} onChange={set('nombre')} className={inputCls} placeholder="Nombre de la vacuna" />
                <input required value={form.dosis_aplicada} onChange={set('dosis_aplicada')} className={inputCls} placeholder="Dosis aplicada (ej: 1ra dosis)" />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Fecha aplicación</label>
                    <input type="date" required value={form.fecha_aplicacion} onChange={set('fecha_aplicacion')} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Próxima dosis</label>
                    <input type="date" value={form.proxima_dosis_fecha} onChange={set('proxima_dosis_fecha')} className={inputCls} />
                  </div>
                </div>
                <textarea value={form.notas} onChange={set('notas')} className={inputCls} rows={2} placeholder="Notas (opcional)" />
                <button type="submit" className="w-full btn-primary py-2.5">Registrar Vacuna</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Cargando...</div>
      ) : vacunas.length === 0 ? (
        <div className="text-center py-16 glass-card">
          <Syringe className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No hay vacunas registradas</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vacunas.map((v, i) => (
            <motion.div key={v.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-accent-500" /> {v.nombre}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{v.dosis_aplicada}</p>
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <p className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Aplicada: {v.fecha_aplicacion}</p>
                {v.proxima_dosis_fecha && (
                  <p className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Próxima: {v.proxima_dosis_fecha}</p>
                )}
              </div>
              {v.notas && <p className="text-xs text-gray-400 italic">{v.notas}</p>}
              <button onClick={() => removeVac({ variables: { id: v.id } })} className="w-full py-1.5 text-xs font-medium rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 flex items-center justify-center gap-1 transition-colors">
                <Trash2 className="w-3.5 h-3.5" /> Eliminar
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
