import { useState } from 'react';
import { FaBell, FaSearch, FaUser, FaCog, FaMoon, FaSun } from 'react-icons/fa';

const Topbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Nouvelle commande',
      message: 'Commande #1234 reçue',
      time: 'Il y a 5 min',
      type: 'info'
    },
    {
      id: 2,
      title: 'Signalement traité',
      message: 'Le signalement #567 a été résolu',
      time: 'Il y a 1h',
      type: 'success'
    },
    {
      id: 3,
      title: 'Maintenance prévue',
      message: 'Maintenance système demain à 2h',
      time: 'Il y a 3h',
      type: 'warning'
    }
  ];

  const unreadCount = notifications.length;

  return (
    <header className="bg-white border-b border-secondary-200 px-6 py-4 shadow-soft">
      <div className="flex items-center justify-between">
        {/* Search bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Dark mode toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg hover:bg-secondary-100 transition-colors relative group"
            title={isDarkMode ? 'Mode clair' : 'Mode sombre'}
          >
            {isDarkMode ? <FaSun className="w-5 h-5 text-warning-500" /> : <FaMoon className="w-5 h-5 text-secondary-600" />}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-secondary-100 transition-colors relative"
              title="Notifications"
            >
              <FaBell className="w-5 h-5 text-secondary-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center font-semibold animate-bounce-gentle">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-strong border border-secondary-200 z-50 animate-slide-down">
                <div className="p-4 border-b border-secondary-200">
                  <h3 className="font-semibold text-secondary-800">Notifications</h3>
                  <p className="text-sm text-secondary-500">{unreadCount} non lues</p>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 border-b border-secondary-100 hover:bg-secondary-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notification.type === 'info' ? 'bg-primary-500' :
                          notification.type === 'success' ? 'bg-success-500' :
                          notification.type === 'warning' ? 'bg-warning-500' : 'bg-danger-500'
                        }`}></div>
                        <div className="flex-1">
                          <h4 className="font-medium text-secondary-800">{notification.title}</h4>
                          <p className="text-sm text-secondary-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-secondary-400 mt-2">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-secondary-200">
                  <button className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium">
                    Voir toutes les notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-secondary-100 transition-colors"
            >
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <FaUser className="w-4 h-4 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-secondary-800">Administrateur</p>
                <p className="text-xs text-secondary-500">admin@artizone.com</p>
              </div>
            </button>

            {/* Profile dropdown menu */}
            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-strong border border-secondary-200 z-50 animate-slide-down">
                <div className="p-4 border-b border-secondary-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                      <FaUser className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-secondary-800">Administrateur</p>
                      <p className="text-sm text-secondary-500">admin@artizone.com</p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-secondary-100 transition-colors text-left">
                    <FaUser className="w-4 h-4 text-secondary-600" />
                    <span className="text-sm text-secondary-700">Mon profil</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-secondary-100 transition-colors text-left">
                    <FaCog className="w-4 h-4 text-secondary-600" />
                    <span className="text-sm text-secondary-700">Paramètres</span>
                  </button>
                </div>
                <div className="p-2 border-t border-secondary-200">
                  <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-danger-50 hover:text-danger-600 transition-colors text-left">
                    <FaUser className="w-4 h-4" />
                    <span className="text-sm">Déconnexion</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showProfile) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false);
            setShowProfile(false);
          }}
        />
      )}
    </header>
  );
};

export default Topbar;
