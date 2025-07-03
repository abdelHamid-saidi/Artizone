import { FaHome, FaUsers, FaBox, FaBell, FaExclamationTriangle, FaHammer } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: <FaHome /> },
  { path: '/commandes', label: 'Commandes', icon: <FaBox /> },
  { path: '/utilisateurs', label: 'Utilisateurs', icon: <FaUsers /> },
  { path: '/signalements', label: 'Signalements', icon: <FaExclamationTriangle /> },
  { path: '/artisans', label: 'Artisans', icon: <FaHammer /> },
];

const Sidebar = () => {
  const { pathname } = useLocation();

  return (
    <aside className="w-64 h-screen bg-white shadow fixed top-0 left-0 p-4">
      <h1 className="text-2xl font-bold text-blue-600 mb-8">Artizone</h1>
      <nav className="space-y-3">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-2 rounded hover:bg-blue-100 transition ${
              pathname === item.path ? 'bg-blue-500 text-white' : 'text-gray-700'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
