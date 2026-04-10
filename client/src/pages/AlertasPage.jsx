import { useQuery, useMutation } from '@apollo/client';
import { motion } from 'framer-motion';
import { Bell, AlertTriangle, CheckCircle2, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GET_ALERTAS_BY_USUARIO, MARCAR_ALERTA_LEIDA } from '../graphql/queries';

export default function AlertasPage() {
  const { user } = useAuth();

  const { data, loading, refetch } = useQuery(GET_ALERTAS_BY_USUARIO, {
    variables: { usuarioId: user?.id }, skip: !user?.id,
  });

  const [marcarLeida] = useMutation(MARCAR_ALERTA_LEIDA, { onCompleted: () => refetch() });

  const alertas = data?.alertasByUsuario || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="w-7 h-7 text-red-500" /> Alertas
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Notificaciones de incumplimiento y avisos</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Cargando...</div>
      ) : alertas.length === 0 ? (
        <div className="text-center py-16 glass-card">
          <CheckCircle2 className="w-12 h-12 text-accent-400 mx-auto mb-3" />
          <p className="text-gray-400">No hay alertas pendientes</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alertas.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass-card p-5 flex items-start gap-4 ${
                !a.leida ? 'border-l-4 border-l-red-500' : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                a.leida
                  ? 'bg-gray-100 dark:bg-gray-800'
                  : 'bg-red-100 dark:bg-red-900/30'
              }`}>
                <AlertTriangle className={`w-5 h-5 ${a.leida ? 'text-gray-400' : 'text-red-500'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold capitalize">{a.tipo?.replace('_', ' ')}</span>
                  {!a.leida && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white">Nueva</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{a.mensaje}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                  <span>{new Date(a.created_at).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  {a.familiarUsuario && (
                    <span>Familiar: {a.familiarUsuario.nombre} {a.familiarUsuario.apellido}</span>
                  )}
                </div>
              </div>
              {!a.leida && (
                <button
                  onClick={() => marcarLeida({ variables: { id: a.id } })}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors flex-shrink-0"
                >
                  <Eye className="w-3.5 h-3.5" /> Leída
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
