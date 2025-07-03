import { useState, useEffect } from 'react';
import { IconContext } from 'react-icons';

const StatCard = ({ title, value, icon, color, trend, trendValue, description, loading = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    if (!loading && typeof value === 'number') {
      const targetValue = value;
      const duration = 1000;
      const steps = 60;
      const increment = targetValue / steps;
      let currentValue = 0;
      
      const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
          setDisplayValue(targetValue);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(currentValue));
        }
      }, duration / steps);
      
      return () => clearInterval(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value, loading]);

  const getColorClasses = (color) => {
    const colorMap = {
      'primary': 'from-primary-500 to-primary-600',
      'success': 'from-success-500 to-success-600',
      'warning': 'from-warning-500 to-warning-600',
      'danger': 'from-danger-500 to-danger-600',
      'secondary': 'from-secondary-500 to-secondary-600',
      'blue': 'from-blue-500 to-blue-600',
      'green': 'from-green-500 to-green-600',
      'red': 'from-red-500 to-red-600',
      'yellow': 'from-yellow-500 to-yellow-600'
    };
    return colorMap[color] || colorMap.primary;
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return '↗';
    if (trend === 'down') return '↘';
    return '→';
  };

  const getTrendColor = (trend) => {
    if (trend === 'up') return 'text-success-600';
    if (trend === 'down') return 'text-danger-600';
    return 'text-secondary-600';
  };

  return (
    <div className={`card-hover p-6 animate-fade-in ${isVisible ? 'animate-slide-up' : ''}`}>
      {/* Loading skeleton */}
      {loading && (
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-secondary-200 rounded w-24"></div>
            <div className="h-8 w-8 bg-secondary-200 rounded"></div>
          </div>
          <div className="h-8 bg-secondary-200 rounded w-16 mb-2"></div>
          <div className="h-3 bg-secondary-200 rounded w-32"></div>
        </div>
      )}

      {/* Content */}
      {!loading && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-secondary-600 uppercase tracking-wide">
              {title}
            </h3>
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${getColorClasses(color)} flex items-center justify-center text-white shadow-soft`}>
              {icon}
            </div>
          </div>

          {/* Value */}
          <div className="mb-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-secondary-800">
                {typeof displayValue === 'number' ? displayValue.toLocaleString() : displayValue}
              </span>
              {trend && (
                <div className={`flex items-center space-x-1 text-sm font-medium ${getTrendColor(trend)}`}>
                  <span className="text-lg">{getTrendIcon(trend)}</span>
                  {trendValue && (
                    <span>{trendValue}</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {description && (
            <p className="text-sm text-secondary-500">
              {description}
            </p>
          )}

          {/* Progress bar for trend visualization */}
          {trend && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-secondary-500 mb-1">
                <span>Progression</span>
                <span>{trendValue}</span>
              </div>
              <div className="w-full bg-secondary-200 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-1000 ${
                    trend === 'up' ? 'bg-success-500' : 
                    trend === 'down' ? 'bg-danger-500' : 'bg-secondary-400'
                  }`}
                  style={{ 
                    width: trend === 'up' ? '75%' : 
                           trend === 'down' ? '25%' : '50%' 
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* Hover effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
        </>
      )}
    </div>
  );
};

export default StatCard;
