import { useParams } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { useEffect, useState } from 'react';

const ArtisanDetail = () => {
  const { id } = useParams(); // on récupère l'ID depuis l'URL
  const [artisan, setArtisan] = useState(null);

  useEffect(() => {
    // 💡 Données simulées (mock) — remplacer par API plus tard
    const mockData = {
      id,
      nom: 'Ali Bensaid',
      telephone: '06 12 34 56 78',
      langue: 'Français',
      noteMoyenne: 4.5,
      adresse: {
        rue: '12 rue des Lilas',
        ville: 'Paris',
        codePostal: '75000',
        pays: 'France',
      },
      services: [
        { nom: 'Plomberie', prixUnitaire: 50, dureeEstimee: '1h30' },
        { nom: 'Débouchage', prixUnitaire: 30, dureeEstimee: '45min' },
      ],
      disponibilites: [
        { jour: 'Lundi', heureDebut: '09:00', heureFin: '12:00', isDisponible: true },
        { jour: 'Mardi', heureDebut: '14:00', heureFin: '18:00', isDisponible: false },
      ],
      commandes: [
        { dateCommande: '2024-06-12', statut: 'terminée', description: 'Réparation lavabo', prixTotal: 80 },
        { dateCommande: '2024-06-19', statut: 'en attente', description: 'Pose robinet', prixTotal: 45 },
      ]
    };

    setArtisan(mockData);
  }, [id]);

  if (!artisan) return <div>Chargement...</div>;

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Détail Artisan</h1>

      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Infos générales</h2>
        <p><strong>Nom :</strong> {artisan.nom}</p>
        <p><strong>Téléphone :</strong> {artisan.telephone}</p>
        <p><strong>Langue :</strong> {artisan.langue}</p>
        <p><strong>Note moyenne :</strong> {artisan.noteMoyenne}</p>
      </div>

      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Adresse</h2>
        <p>{artisan.adresse.rue}, {artisan.adresse.ville} {artisan.adresse.codePostal}, {artisan.adresse.pays}</p>
      </div>

      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Services</h2>
        <ul className="list-disc pl-5">
          {artisan.services.map((s, index) => (
            <li key={index}>
              {s.nom} — {s.prixUnitaire}€ ({s.dureeEstimee})
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Disponibilités</h2>
        <ul className="list-disc pl-5">
          {artisan.disponibilites.map((d, index) => (
            <li key={index}>
              {d.jour} — {d.heureDebut} à {d.heureFin} ({d.isDisponible ? 'Disponible' : 'Indisponible'})
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Commandes</h2>
        <ul className="list-disc pl-5">
          {artisan.commandes.map((c, index) => (
            <li key={index}>
              {c.dateCommande} — {c.description} — {c.statut} — {c.prixTotal}€
            </li>
          ))}
        </ul>
      </div>
    </AdminLayout>
  );
};

export default ArtisanDetail;
