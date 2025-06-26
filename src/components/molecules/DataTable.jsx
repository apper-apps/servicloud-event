import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import StatusDot from '@/components/atoms/StatusDot';
import { useLanguage } from '@/hooks/useLanguage';

const DataTable = ({ 
  data = [], 
  columns = [], 
  onRowClick,
  loading = false,
  className = ''
}) => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const { t } = useLanguage();

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const renderCellContent = (item, column) => {
    const value = item[column.key];
    
    switch (column.type) {
      case 'status':
        return (
          <div className="flex items-center space-x-2">
            <StatusDot status={value} />
            <Badge variant={getStatusVariant(value)}>
              {t(value, value)}
            </Badge>
          </div>
        );
      case 'date':
        return new Date(value).toLocaleDateString('es-MX');
      case 'currency':
        return `$${value?.toLocaleString('es-MX')} MXN`;
      case 'badge':
        return <Badge variant="default">{value}</Badge>;
      default:
        return value;
    }
  };

  const getStatusVariant = (status) => {
    const variants = {
      active: 'success',
      inactive: 'default',
      open: 'info',
      inProgress: 'warning',
      resolved: 'success',
      closed: 'default',
      expired: 'danger'
    };
    return variants[status] || 'default';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-surface-200 overflow-hidden">
        <div className="animate-pulse">
          <div className="h-12 bg-surface-50 border-b border-surface-200"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-white border-b border-surface-100 last:border-b-0"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-surface-200 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-50 border-b border-surface-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`
                    px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider
                    ${column.sortable ? 'cursor-pointer hover:bg-surface-100 transition-colors' : ''}
                  `}
                  onClick={column.sortable ? () => handleSort(column.key) : undefined}
                >
                  <div className="flex items-center space-x-1">
                    <span>{t(column.labelKey, column.label)}</span>
                    {column.sortable && (
                      <ApperIcon
                        name={
                          sortField === column.key
                            ? sortDirection === 'asc'
                              ? 'ChevronUp'
                              : 'ChevronDown'
                            : 'ChevronsUpDown'
                        }
                        size={14}
                        className="text-surface-400"
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-surface-200">
            {sortedData.map((item, index) => (
              <motion.tr
                key={item.Id || index}
                className={`
                  table-row-hover transition-all duration-200
                  ${onRowClick ? 'cursor-pointer' : ''}
                `}
                onClick={() => onRowClick?.(item)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-6 py-4 whitespace-nowrap text-sm text-surface-900"
                  >
                    {renderCellContent(item, column)}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
        
        {sortedData.length === 0 && (
          <div className="text-center py-12">
            <ApperIcon name="Database" size={48} className="mx-auto text-surface-300 mb-4" />
            <p className="text-surface-500">{t('noDataFound', 'No se encontraron datos')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;