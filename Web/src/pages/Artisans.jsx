import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { 
  FaPlus, 
  FaSearch, 
  FaFilter, 
  FaStar, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaClock, 
  FaTools,
  FaEdit,
  FaTrash,
  FaEye,
  FaCheck,
  FaTimes
} from 'react-icons/fa';

const Artisans = () => {
  const [artisans, setArtisans] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const mockServices = [
    { id: '1', nom: 'Plomberie', color: 'primary' },
    { id: '2', nom: 'Électricité', color: 'success' },
    { id: '3', nom: 'Peinture', color: 'warning' },
    { id: '4', nom: 'Maçonnerie', color: 'danger' }
  ];

  const [selectedServices, setSelectedServices] = useState([]);
  const [newArtisan, setNewArtisan] = useState({
    nom: '',
    telephone: '',
    langue: '',
    noteMoyenne: '',
    status: 'actif',
    adresse: {
      rue: '',
      ville: '',
      codePostal: '',
      pays: ''
    },
    disponibilites: [
      { jour: 'Lundi', heureDebut: '', heureFin: '', isDisponible: false },
      { jour: 'Mardi', heureDebut: '', heureFin: '', isDisponible: false },
      { jour: 'Mercredi', heureDebut: '', heureFin: '', isDisponible: false },
      { jour: 'Jeudi', heureDebut: '', heureFin: '', isDisponible: false },
      { jour: 'Vendredi', heureDebut: '', heureFin: '', isDisponible: false },
      { jour: 'Samedi', heureDebut: '', heureFin: '', isDisponible: false },
      { jour: 'Dimanche', heureDebut: '', heureFin: '', isDisponible: false }
    ],
    services: []
  });

  useEffect(() => {
    // Simulation du chargement des données
    const timer = setTimeout(() => {
      const mockArtisans = [
        {
          id: 1,
          nom: 'Jean Dupont',
          telephone: '+33 6 12 34 56 78',
          langue: 'Français',
          noteMoyenne: 4.8,
          status: 'actif',
          services: ['Plomberie', 'Électricité'],
          adresse: {
            rue: '123 Rue de la Paix',
            ville: 'Paris',
            codePostal: '75001',
            pays: 'France'
          },
          disponibilites: [
            { jour: 'Lundi', heureDebut: '08:00', heureFin: '18:00', isDisponible: true },
            { jour: 'Mardi', heureDebut: '08:00', heureFin: '18:00', isDisponible: true },
            { jour: 'Mercredi', heureDebut: '08:00', heureFin: '18:00', isDisponible: true },
            { jour: 'Jeudi', heureDebut: '08:00', heureFin: '18:00', isDisponible: true },
            { jour: 'Vendredi', heureDebut: '08:00', heureFin: '18:00', isDisponible: true },
            { jour: 'Samedi', heureDebut: '09:00', heureFin: '17:00', isDisponible: true },
            { jour: 'Dimanche', heureDebut: '', heureFin: '', isDisponible: false }
          ]
        },
        {
          id: 2,
          nom: 'Marie Martin',
          telephone: '+33 6 98 76 54 32',
          langue: 'Français',
          noteMoyenne: 4.6,
          status: 'actif',
          services: ['Peinture'],
          adresse: {
            rue: '456 Avenue des Champs',
            ville: 'Lyon',
            codePostal: '69001',
            pays: 'France'
          },
          disponibilites: [
            { jour: 'Lundi', heureDebut: '09:00', heureFin: '17:00', isDisponible: true },
            { jour: 'Mardi', heureDebut: '09:00', heureFin: '17:00', isDisponible: true },
            { jour: 'Mercredi', heureDebut: '09:00', heureFin: '17:00', isDisponible: true },
            { jour: 'Jeudi', heureDebut: '09:00', heureFin: '17:00', isDisponible: true },
            { jour: 'Vendredi', heureDebut: '09:00', heureFin: '17:00', isDisponible: true },
            { jour: 'Samedi', heureDebut: '', heureFin: '', isDisponible: false },
            { jour: 'Dimanche', heureDebut: '', heureFin: '', isDisponible: false }
          ]
        }
      ];
      setArtisans(mockArtisans);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const supprimerArtisan = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet artisan ?')) {
      setArtisans(artisans.filter((a) => a.id !== id));
    }
  };

  const toggleService = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const filteredArtisans = artisans.filter(artisan => {
    const matchesSearch = artisan.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artisan.telephone.includes(searchTerm) ||
                         artisan.adresse.ville.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesService = selectedService === 'all' || artisan.services.includes(selectedService);
    const matchesStatus = selectedStatus === 'all' || artisan.status === selectedStatus;
    
    return matchesSearch && matchesService && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      actif: { color: 'success', text: 'Actif' },
      inactif: { color: 'secondary', text: 'Inactif' },
      en_attente: { color: 'warning', text: 'En attente' }
    };
    const config = statusConfig[status] || statusConfig.actif;
    return <span className={`badge-${config.color}`}>{config.text}</span>;
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-warning-500' : 'text-secondary-300'}`}
      />
    ));
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-secondary-800 mb-2">Gestion des Artisans</h1>
            <p className="text-secondary-600">Gérez vos artisans et leurs services</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <FaPlus />
            <span>Ajouter un artisan</span>
          </button>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
              <input
                type="text"
                placeholder="Rechercher un artisan..."
                className="input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Service filter */}
            <select
              className="input"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
            >
              <option value="all">Tous les services</option>
              {mockServices.map(service => (
                <option key={service.id} value={service.nom}>{service.nom}</option>
              ))}
            </select>

            {/* Status filter */}
            <select
              className="input"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
              <option value="en_attente">En attente</option>
            </select>

            {/* Results count */}
            <div className="flex items-center justify-end">
              <span className="text-sm text-secondary-600">
                {filteredArtisans.length} artisan{filteredArtisans.length > 1 ? 's' : ''} trouvé{filteredArtisans.length > 1 ? 's' : ''}
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
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-secondary-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-secondary-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-secondary-200 rounded w-24"></div>
                </div>
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

      {/* Artisans Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtisans.map((artisan) => (
            <div key={artisan.id} className="card-hover p-6 group">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {artisan.nom.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-800 group-hover:text-primary-600 transition-colors">
                      {artisan.nom}
                    </h3>
                    {getStatusBadge(artisan.status)}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {renderStars(artisan.noteMoyenne)}
                  <span className="text-sm text-secondary-600 ml-1">
                    ({artisan.noteMoyenne})
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-secondary-600">
                  <FaPhone className="w-4 h-4" />
                  <span>{artisan.telephone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-secondary-600">
                  <FaMapMarkerAlt className="w-4 h-4" />
                  <span>{artisan.adresse.ville}, {artisan.adresse.codePostal}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-secondary-600">
                  <FaClock className="w-4 h-4" />
                  <span>{artisan.disponibilites.filter(d => d.isDisponible).length}/7 jours disponibles</span>
                </div>
              </div>

              {/* Services */}
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <FaTools className="w-4 h-4 text-secondary-500" />
                  <span className="text-sm font-medium text-secondary-700">Services</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {artisan.services.map((service, index) => {
                    const serviceConfig = mockServices.find(s => s.nom === service);
                    return (
                      <span key={index} className={`badge-${serviceConfig?.color || 'secondary'} text-xs`}>
                        {service}
                      </span>
                    );
                  })}
                </div>
              </div>

                              {/* Actions */}
                <div className="flex flex-col space-y-2 pt-4 border-t border-secondary-200">
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/artisans/${artisan.id}`}
                      className="btn-secondary text-sm flex-1 justify-center"
                    >
                      <FaEye className="w-3 h-3" />
                      <span>Voir</span>
                    </Link>
                    <button className="btn-secondary text-sm flex-1 justify-center">
                      <FaEdit className="w-3 h-3" />
                      <span>Modifier</span>
                    </button>
                  </div>
                  <button
                    onClick={() => supprimerArtisan(artisan.id)}
                    className="btn-danger text-sm w-full justify-center"
                  >
                    <FaTrash className="w-3 h-3" />
                    <span>Supprimer</span>
                  </button>
                </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filteredArtisans.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTools className="w-12 h-12 text-secondary-400" />
          </div>
          <h3 className="text-lg font-semibold text-secondary-800 mb-2">Aucun artisan trouvé</h3>
          <p className="text-secondary-600 mb-6">
            Aucun artisan ne correspond à vos critères de recherche.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            <FaPlus className="w-4 h-4 mr-2" />
            Ajouter le premier artisan
          </button>
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-strong max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="p-6 border-b border-secondary-200">
              <h2 className="text-xl font-semibold text-secondary-800">Nouvel Artisan</h2>
            </div>
            
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setArtisans([
                  ...artisans,
                  { id: crypto.randomUUID(), ...newArtisan, services: selectedServices }
                ]);
                setNewArtisan({
                  nom: '',
                  telephone: '',
                  langue: '',
                  noteMoyenne: '',
                  status: 'actif',
                  adresse: { rue: '', ville: '', codePostal: '', pays: '' },
                  disponibilites: newArtisan.disponibilites.map(d => ({ ...d, heureDebut: '', heureFin: '', isDisponible: false })),
                  services: []
                });
                setSelectedServices([]);
                setShowForm(false);
              }}
              className="p-6 space-y-6"
            >
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-medium text-secondary-800 mb-4">Informations générales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">Nom complet</label>
                    <input 
                      type="text" 
                      placeholder="Nom de l'artisan" 
                      className="input" 
                      value={newArtisan.nom} 
                      onChange={(e) => setNewArtisan({ ...newArtisan, nom: e.target.value })} 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">Téléphone</label>
                    <input 
                      type="tel" 
                      placeholder="+33 6 12 34 56 78" 
                      className="input" 
                      value={newArtisan.telephone} 
                      onChange={(e) => setNewArtisan({ ...newArtisan, telephone: e.target.value })} 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">Langue</label>
                    <input 
                      type="text" 
                      placeholder="Français" 
                      className="input" 
                      value={newArtisan.langue} 
                      onChange={(e) => setNewArtisan({ ...newArtisan, langue: e.target.value })} 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">Note moyenne</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      min="0" 
                      max="5"
                      placeholder="4.5" 
                      className="input" 
                      value={newArtisan.noteMoyenne} 
                      onChange={(e) => setNewArtisan({ ...newArtisan, noteMoyenne: e.target.value })} 
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-lg font-medium text-secondary-800 mb-4">Adresse</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">Rue</label>
                    <input 
                      type="text" 
                      placeholder="123 Rue de la Paix" 
                      className="input" 
                      value={newArtisan.adresse.rue} 
                      onChange={(e) => setNewArtisan({ ...newArtisan, adresse: { ...newArtisan.adresse, rue: e.target.value } })} 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">Ville</label>
                    <input 
                      type="text" 
                      placeholder="Paris" 
                      className="input" 
                      value={newArtisan.adresse.ville} 
                      onChange={(e) => setNewArtisan({ ...newArtisan, adresse: { ...newArtisan.adresse, ville: e.target.value } })} 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">Code postal</label>
                    <input 
                      type="text" 
                      placeholder="75001" 
                      className="input" 
                      value={newArtisan.adresse.codePostal} 
                      onChange={(e) => setNewArtisan({ ...newArtisan, adresse: { ...newArtisan.adresse, codePostal: e.target.value } })} 
                      required 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">Pays</label>
                    <input 
                      type="text" 
                      placeholder="France" 
                      className="input" 
                      value={newArtisan.adresse.pays} 
                      onChange={(e) => setNewArtisan({ ...newArtisan, adresse: { ...newArtisan.adresse, pays: e.target.value } })} 
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* Services */}
              <div>
                <h3 className="text-lg font-medium text-secondary-800 mb-4">Services proposés</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {mockServices.map(service => (
                    <div key={service.id} className="flex items-center justify-between p-3 border border-secondary-200 rounded-lg">
                      <span className="text-sm text-secondary-700">{service.nom}</span>
                      <button
                        type="button"
                        className={`btn-sm ${selectedServices.includes(service.nom) ? 'btn-success' : 'btn-primary'}`}
                        onClick={() => toggleService(service.nom)}
                      >
                        {selectedServices.includes(service.nom) ? (
                          <>
                            <FaCheck className="w-3 h-3" />
                            <span>Sélectionné</span>
                          </>
                        ) : (
                          <>
                            <FaPlus className="w-3 h-3" />
                            <span>Sélectionner</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disponibilités */}
              <div>
                <h3 className="text-lg font-medium text-secondary-800 mb-4">Disponibilités</h3>
                <div className="space-y-3">
                  {newArtisan.disponibilites.map((d, index) => (
                    <div key={d.jour} className="flex items-center space-x-4 p-3 border border-secondary-200 rounded-lg">
                      <label className="w-20 text-sm font-medium text-secondary-700">{d.jour}</label>
                      <input 
                        type="time" 
                        className="input flex-1" 
                        value={d.heureDebut} 
                        onChange={(e) => {
                          const dispo = [...newArtisan.disponibilites];
                          dispo[index].heureDebut = e.target.value;
                          setNewArtisan({ ...newArtisan, disponibilites: dispo });
                        }} 
                      />
                      <span className="text-secondary-500">à</span>
                      <input 
                        type="time" 
                        className="input flex-1" 
                        value={d.heureFin} 
                        onChange={(e) => {
                          const dispo = [...newArtisan.disponibilites];
                          dispo[index].heureFin = e.target.value;
                          setNewArtisan({ ...newArtisan, disponibilites: dispo });
                        }} 
                      />
                      <label className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          checked={d.isDisponible} 
                          onChange={(e) => {
                            const dispo = [...newArtisan.disponibilites];
                            dispo[index].isDisponible = e.target.checked;
                            setNewArtisan({ ...newArtisan, disponibilites: dispo });
                          }} 
                          className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm text-secondary-600">Disponible</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)} 
                  className="btn-secondary"
                >
                  <FaTimes className="w-4 h-4 mr-2" />
                  Annuler
                </button>
                <button type="submit" className="btn-success">
                  <FaCheck className="w-4 h-4 mr-2" />
                  Ajouter l'artisan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Artisans;
