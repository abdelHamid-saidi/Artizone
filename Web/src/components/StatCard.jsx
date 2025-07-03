import { IconContext } from 'react-icons';

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className={`p-5 rounded-xl shadow bg-white border-l-4 ${color}`}>
      <div className="flex items-center gap-4">
        <IconContext.Provider value={{ size: '1.8em' }}>
          <div className="text-gray-700">{icon}</div>
        </IconContext.Provider>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h2 className="text-2xl font-bold text-gray-800">{value}</h2>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
