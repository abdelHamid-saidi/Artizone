import AdminLayout from '../components/AdminLayout';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const CommandeDetail = () => {
  const { id } = useParams();
  const [commande, setCommande] = useState(null);

  useEffect(() => {
    const mockCommande = {
      id,
      dateCommande: '2024-07-01T09:00:00Z',
      statut: 'en attente',
      description: 'Réparation de fuite sous évier',
      prixTotal: 120.5,
      particulier: { nom: 'Karim', prenom: 'Benali', telephone: '0600000000' },
      service: { nom: 'Plomberie', description: 'Réparation fuite' },
      artisan: { nom: 'Sami', prenom: 'Aziz' },
      disponibilite: { jour: 'Lundi', heureDebut: '09:00', heureFin: '12:00' }
    };
    setCommande(mockCommande);
  }, [id]);

  if (!commande) return <p className="p-4">Chargement...</p>;

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Détail de la commande</h1>
      <div className="bg-white shadow p-6 rounded">
        <p><strong>Date :</strong> {new Date(commande.dateCommande).toLocaleString()}</p>
        <p><strong>Statut :</strong> {commande.statut}</p>
        <p><strong>Description :</strong> {commande.description}</p>
        <p><strong>Prix total :</strong> {commande.prixTotal} €</p>
        <hr className="my-4" />
        <p><strong>Client :</strong> {commande.particulier.prenom} {commande.particulier.nom} ({commande.particulier.telephone})</p>
        <p><strong>Service :</strong> {commande.service.nom} - {commande.service.description}</p>
        <p><strong>Artisan :</strong> {commande.artisan.prenom} {commande.artisan.nom}</p>
        <p><strong>Disponibilité :</strong> {commande.disponibilite.jour} de {commande.disponibilite.heureDebut} à {commande.disponibilite.heureFin}</p>
      </div>
    </AdminLayout>
  );
};

export default CommandeDetail;
