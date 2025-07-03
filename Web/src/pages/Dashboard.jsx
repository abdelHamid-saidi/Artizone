import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import StatCard from '../components/StatCard';
import { 
  FaBox, 
  FaUsers, 
  FaExclamationTriangle, 
  FaMoneyBillWave, 
  FaChartLine, 
  FaCalendarAlt,
  FaStar,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Données pour les graphiques
  const chartData = [
    { name: 'Jan', commandes: 65, revenus: 12000 },
    { name: 'Fév', commandes: 78, revenus: 15000 },
    { name: 'Mar', commandes: 90, revenus: 18000 },
    { name: 'Avr', commandes: 81, revenus: 16000 },
    { name: 'Mai', commandes: 95, revenus: 20000 },
    { name: 'Juin', commandes: 88, revenus: 17500 },
  ];

  const pieData = [
    { name: 'Plomberie', value: 35, color: '#3B82F6' },
    { name: 'Électricité', value: 25, color: '#10B981' },
    { name: 'Peinture', value: 20, color: '#F59E0B' },
    { name: 'Maçonnerie', value: 20, color: '#EF4444' },
  ];

  const recentActivities = [
    { id: 1, type: 'commande', message: 'Nouvelle commande #1234 reçue', time: 'Il y a 5 min', status: 'success' },
    { id: 2, type: 'artisan', message: 'Artisan Jean Dupont ajouté', time: 'Il y a 15 min', status: 'info' },
    { id: 3, type: 'signalement', message: 'Signalement #567 traité', time: 'Il y a 1h', status: 'warning' },
    { id: 4, type: 'paiement', message: 'Paiement #890 confirmé', time: 'Il y a 2h', status: 'success' },
  ];

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-800 mb-2">Tableau de bord</h1>
        <p className="text-secondary-600">Bienvenue sur votre espace d'administration Artizone</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Commandes"
          value={497}
          icon={<FaBox />}
          color="primary"
          trend="up"
          trendValue="+12%"
          description="Ce mois"
          loading={isLoading}
        />
        <StatCard
          title="Utilisateurs"
          value={1247}
          icon={<FaUsers />}
          color="success"
          trend="up"
          trendValue="+8%"
          description="Total inscrits"
          loading={isLoading}
        />
        <StatCard
          title="Signalements"
          value={23}
          icon={<FaExclamationTriangle />}
          color="warning"
          trend="down"
          trendValue="-5%"
          description="En attente"
          loading={isLoading}
        />
        <StatCard
          title="Revenus"
          value="€45,230"
          icon={<FaMoneyBillWave />}
          color="danger"
          trend="up"
          trendValue="+15%"
          description="Ce mois"
          loading={isLoading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Commandes et Revenus */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-secondary-800">Évolution des commandes</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
              <span className="text-sm text-secondary-600">Commandes</span>
              <div className="w-3 h-3 bg-success-500 rounded-full ml-4"></div>
              <span className="text-sm text-secondary-600">Revenus</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="commandes" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="revenus" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Répartition des services */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-secondary-800 mb-6">Répartition des services</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center mt-4 space-x-6">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-secondary-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities and Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activités récentes */}
        <div className="lg:col-span-2 card p-6">
          <h3 className="text-lg font-semibold text-secondary-800 mb-6">Activités récentes</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-secondary-50 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.status === 'success' ? 'bg-success-500' :
                  activity.status === 'warning' ? 'bg-warning-500' :
                  activity.status === 'danger' ? 'bg-danger-500' : 'bg-primary-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm text-secondary-800">{activity.message}</p>
                  <p className="text-xs text-secondary-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-secondary-800 mb-6">Statistiques rapides</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FaStar className="w-5 h-5 text-warning-500" />
                <span className="text-sm text-secondary-700">Note moyenne</span>
              </div>
              <span className="font-semibold text-secondary-800">4.8/5</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-success-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FaCalendarAlt className="w-5 h-5 text-success-500" />
                <span className="text-sm text-secondary-700">Commandes aujourd'hui</span>
              </div>
              <span className="font-semibold text-secondary-800">12</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-warning-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FaMapMarkerAlt className="w-5 h-5 text-warning-500" />
                <span className="text-sm text-secondary-700">Zones couvertes</span>
              </div>
              <span className="font-semibold text-secondary-800">24</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-danger-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FaExclamationTriangle className="w-5 h-5 text-danger-500" />
                <span className="text-sm text-secondary-700">En attente</span>
              </div>
              <span className="font-semibold text-secondary-800">3</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
