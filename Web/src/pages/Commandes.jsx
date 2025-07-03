import AdminLayout from '../components/AdminLayout';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Commandes = () => {
  const [commandes, setCommandes] = useState([]);
  const [filtre, setFiltre] = useState('toutes');

  useEffect(() => {
    const mockCommandes = [
      {
        id: '1',
        dateCommande: '2024-07-01T09:00:00Z',
        statut: 'en attente',
        prixTotal: 120.5,
        particulier: { nom: 'Benali', prenom: 'Karim' },
        service: { nom: 'Plomberie' }
      },
      {
        id: '2',
        dateCommande: '2024-06-25T14:00:00Z',
        statut: 'terminée',
        prixTotal: 75.0,
        particulier: { nom: 'Slimani', prenom: 'Nora' },
        service: { nom: 'Électricité' }
      },
      {
        id: '3',
        dateCommande: '2024-07-02T10:00:00Z',
        statut: 'acceptée',
        prixTotal: 95.0,
        particulier: { nom: 'Ziane', prenom: 'Tarek' },
        service: { nom: 'Peinture' }
      }
    ];
    setCommandes(mockCommandes);
  }, []);

  const filtrerCommandes = (cmd) => {
    const dateCommande = new Date(cmd.dateCommande);
    const maintenant = new Date();

    switch (filtre) {
      case 'en attente':
        return cmd.statut === 'en attente';
      case 'acceptées':
        return cmd.statut === 'acceptée';
      case 'passées':
        return dateCommande < maintenant;
      case 'récentes':
        return (maintenant - dateCommande) / (1000 * 60 * 60 * 24) <= 7;
      default:
        return true;
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Liste des commandes</h1>

      <div className="mb-4">
        <label className="mr-2 font-medium">Filtrer par :</label>
        <select
          value={filtre}
          onChange={(e) => setFiltre(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="toutes">Toutes</option>
          <option value="en attente">En attente</option>
          <option value="acceptées">Acceptées</option>
          <option value="passées">Passées</option>
          <option value="récentes">Récentes</option>
        </select>
      </div>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Client</th>
              <th className="px-4 py-2">Service</th>
              <th className="px-4 py-2">Statut</th>
              <th className="px-4 py-2">Prix total</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {commandes.filter(filtrerCommandes).map((cmd) => (
              <tr key={cmd.id} className="border-t">
                <td className="px-4 py-2">{new Date(cmd.dateCommande).toLocaleString()}</td>
                <td className="px-4 py-2">{cmd.particulier.prenom} {cmd.particulier.nom}</td>
                <td className="px-4 py-2">{cmd.service.nom}</td>
                <td className="px-4 py-2">
                {cmd.statut}
                {cmd.statut === 'en attente' && (
                  <button
                    onClick={() => {
                      if (window.confirm('Accepter cette commande ?')) {
                        setCommandes(prev => prev.map(c => c.id === cmd.id ? { ...c, statut: 'acceptée' } : c));
                      }
                    }}
                    className="ml-2 px-2 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    Accepter
                  </button>
                )}
              </td>
                <td className="px-4 py-2">{cmd.prixTotal} €</td>
                <td className="px-4 py-2">
                  <Link
                    to={`/commandes/${cmd.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Détails
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default Commandes;
