import AdminLayout from '../components/AdminLayout';
import StatCard from '../components/StatCard';
import { FaBox, FaUsers, FaExclamationTriangle, FaMoneyBillWave } from 'react-icons/fa';

const Dashboard = () => {
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Bienvenue sur le Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Commandes"
          value="34"
          icon={<FaBox />}
          color="border-blue-500"
        />
        <StatCard
          title="Utilisateurs"
          value="120"
          icon={<FaUsers />}
          color="border-green-500"
        />
        <StatCard
          title="Signalements"
          value="5"
          icon={<FaExclamationTriangle />}
          color="border-red-500"
        />
        <StatCard
          title="Paiements"
          value="12 000 €"
          icon={<FaMoneyBillWave />}
          color="border-yellow-500"
        />
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
