import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';

const StatCard = ({ 
  title, 
  value, 
  icon, 
  color = 'primary',
  trend,
  trendValue,
  className = ''
}) => {
  const colorClasses = {
    primary: 'text-primary bg-primary/10',
    secondary: 'text-secondary bg-secondary/10',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    danger: 'text-accent bg-accent/10',
    info: 'text-info bg-info/10'
  };

  const trendColors = {
    up: 'text-success',
    down: 'text-accent',
    neutral: 'text-surface-500'
  };

  return (
    <Card hover className={`relative overflow-hidden ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-surface-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-surface-900">{value}</p>
          
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${trendColors[trend]}`}>
              <ApperIcon 
                name={trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus'} 
                size={16} 
                className="mr-1" 
              />
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <ApperIcon name={icon} size={24} />
        </div>
      </div>

      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-16 h-16 bg-gradient-to-br from-surface-100 to-surface-200 rounded-full opacity-50" />
    </Card>
  );
};

export default StatCard;