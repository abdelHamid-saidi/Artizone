import { FaBell } from 'react-icons/fa';

const Topbar = () => {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white shadow">
      <h2 className="text-xl font-semibold text-gray-700">Tableau de bord</h2>
      <div className="flex items-center gap-4">
        <FaBell className="text-gray-500 text-lg cursor-pointer" />
        <img
          src="https://i.pravatar.cc/40"
          alt="Avatar"
          className="w-9 h-9 rounded-full border"
        />
      </div>
    </header>
  );
};

export default Topbar;
