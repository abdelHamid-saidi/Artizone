import AdminLayout from '../components/AdminLayout';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Artisans = () => {
  const supprimerArtisan = (id) => {
  if (window.confirm('Êtes-vous sûr de vouloir supprimer cet artisan ?')) {
    setArtisans(artisans.filter((a) => a.id !== id));
  }
};
  const [artisans, setArtisans] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const mockServices = [
    { id: '1', nom: 'Plomberie' },
    { id: '2', nom: 'Électricité' },
    { id: '3', nom: 'Peinture' },
    { id: '4', nom: 'Maçonnerie' }
  ];

  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const [newArtisan, setNewArtisan] = useState({
    nom: '',
    telephone: '',
    langue: '',
    noteMoyenne: '',
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
    const mockArtisans = [];
    setArtisans(mockArtisans);
  }, []);

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestion des Artisans</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Ajouter un artisan
        </button>
      </div>

      <div className={`overflow-x-auto bg-white shadow rounded-lg ${showForm ? 'opacity-10 pointer-events-none select-none' : ''}`}>
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Nom</th>
              <th className="p-3">Téléphone</th>
              <th className="p-3">Langue</th>
              <th className="p-3">Note</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {artisans.map((artisan) => (
              <tr key={artisan.id} className="border-t">
                <td className="p-3">{artisan.nom}</td>
                <td className="p-3">{artisan.telephone}</td>
                <td className="p-3">{artisan.langue}</td>
                <td className="p-3">{artisan.noteMoyenne}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => supprimerArtisan(artisan.id)} className="text-red-600 hover:underline">Supprimer</button>
                  <Link to={`/artisans/${artisan.id}`} className="text-gray-600 hover:underline">
                    Détails
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-2xl w-full overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-semibold mb-4">Nouvel Artisan</h2>
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
                  adresse: { rue: '', ville: '', codePostal: '', pays: '' },
                  disponibilites: newArtisan.disponibilites.map(d => ({ ...d, heureDebut: '', heureFin: '', isDisponible: false })),
                  services: []
                });
                setSelectedServices([]);
                setShowForm(false);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Nom" className="border p-2 rounded" value={newArtisan.nom} onChange={(e) => setNewArtisan({ ...newArtisan, nom: e.target.value })} required />
                <input type="tel" placeholder="Téléphone" className="border p-2 rounded" value={newArtisan.telephone} onChange={(e) => setNewArtisan({ ...newArtisan, telephone: e.target.value })} required />
                <input type="text" placeholder="Langue" className="border p-2 rounded" value={newArtisan.langue} onChange={(e) => setNewArtisan({ ...newArtisan, langue: e.target.value })} required />
                <input type="number" step="0.1" placeholder="Note moyenne" className="border p-2 rounded" value={newArtisan.noteMoyenne} onChange={(e) => setNewArtisan({ ...newArtisan, noteMoyenne: e.target.value })} required />
              </div>

              <div>
                <h3 className="text-md font-semibold mb-2">Adresse</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Rue" className="border p-2 rounded" value={newArtisan.adresse.rue} onChange={(e) => setNewArtisan({ ...newArtisan, adresse: { ...newArtisan.adresse, rue: e.target.value } })} required />
                  <input type="text" placeholder="Ville" className="border p-2 rounded" value={newArtisan.adresse.ville} onChange={(e) => setNewArtisan({ ...newArtisan, adresse: { ...newArtisan.adresse, ville: e.target.value } })} required />
                  <input type="text" placeholder="Code postal" className="border p-2 rounded" value={newArtisan.adresse.codePostal} onChange={(e) => setNewArtisan({ ...newArtisan, adresse: { ...newArtisan.adresse, codePostal: e.target.value } })} required />
                  <input type="text" placeholder="Pays" className="border p-2 rounded" value={newArtisan.adresse.pays} onChange={(e) => setNewArtisan({ ...newArtisan, adresse: { ...newArtisan.adresse, pays: e.target.value } })} required />
                </div>
              </div>

              <div>
                <h3 className="text-md font-semibold mb-2">Services</h3>
                <div className="grid grid-cols-2 gap-2">
                  {mockServices.map(service => (
                    <div key={service.id} className="flex justify-between items-center border p-2 rounded">
                      <span>{service.nom}</span>
                      <button
                        type="button"
                        className={`px-2 py-1 text-sm rounded ${selectedServices.includes(service.nom) ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}
                        onClick={() => toggleService(service.nom)}
                      >
                        {selectedServices.includes(service.nom) ? 'Annuler' : 'Sélectionner'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-md font-semibold mb-2">Disponibilités</h3>
                {newArtisan.disponibilites.map((d, index) => (
                  <div key={d.jour} className="flex items-center gap-2 mb-2">
                    <label className="w-24">{d.jour}</label>
                    <input type="time" className="border p-1 rounded" value={d.heureDebut} onChange={(e) => {
                      const dispo = [...newArtisan.disponibilites];
                      dispo[index].heureDebut = e.target.value;
                      setNewArtisan({ ...newArtisan, disponibilites: dispo });
                    }} />
                    <input type="time" className="border p-1 rounded" value={d.heureFin} onChange={(e) => {
                      const dispo = [...newArtisan.disponibilites];
                      dispo[index].heureFin = e.target.value;
                      setNewArtisan({ ...newArtisan, disponibilites: dispo });
                    }} />
                    <input type="checkbox" checked={d.isDisponible} onChange={(e) => {
                      const dispo = [...newArtisan.disponibilites];
                      dispo[index].isDisponible = e.target.checked;
                      setNewArtisan({ ...newArtisan, disponibilites: dispo });
                    }} />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowForm(false)} className="text-gray-500 hover:underline">
                  Annuler
                </button>
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  Ajouter
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
