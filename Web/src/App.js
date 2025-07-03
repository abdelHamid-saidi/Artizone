import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Commandes from './pages/Commandes';
import Utilisateurs from './pages/Utilisateurs';
import Signalements from './pages/Notifications';
import CommandeDetail from './pages/CommandeDetail';
import NotFound from './pages/NotFound';
import Artisans from './pages/Artisans';
import ArtisanDetail from './pages/ArtisanDetail';


function App() {
 return (
   <Router>
     <Routes>
       <Route path="/" element={<Login />} />
       <Route path="/dashboard" element={<Dashboard />} />
       <Route path="/commandes" element={<Commandes />} />
       <Route path="/commandes/:id" element={<CommandeDetail />} />
       <Route path="/utilisateurs" element={<Utilisateurs />} />
       <Route path="/signalements" element={<Signalements />} />
       <Route path="/artisans" element={<Artisans />} />
       <Route path="/artisans/:id" element={<ArtisanDetail />} />
       <Route path="*" element={<NotFound />} />
     </Routes>
   </Router>
 ); 

}

export default App;
