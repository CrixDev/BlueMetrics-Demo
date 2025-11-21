import { TrendingUp, TrendingDown } from 'lucide-react';

const MetricCard = ({ title, value, unit, comparison, comparisonLabel, trend, icon: Icon, iconColor = 'text-blue-600' }) => {
  const isPositive = trend === 'up';
  const isNegative = trend === 'down';
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col">
        {/* Título con icono */}
        <div className="flex items-center gap-2 mb-3">
          {Icon && <Icon className={`w-5 h-5 ${iconColor}`} />}
          <p className="text-sm text-gray-600">{title}</p>
        </div>
        
        {/* Valor principal */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold text-gray-900">
            {value}
          </span>
          
          <span className="text-lg text-gray-600">{unit}</span>
        </div>
       
        
        {comparison !== undefined && (
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${
              isPositive ? 'bg-green-50' : isNegative ? 'bg-red-50' : 'bg-gray-50'
            }`}>
              {isPositive && <TrendingUp className="w-4 h-4 text-green-600" />}
              {isNegative && <TrendingDown className="w-4 h-4 text-red-600" />}
              <span className={`text-sm font-semibold ${
                isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'
              }`}>
                {comparison > 0 ? '+' : ''}{comparison}%
              </span>
            </div>
            <span className="text-xs text-gray-500">{comparisonLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
