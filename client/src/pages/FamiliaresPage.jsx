import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Trash2, X, UserPlus, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GET_FAMILIARES_BY_USUARIO, CREATE_FAMILIAR, REMOVE_FAMILIAR } from '../graphql/queries';

export default function FamiliaresPage() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ familiar_id: '', parentesco: '' });

  const { data, loading, refetch } = useQuery(GET_FAMILIARES_BY_USUARIO, {
    variables: { usuarioId: user?.id }, skip: !user?.id,
  });

  const [createFam] = useMutation(CREATE_FAMILIAR, { onCompleted: () => { refetch(); setShowForm(false); setForm({ familiar_id: '', parentesco: '' }); } });
  const [removeFam] = useMutation(REMOVE_FAMILIAR, { onCompleted: () => refetch() });

  const familiares = data?.familiaresByUsuario || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    createFam({ variables: { input: { usuario_id: user.id, familiar_id: parseInt(form.familiar_id), parentesco: form.parentesco } } });
  };

  const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-sm input-glow';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-7 h-7 text-purple-500" /> Familiares
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Contactos de apoyo familiar</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Agregar
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} className="glass-card p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold flex items-center gap-2"><UserPlus className="w-5 h-5" /> Agregar Familiar</h2>
                <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">ID del familiar (usuario registrado)</label>
                  <input type="number" required value={form.familiar_id}
                    onChange={(e) => setForm({ ...form, familiar_id: e.target.value })}
                    className={inputCls} placeholder="ID del usuario familiar" />
                </div>
                <input required value={form.parentesco}
                  onChange={(e) => setForm({ ...form, parentesco: e.target.value })}
                  className={inputCls} placeholder="Parentesco (ej: Madre, Padre, Hijo)" />
                <button type="submit" className="w-full btn-primary py-2.5">Agregar Familiar</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Cargando...</div>
      ) : familiares.length === 0 ? (
        <div className="text-center py-16 glass-card">
          <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No hay familiares registrados</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {familiares.map((f, i) => (
            <motion.div key={f.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-primary-500 flex items-center justify-center text-white font-bold">
                  {f.familiarUsuario?.nombre?.charAt(0)}{f.familiarUsuario?.apellido?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold">{f.familiarUsuario?.nombre} {f.familiarUsuario?.apellido}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{f.parentesco}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><Mail className="w-3 h-3" /> {f.familiarUsuario?.correo}</p>
                </div>
              </div>
              <button onClick={() => removeFam({ variables: { id: f.id } })} className="w-full mt-4 py-1.5 text-xs font-medium rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 flex items-center justify-center gap-1 transition-colors">
                <Trash2 className="w-3.5 h-3.5" /> Eliminar
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
