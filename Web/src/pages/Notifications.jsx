import AdminLayout from '../components/AdminLayout';
import { useEffect, useState } from 'react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filtre, setFiltre] = useState('tous');
  const [recherche, setRecherche] = useState('');
  const [afficherNonLues, setAfficherNonLues] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const mockData = [
      {
        id: '1',
        type: 'signalement',
        contenu: 'Comportement inapproprié de l’artisan.',
        dateEnvoi: '2024-06-30T10:00:00Z',
        statut: 'non lu',
        particulier: { prenom: 'Lina', nom: 'Messaoudi' }
      },
      {
        id: '2',
        type: 'avis',
        contenu: 'Excellent travail, rapide et propre.',
        dateEnvoi: '2024-06-29T16:45:00Z',
        statut: 'lu',
        particulier: { prenom: 'Yanis', nom: 'Boualem' }
      },
      {
        id: '3',
        type: 'avis',
        contenu: 'Pas satisfait de la ponctualité.',
        dateEnvoi: '2024-07-01T09:10:00Z',
        statut: 'non lu',
        particulier: { prenom: 'Sami', nom: 'Rahal' }
      }
    ];
    setNotifications(mockData);
  }, []);
  const [toastVisible, setToastVisible] = useState(false);


  const filtrerNotifications = notif => {
    const correspondType = filtre === 'tous' || notif.type === filtre;
    const correspondTexte = notif.contenu.toLowerCase().includes(recherche.toLowerCase());
    const correspondStatut = !afficherNonLues || notif.statut === 'non lu';
    return correspondType && correspondTexte && correspondStatut;
  };

  const notificationsFiltreesTriees = notifications
  .filter(filtrerNotifications)
  .sort((a, b) => new Date(b.dateEnvoi) - new Date(a.dateEnvoi));

  const marquerCommeLu = (id) => {
  setNotifications(prev =>
    prev.map(n => n.id === id ? { ...n, statut: 'lu' } : n)
  );
  setToastVisible(true);
  setTimeout(() => setToastVisible(false), 2000);
};


  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Centre de notifications</h1>

      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <label className="mr-2 font-medium">Filtrer par type :</label>
        <select
          value={filtre}
          onChange={(e) => setFiltre(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="tous">Tous</option>
          <option value="signalement">Signalements</option>
          <option value="avis">Avis</option>
        </select>

        <input
          type="text"
          placeholder="Rechercher..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          className="border px-2 py-1 rounded"
        />

        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={afficherNonLues}
            onChange={() => setAfficherNonLues(prev => !prev)}
          />
          Non lues seulement
        </label>

        <span className="ml-auto text-sm text-gray-600">
          Non lues : {notifications.filter(n => n.statut === 'non lu').length}
        </span>
      </div>

      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Contenu</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Particulier</th>
              <th className="px-4 py-2">Statut</th>
            </tr>
          </thead>
          <tbody>
            {notifications.filter(filtrerNotifications).length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-6">Aucune notification trouvée.</td>
              </tr>
            ) : (
              notifications
                .filter(filtrerNotifications)
                .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                .map(notif => (
                  <tr key={notif.id} className="border-t">
                    <td className="px-4 py-2 font-semibold capitalize">
                      <span className={notif.type === 'signalement' ? 'text-red-600' : 'text-blue-600'}>
                        {notif.type}
                      </span>
                    </td>
                    <td className="px-4 py-2">{notif.contenu}</td>
                    <td className="px-4 py-2">{new Date(notif.dateEnvoi).toLocaleString()}</td>
                    <td className="px-4 py-2">{notif.particulier.prenom} {notif.particulier.nom}</td>
                    <td className="px-4 py-2">
                      {notif.statut === 'non lu' ? (
                        <button
                          onClick={() => marquerCommeLu(notif.id)}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Marquer comme lu
                        </button>
                      ) : (
                        <span className="text-gray-500">lu</span>
                      )}
                    </td>
                  </tr>
                ))
            )}
         </tbody>
        </table>
      </div>

      {/* Toast de confirmation */}
      {toastVisible && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-md animate-bounce">
          Notification marquée comme lue ✅
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          disabled={page === 1}
        >
          Précédent
        </button>

        {Array.from({ length: Math.ceil(notifications.filter(filtrerNotifications).length / itemsPerPage) }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 border rounded ${page === i + 1 ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setPage(p => p + 1)}
          className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          disabled={page >= Math.ceil(notifications.filter(filtrerNotifications).length / itemsPerPage)}
        >
          Suivant
        </button>
      </div>
    </AdminLayout>
  );
};

export default Notifications;
