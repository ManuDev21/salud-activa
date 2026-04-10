import { useQuery } from '@apollo/client';
import { motion } from 'framer-motion';
import {
  CalendarClock, Pill, Syringe, Bell,
  TrendingUp, CheckCircle2, AlertTriangle, Clock,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import {
  GET_CITAS_BY_USUARIO,
  GET_MEDICAMENTOS_BY_USUARIO,
  GET_VACUNAS_BY_USUARIO,
  GET_RECORDATORIOS_BY_USUARIO,
  GET_ALERTAS_BY_USUARIO,
} from '../graphql/queries';

const COLORS = ['#1b6df5', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

const card = (i) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.1 },
});

export default function DashboardPage() {
  const { user } = useAuth();
  const uid = user?.id;

  const { data: citasData } = useQuery(GET_CITAS_BY_USUARIO, { variables: { usuarioId: uid }, skip: !uid });
  const { data: medsData } = useQuery(GET_MEDICAMENTOS_BY_USUARIO, { variables: { usuarioId: uid }, skip: !uid });
  const { data: vacData } = useQuery(GET_VACUNAS_BY_USUARIO, { variables: { usuarioId: uid }, skip: !uid });
  const { data: recData } = useQuery(GET_RECORDATORIOS_BY_USUARIO, { variables: { usuarioId: uid }, skip: !uid });
  const { data: alertData } = useQuery(GET_ALERTAS_BY_USUARIO, { variables: { usuarioId: uid }, skip: !uid });

  const citas = citasData?.citasByUsuario || [];
  const meds = medsData?.medicamentosByUsuario || [];
  const vacs = vacData?.vacunasByUsuario || [];
  const recs = recData?.recordatoriosByUsuario || [];
  const alertas = alertData?.alertasByUsuario || [];

  const isCompletada = (c) => c.estado === 'completada' || c.estado === 'COMPLETADA';
  const isPendiente = (c) => c.estado === 'pendiente' || c.estado === 'PENDIENTE';
  const citasCompletadas = citas.filter(isCompletada).length;
  const citasPendientes = citas.filter(isPendiente).length;
  const alertasSinLeer = alertas.filter((a) => !a.leida).length;

  const statsCards = [
    { label: 'Citas Pendientes', value: citasPendientes, icon: CalendarClock, color: 'from-primary-500 to-primary-600', bg: 'bg-primary-50 dark:bg-primary-900/20' },
    { label: 'Medicamentos', value: meds.length, icon: Pill, color: 'from-accent-500 to-accent-600', bg: 'bg-accent-50 dark:bg-accent-900/20' },
    { label: 'Vacunas', value: vacs.length, icon: Syringe, color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { label: 'Alertas', value: alertasSinLeer, icon: Bell, color: 'from-red-500 to-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
  ];

  const pieData = [
    { name: 'Completadas', value: citasCompletadas || 0 },
    { name: 'Pendientes', value: citasPendientes || 0 },
  ];

  const barData = [
    { name: 'Citas', total: citas.length, completadas: citasCompletadas },
    { name: 'Meds', total: meds.length, completadas: meds.length },
    { name: 'Vacunas', total: vacs.length, completadas: vacs.length },
  ];

  const upcoming = [...citas]
    .filter((c) => isPendiente(c) && new Date(c.fecha_hora) >= new Date())
    .sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora))
    .slice(0, 5);

  const today = new Date();
  const monthName = today.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

  const citaDays = new Set(
    citas
      .filter((c) => {
        const d = new Date(c.fecha_hora);
        return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
      })
      .map((c) => new Date(c.fecha_hora).getDate())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">
          Hola, <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">{user?.nombre}</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Resumen de tu salud · {today.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((s, i) => (
          <motion.div key={s.label} {...card(i)} className="glass-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
                <p className="text-3xl font-bold mt-1">{s.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-6 h-6 bg-gradient-to-br ${s.color} bg-clip-text text-primary-600 dark:text-primary-400`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <motion.div {...card(4)} className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary-500" />
            <h3 className="font-semibold">Resumen de Registros</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(255,255,255,0.9)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  fontSize: '0.8rem',
                }}
              />
              <Bar dataKey="total" fill="#1b6df5" radius={[6, 6, 0, 0]} name="Total" />
              <Bar dataKey="completadas" fill="#22c55e" radius={[6, 6, 0, 0]} name="Completados" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div {...card(5)} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-accent-500" />
            <h3 className="font-semibold">Cumplimiento Citas</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                {pieData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx]} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Calendar + Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mini Calendar */}
        <motion.div {...card(6)} className="glass-card p-6">
          <h3 className="font-semibold mb-4 capitalize">{monthName}</h3>
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map((d) => (
              <div key={d} className="py-1 font-semibold text-gray-500 dark:text-gray-400">{d}</div>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`e-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isToday = day === today.getDate();
              const hasCita = citaDays.has(day);
              return (
                <div
                  key={day}
                  className={`py-1.5 rounded-lg text-sm transition-colors ${
                    isToday
                      ? 'bg-primary-500 text-white font-bold'
                      : hasCita
                      ? 'bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 font-medium'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Upcoming appointments */}
        <motion.div {...card(7)} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-amber-500" />
            <h3 className="font-semibold">Próximas Citas</h3>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No hay citas próximas</p>
          ) : (
            <div className="space-y-3">
              {upcoming.map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <CalendarClock className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{c.medico}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{c.especialidad}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium">
                      {new Date(c.fecha_hora).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(c.fecha_hora).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Alerts */}
      {alertas.length > 0 && (
        <motion.div {...card(8)} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold">Alertas Recientes</h3>
          </div>
          <div className="space-y-2">
            {alertas.slice(0, 3).map((a) => (
              <div
                key={a.id}
                className={`p-3 rounded-xl text-sm ${
                  a.leida
                    ? 'bg-gray-50 dark:bg-gray-800/30'
                    : 'bg-red-50 dark:bg-red-900/20 animate-pulse-soft'
                }`}
              >
                <p className="font-medium">{a.tipo}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{a.mensaje}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
