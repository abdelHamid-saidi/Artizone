import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { 
  FaSearch, 
  FaFilter, 
  FaCalendarAlt, 
  FaUser, 
  FaTools, 
  FaEuroSign,
  FaEye,
  FaCheck,
  FaTimes,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaMapMarkerAlt
} from 'react-icons/fa';

const Commandes = () => {
  const [commandes, setCommandes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedService, setSelectedService] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const services = [
    { id: 'plomberie', nom: 'Plomberie', color: 'primary' },
    { id: 'electricite', nom: 'Électricité', color: 'success' },
    { id: 'peinture', nom: 'Peinture', color: 'warning' },
    { id: 'maconnerie', nom: 'Maçonnerie', color: 'danger' }
  ];

  useEffect(() => {
    // Simulation du chargement des données
    const timer = setTimeout(() => {
      const mockCommandes = [
        {
          id: '1',
          numero: 'CMD-2024-001',
          dateCommande: '2024-01-15T09:00:00Z',
          dateLivraison: '2024-01-20T14:00:00Z',
          statut: 'en_attente',
          prixTotal: 120.50,
          particulier: { 
            nom: 'Benali', 
            prenom: 'Karim',
            email: 'karim.benali@email.com',
            telephone: '+33 6 12 34 56 78'
          },
          artisan: { nom: 'Jean Dupont', telephone: '+33 6 98 76 54 32' },
          service: { nom: 'Plomberie', description: 'Réparation fuite d\'eau' },
          adresse: {
            rue: '123 Rue de la Paix',
            ville: 'Paris',
            codePostal: '75001'
          },
          notes: 'Client demande intervention rapide'
        },
        {
          id: '2',
          numero: 'CMD-2024-002',
          dateCommande: '2024-01-14T14:00:00Z',
          dateLivraison: '2024-01-18T10:00:00Z',
          statut: 'terminee',
          prixTotal: 75.00,
          particulier: { 
            nom: 'Slimani', 
            prenom: 'Nora',
            email: 'nora.slimani@email.com',
            telephone: '+33 6 23 45 67 89'
          },
          artisan: { nom: 'Marie Martin', telephone: '+33 6 87 65 43 21' },
          service: { nom: 'Électricité', description: 'Installation prise électrique' },
          adresse: {
            rue: '456 Avenue des Champs',
            ville: 'Lyon',
            codePostal: '69001'
          },
          notes: 'Travail effectué avec satisfaction'
        },
        {
          id: '3',
          numero: 'CMD-2024-003',
          dateCommande: '2024-01-16T10:00:00Z',
          dateLivraison: '2024-01-22T16:00:00Z',
          statut: 'acceptee',
          prixTotal: 95.00,
          particulier: { 
            nom: 'Ziane', 
            prenom: 'Tarek',
            email: 'tarek.ziane@email.com',
            telephone: '+33 6 34 56 78 90'
          },
          artisan: { nom: 'Pierre Durand', telephone: '+33 6 76 54 32 10' },
          service: { nom: 'Peinture', description: 'Peinture salon 20m²' },
          adresse: {
            rue: '789 Boulevard Central',
            ville: 'Marseille',
            codePostal: '13001'
          },
          notes: 'Couleur demandée : blanc cassé'
        },
        {
          id: '4',
          numero: 'CMD-2024-004',
          dateCommande: '2024-01-13T11:00:00Z',
          dateLivraison: '2024-01-17T09:00:00Z',
          statut: 'annulee',
          prixTotal: 150.00,
          particulier: { 
            nom: 'Dubois', 
            prenom: 'Sophie',
            email: 'sophie.dubois@email.com',
            telephone: '+33 6 45 67 89 01'
          },
          artisan: { nom: 'Michel Bernard', telephone: '+33 6 65 43 21 09' },
          service: { nom: 'Maçonnerie', description: 'Réparation mur extérieur' },
          adresse: {
            rue: '321 Rue du Commerce',
            ville: 'Toulouse',
            codePostal: '31000'
          },
          notes: 'Commande annulée par le client'
        }
      ];
      setCommandes(mockCommandes);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getStatusConfig = (statut) => {
    const configs = {
      en_attente: { 
        color: 'warning', 
        text: 'En attente', 
        icon: <FaClock />,
        bgColor: 'bg-warning-50',
        borderColor: 'border-warning-200'
      },
      acceptee: { 
        color: 'primary', 
        text: 'Acceptée', 
        icon: <FaCheckCircle />,
        bgColor: 'bg-primary-50',
        borderColor: 'border-primary-200'
      },
      terminee: { 
        color: 'success', 
        text: 'Terminée', 
        icon: <FaCheck />,
        bgColor: 'bg-success-50',
        borderColor: 'border-success-200'
      },
      annulee: { 
        color: 'danger', 
        text: 'Annulée', 
        icon: <FaTimes />,
        bgColor: 'bg-danger-50',
        borderColor: 'border-danger-200'
      }
    };
    return configs[statut] || configs.en_attente;
  };

  const getServiceColor = (serviceName) => {
    const service = services.find(s => s.nom === serviceName);
    return service?.color || 'secondary';
  };

  const filteredCommandes = commandes.filter(commande => {
    const matchesSearch = 
      commande.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${commande.particulier.prenom} ${commande.particulier.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commande.service.nom.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || commande.statut === selectedStatus;
    const matchesService = selectedService === 'all' || commande.service.nom === selectedService;
    
    let matchesDate = true;
    if (selectedDateRange !== 'all') {
      const commandeDate = new Date(commande.dateCommande);
      const now = new Date();
      const diffDays = Math.floor((now - commandeDate) / (1000 * 60 * 60 * 24));
      
      switch (selectedDateRange) {
        case 'today':
          matchesDate = diffDays === 0;
          break;
        case 'week':
          matchesDate = diffDays <= 7;
          break;
        case 'month':
          matchesDate = diffDays <= 30;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesService && matchesDate;
  });

  const acceptCommande = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir accepter cette commande ?')) {
      setCommandes(prev => prev.map(c => c.id === id ? { ...c, statut: 'acceptee' } : c));
    }
  };

  const cancelCommande = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      setCommandes(prev => prev.map(c => c.id === id ? { ...c, statut: 'annulee' } : c));
    }
  };

  const getStats = () => {
    const total = commandes.length;
    const enAttente = commandes.filter(c => c.statut === 'en_attente').length;
    const acceptees = commandes.filter(c => c.statut === 'acceptee').length;
    const terminees = commandes.filter(c => c.statut === 'terminee').length;
    const revenus = commandes.filter(c => c.statut === 'terminee').reduce((sum, c) => sum + c.prixTotal, 0);
    
    return { total, enAttente, acceptees, terminees, revenus };
  };

  const stats = getStats();

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-secondary-800 mb-2">Gestion des Commandes</h1>
            <p className="text-secondary-600">Suivez et gérez toutes les commandes de vos clients</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-secondary-800">{stats.total}</div>
            <div className="text-sm text-secondary-600">Total</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-warning-600">{stats.enAttente}</div>
            <div className="text-sm text-secondary-600">En attente</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-primary-600">{stats.acceptees}</div>
            <div className="text-sm text-secondary-600">Acceptées</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-success-600">{stats.terminees}</div>
            <div className="text-sm text-secondary-600">Terminées</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-success-600">€{stats.revenus.toFixed(2)}</div>
            <div className="text-sm text-secondary-600">Revenus</div>
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
                placeholder="Rechercher une commande..."
                className="input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status filter */}
            <select
              className="input"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="en_attente">En attente</option>
              <option value="acceptee">Acceptée</option>
              <option value="terminee">Terminée</option>
              <option value="annulee">Annulée</option>
            </select>

            {/* Service filter */}
            <select
              className="input"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
            >
              <option value="all">Tous les services</option>
              {services.map(service => (
                <option key={service.id} value={service.nom}>{service.nom}</option>
              ))}
            </select>

            {/* Date range filter */}
            <select
              className="input"
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
            >
              <option value="all">Toutes les dates</option>
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
            </select>

            {/* Results count */}
            <div className="flex items-center justify-end">
              <span className="text-sm text-secondary-600">
                {filteredCommandes.length} commande{filteredCommandes.length > 1 ? 's' : ''} trouvée{filteredCommandes.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 bg-secondary-200 rounded w-32"></div>
                <div className="h-6 w-6 bg-secondary-200 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-secondary-200 rounded"></div>
                <div className="h-3 bg-secondary-200 rounded w-3/4"></div>
                <div className="h-3 bg-secondary-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Commandes Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCommandes.map((commande) => {
            const statusConfig = getStatusConfig(commande.statut);
            const serviceColor = getServiceColor(commande.service.nom);
            
            return (
              <div key={commande.id} className={`card-hover p-6 border-l-4 border-${statusConfig.color}-500`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full ${statusConfig.bgColor} flex items-center justify-center`}>
                      <div className={`text-${statusConfig.color}-600`}>
                        {statusConfig.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary-800">{commande.numero}</h3>
                      <span className={`badge-${statusConfig.color}`}>{statusConfig.text}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-secondary-800">€{commande.prixTotal.toFixed(2)}</div>
                    <div className="text-sm text-secondary-500">
                      {new Date(commande.dateCommande).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Client and Service Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <FaUser className="w-4 h-4 text-secondary-500" />
                    <span className="text-sm text-secondary-700">
                      {commande.particulier.prenom} {commande.particulier.nom}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaTools className="w-4 h-4 text-secondary-500" />
                    <span className="text-sm text-secondary-700">{commande.service.nom}</span>
                    <span className={`badge-${serviceColor} text-xs`}>
                      {commande.service.description}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaMapMarkerAlt className="w-4 h-4 text-secondary-500" />
                    <span className="text-sm text-secondary-700">
                      {commande.adresse.ville}, {commande.adresse.codePostal}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                {commande.notes && (
                  <div className="mb-4 p-3 bg-secondary-50 rounded-lg">
                    <p className="text-sm text-secondary-700">{commande.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-secondary-200">
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/commandes/${commande.id}`}
                      className="btn-secondary text-sm"
                    >
                      <FaEye className="w-3 h-3" />
                      <span>Détails</span>
                    </Link>
                  </div>
                  <div className="flex items-center space-x-2">
                    {commande.statut === 'en_attente' && (
                      <>
                        <button
                          onClick={() => acceptCommande(commande.id)}
                          className="btn-success text-sm"
                        >
                          <FaCheck className="w-3 h-3" />
                          <span>Accepter</span>
                        </button>
                        <button
                          onClick={() => cancelCommande(commande.id)}
                          className="btn-danger text-sm"
                        >
                          <FaTimes className="w-3 h-3" />
                          <span>Refuser</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filteredCommandes.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCalendarAlt className="w-12 h-12 text-secondary-400" />
          </div>
          <h3 className="text-lg font-semibold text-secondary-800 mb-2">Aucune commande trouvée</h3>
          <p className="text-secondary-600">
            Aucune commande ne correspond à vos critères de recherche.
          </p>
        </div>
      )}
    </AdminLayout>
  );
};

export default Commandes;
