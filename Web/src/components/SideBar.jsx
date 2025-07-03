import { FaHome, FaUsers, FaBox, FaExclamationTriangle, FaHammer, FaSignOutAlt, FaCog, FaChartBar } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const navItems = [
  { 
    path: '/dashboard', 
    label: 'Dashboard', 
    icon: <FaHome />,
    description: 'Vue d\'ensemble'
  },
  { 
    path: '/commandes', 
    label: 'Commandes', 
    icon: <FaBox />,
    description: 'Gestion des commandes'
  },
  { 
    path: '/utilisateurs', 
    label: 'Utilisateurs', 
    icon: <FaUsers />,
    description: 'Gestion des utilisateurs'
  },
  { 
    path: '/signalements', 
    label: 'Signalements', 
    icon: <FaExclamationTriangle />,
    description: 'Notifications et alertes'
  },
  { 
    path: '/artisans', 
    label: 'Artisans', 
    icon: <FaHammer />,
    description: 'Gestion des artisans'
  },
];

const Sidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      navigate('/');
    }
  };

  return (
    <aside className={`h-screen bg-white shadow-soft border-r border-secondary-200 transition-all duration-300 z-30 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      {/* Header */}
      <div className="p-6 border-b border-secondary-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <FaHammer className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gradient">Artizone</h1>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-secondary-100 transition-colors"
            title={isCollapsed ? 'Développer' : 'Réduire'}
          >
            <div className={`w-4 h-4 border-2 border-secondary-400 border-t-transparent rounded-full transition-transform ${isCollapsed ? 'rotate-180' : ''}`}></div>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navItems.map((item, index) => (
          <Link
            key={item.path}
            to={item.path}
            className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden ${
              pathname === item.path 
                ? 'bg-primary-600 text-white shadow-medium' 
                : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-800'
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Background animation */}
            <div className={`absolute inset-0 transition-all duration-300 ${
              pathname === item.path 
                ? 'bg-gradient-to-r from-primary-600 to-primary-700' 
                : 'bg-gradient-to-r from-secondary-100 to-secondary-200 opacity-0 group-hover:opacity-100'
            }`}></div>
            
            {/* Icon */}
            <div className={`relative z-10 transition-transform duration-200 ${
              pathname === item.path ? 'scale-110' : 'group-hover:scale-110'
            }`}>
              {item.icon}
            </div>
            
            {/* Label */}
            {!isCollapsed && (
              <div className="relative z-10 flex-1">
                <span className="font-medium">{item.label}</span>
                <p className={`text-xs mt-0.5 transition-opacity duration-200 ${
                  pathname === item.path ? 'opacity-80' : 'opacity-60 group-hover:opacity-80'
                }`}>
                  {item.description}
                </p>
              </div>
            )}
            
            {/* Active indicator */}
            {pathname === item.path && (
              <div className="absolute right-2 w-2 h-2 bg-white rounded-full"></div>
            )}
          </Link>
        ))}
      </nav>

      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div className="absolute left-full top-0 ml-2 bg-secondary-800 text-white text-sm px-2 py-1 rounded opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100">
          Navigation
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
