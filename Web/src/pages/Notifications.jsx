import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { 
  FaBell, 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaEyeSlash, 
  FaExclamationTriangle, 
  FaStar, 
  FaUser, 
  FaClock, 
  FaCheck,
  FaTimes,
  FaTrash,
  FaArchive,
  FaEnvelope,
  FaEnvelopeOpen
} from 'react-icons/fa';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulation du chargement des données
    const timer = setTimeout(() => {
      const mockData = [
        {
          id: '1',
          type: 'signalement',
          titre: 'Signalement d\'artisan',
          contenu: 'Comportement inapproprié de l\'artisan Jean Dupont lors de l\'intervention.',
          dateEnvoi: '2024-01-15T10:00:00Z',
          statut: 'non_lu',
          priorite: 'haute',
          particulier: { 
            prenom: 'Lina', 
            nom: 'Messaoudi',
            email: 'lina.messaoudi@email.com'
          },
          artisan: { nom: 'Jean Dupont', id: 'art1' },
          actions: ['investiguer', 'contacter_client', 'sanctionner']
        },
        {
          id: '2',
          type: 'avis',
          titre: 'Avis positif reçu',
          contenu: 'Excellent travail, rapide et propre. Je recommande vivement cet artisan.',
          dateEnvoi: '2024-01-14T16:45:00Z',
          statut: 'lu',
          priorite: 'normale',
          particulier: { 
            prenom: 'Yanis', 
            nom: 'Boualem',
            email: 'yanis.boualem@email.com'
          },
          artisan: { nom: 'Marie Martin', id: 'art2' },
          note: 5,
          actions: ['remercier', 'promouvoir']
        },
        {
          id: '3',
          type: 'avis',
          titre: 'Avis négatif reçu',
          contenu: 'Pas satisfait de la ponctualité. L\'artisan a eu 30 minutes de retard.',
          dateEnvoi: '2024-01-16T09:10:00Z',
          statut: 'non_lu',
          priorite: 'moyenne',
          particulier: { 
            prenom: 'Sami', 
            nom: 'Rahal',
            email: 'sami.rahal@email.com'
          },
          artisan: { nom: 'Pierre Durand', id: 'art3' },
          note: 2,
          actions: ['contacter_client', 'former_artisan']
        },
        {
          id: '4',
          type: 'systeme',
          titre: 'Maintenance prévue',
          contenu: 'Maintenance système prévue demain de 2h à 4h du matin.',
          dateEnvoi: '2024-01-15T14:30:00Z',
          statut: 'lu',
          priorite: 'normale',
          actions: ['ignorer']
        },
        {
          id: '5',
          type: 'signalement',
          titre: 'Problème de paiement',
          contenu: 'Échec de paiement pour la commande CMD-2024-005.',
          dateEnvoi: '2024-01-16T11:20:00Z',
          statut: 'non_lu',
          priorite: 'haute',
          particulier: { 
            prenom: 'Sophie', 
            nom: 'Dubois',
            email: 'sophie.dubois@email.com'
          },
          commande: { numero: 'CMD-2024-005', montant: 150.00 },
          actions: ['contacter_client', 'verifier_paiement']
        }
      ];
      setNotifications(mockData);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getTypeConfig = (type) => {
    const configs = {
      signalement: { 
        color: 'danger', 
        icon: <FaExclamationTriangle />,
        bgColor: 'bg-danger-50',
        text: 'Signalement'
      },
      avis: { 
        color: 'primary', 
        icon: <FaStar />,
        bgColor: 'bg-primary-50',
        text: 'Avis'
      },
      systeme: { 
        color: 'secondary', 
        icon: <FaBell />,
        bgColor: 'bg-secondary-50',
        text: 'Système'
      }
    };
    return configs[type] || configs.systeme;
  };

  const getPriorityConfig = (priorite) => {
    const configs = {
      haute: { color: 'danger', text: 'Haute' },
      moyenne: { color: 'warning', text: 'Moyenne' },
      normale: { color: 'success', text: 'Normale' }
    };
    return configs[priorite] || configs.normale;
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesSearch = 
      notif.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.contenu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (notif.particulier && `${notif.particulier.prenom} ${notif.particulier.nom}`.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'all' || notif.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || notif.statut === selectedStatus;
    const matchesUnread = !showUnreadOnly || notif.statut === 'non_lu';
    
    return matchesSearch && matchesType && matchesStatus && matchesUnread;
  });

  const marquerCommeLu = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, statut: 'lu' } : n)
    );
  };

  const marquerCommeNonLu = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, statut: 'non_lu' } : n)
    );
  };

  const supprimerNotification = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette notification ?')) {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  };

  const getStats = () => {
    const total = notifications.length;
    const nonLues = notifications.filter(n => n.statut === 'non_lu').length;
    const signalements = notifications.filter(n => n.type === 'signalement').length;
    const avis = notifications.filter(n => n.type === 'avis').length;
    
    return { total, nonLues, signalements, avis };
  };

  const stats = getStats();

  const renderStars = (note) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={`w-3 h-3 ${i < note ? 'text-warning-500' : 'text-secondary-300'}`}
      />
    ));
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-secondary-800 mb-2">Centre de Notifications</h1>
            <p className="text-secondary-600">Gérez tous vos signalements et avis clients</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-secondary-800">{stats.total}</div>
            <div className="text-sm text-secondary-600">Total</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-danger-600">{stats.nonLues}</div>
            <div className="text-sm text-secondary-600">Non lues</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-danger-600">{stats.signalements}</div>
            <div className="text-sm text-secondary-600">Signalements</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-primary-600">{stats.avis}</div>
            <div className="text-sm text-secondary-600">Avis</div>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
              <input
                type="text"
                placeholder="Rechercher une notification..."
                className="input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Type filter */}
            <select
              className="input"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">Tous les types</option>
              <option value="signalement">Signalements</option>
              <option value="avis">Avis</option>
              <option value="systeme">Système</option>
            </select>

            {/* Status filter */}
            <select
              className="input"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="non_lu">Non lues</option>
              <option value="lu">Lues</option>
            </select>

            {/* Unread only toggle */}
            <div className="flex items-center">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showUnreadOnly}
                  onChange={() => setShowUnreadOnly(!showUnreadOnly)}
                  className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-secondary-700">Non lues seulement</span>
              </label>
            </div>

            {/* Results count */}
            <div className="flex items-center justify-end">
              <span className="text-sm text-secondary-600">
                {filteredNotifications.length} notification{filteredNotifications.length > 1 ? 's' : ''} trouvée{filteredNotifications.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-secondary-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-secondary-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-secondary-200 rounded w-24"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-secondary-200 rounded"></div>
                <div className="h-3 bg-secondary-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Notifications Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredNotifications.map((notif) => {
            const typeConfig = getTypeConfig(notif.type);
            const priorityConfig = getPriorityConfig(notif.priorite);
            
            return (
              <div key={notif.id} className={`card-hover p-6 border-l-4 border-${typeConfig.color}-500`}>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full ${typeConfig.bgColor} flex items-center justify-center`}>
                      <div className={`text-${typeConfig.color}-600`}>
                        {typeConfig.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary-800">{notif.titre}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`badge-${typeConfig.color}`}>{typeConfig.text}</span>
                        <span className={`badge-${priorityConfig.color}`}>{priorityConfig.text}</span>
                        {notif.statut === 'non_lu' && (
                          <span className="badge-danger">Nouveau</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-secondary-500">
                      {new Date(notif.dateEnvoi).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-secondary-400">
                      {new Date(notif.dateEnvoi).toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="mb-4">
                  <p className="text-sm text-secondary-700 mb-3">{notif.contenu}</p>
                  
                  {/* Client info */}
                  {notif.particulier && (
                    <div className="flex items-center space-x-2 mb-2">
                      <FaUser className="w-4 h-4 text-secondary-500" />
                      <span className="text-sm text-secondary-600">
                        {notif.particulier.prenom} {notif.particulier.nom}
                      </span>
                    </div>
                  )}

                  {/* Artisan info */}
                  {notif.artisan && (
                    <div className="flex items-center space-x-2 mb-2">
                      <FaUser className="w-4 h-4 text-secondary-500" />
                      <span className="text-sm text-secondary-600">
                        Artisan: {notif.artisan.nom}
                      </span>
                    </div>
                  )}

                  {/* Rating for reviews */}
                  {notif.note && (
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm text-secondary-600">Note:</span>
                      <div className="flex items-center space-x-1">
                        {renderStars(notif.note)}
                        <span className="text-sm text-secondary-600 ml-1">({notif.note}/5)</span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {notif.actions && (
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-1">
                        {notif.actions.map((action, index) => (
                          <span key={index} className="badge-secondary text-xs">
                            {action.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-secondary-200">
                  <div className="flex items-center space-x-2">
                    {notif.statut === 'non_lu' ? (
                      <button
                        onClick={() => marquerCommeLu(notif.id)}
                        className="btn-secondary text-sm"
                      >
                        <FaEye className="w-3 h-3" />
                        <span>Marquer comme lu</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => marquerCommeNonLu(notif.id)}
                        className="btn-secondary text-sm"
                      >
                        <FaEyeSlash className="w-3 h-3" />
                        <span>Marquer comme non lu</span>
                      </button>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => supprimerNotification(notif.id)}
                      className="btn-danger text-sm"
                    >
                      <FaTrash className="w-3 h-3" />
                      <span>Supprimer</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaBell className="w-12 h-12 text-secondary-400" />
          </div>
          <h3 className="text-lg font-semibold text-secondary-800 mb-2">Aucune notification trouvée</h3>
          <p className="text-secondary-600">
            Aucune notification ne correspond à vos critères de recherche.
          </p>
        </div>
      )}
    </AdminLayout>
  );
};

export default Notifications;
