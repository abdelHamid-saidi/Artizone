import { useState } from 'react';
import logo from '../assets/logo.png'; // Place ton logo dans src/assets/logo.png

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Tentative de connexion avec', email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-200 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md animate-fade">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Artizone Logo" className="w-20 h-20 mb-2" />
          <h2 className="text-2xl font-semibold text-gray-800">Connexion Admin</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
