import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const SearchBar = ({ 
  placeholder = "Buscar...", 
  onSearch, 
  className = '',
  ...props 
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(query);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch?.(value);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={`relative max-w-md ${className}`}
      animate={{ scale: isFocused ? 1.02 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <ApperIcon 
            name="Search" 
            size={16} 
            className={`transition-colors duration-200 ${
              isFocused ? 'text-primary' : 'text-surface-400'
            }`} 
          />
        </div>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`
            w-full pl-10 pr-4 py-3 text-sm border border-surface-300 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
            transition-all duration-200
            ${isFocused ? 'shadow-md' : 'shadow-sm'}
          `}
          {...props}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              onSearch?.('');
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-surface-400 hover:text-surface-600"
          >
            <ApperIcon name="X" size={16} />
          </button>
        )}
      </div>
    </motion.form>
  );
};

export default SearchBar;