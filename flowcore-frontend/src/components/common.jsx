import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Loading Spinner Component
 */
export const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const spinner = (
    <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`} />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

/**
 * Button Component
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseClasses = 'font-medium rounded transition focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-300 hover:bg-gray-400 text-gray-800 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {loading ? <LoadingSpinner size="sm" /> : children}
    </button>
  );
};

/**
 * Alert Component
 */
export const Alert = ({ type = 'info', message, onClose = null }) => {
  const typeClasses = {
    info: 'bg-blue-100 border-blue-400 text-blue-700',
    success: 'bg-green-100 border-green-400 text-green-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    error: 'bg-red-100 border-red-400 text-red-700',
  };

  return (
    <div className={`border-l-4 ${typeClasses[type]} px-4 py-3 rounded mb-4`}>
      <div className="flex justify-between items-center">
        <p>{message}</p>
        {onClose && (
          <button onClick={onClose} className="ml-4 font-bold">
            ×
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Badge Component
 */
export const Badge = ({ children, variant = 'info', className = '' }) => {
  const variantClasses = {
    info: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    gray: 'bg-gray-100 text-gray-800',
  };

  return <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}>{children}</span>;
};

/**
 * Card Component
 */
export const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * Modal Component
 */
export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg shadow-lg p-6 ${sizeClasses[size]}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800 text-2xl font-bold">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

/**
 * Pagination Component
 */
export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-center space-x-2 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 border rounded disabled:opacity-50"
      >
        <ChevronUp size={18} />
      </button>
      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 border rounded disabled:opacity-50"
      >
        <ChevronDown size={18} />
      </button>
    </div>
  );
};

/**
 * Table Component
 */
export const Table = ({ columns, data, onEdit, onDelete, loading = false }) => {
  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (data.length === 0) {
    return <div className="text-center text-gray-600 py-8">No data available</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-3 text-left text-sm font-medium text-gray-800">
                {col.label}
              </th>
            ))}
            {(onEdit || onDelete) && <th className="px-6 py-3 text-left text-sm font-medium text-gray-800">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={row.id || idx} className="border-t hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4 text-sm text-gray-800">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-6 py-4 text-sm space-x-4">
                  {onEdit && (
                    <button onClick={() => onEdit(row)} className="text-blue-600 hover:text-blue-800">
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button onClick={() => onDelete(row.id)} className="text-red-600 hover:text-red-800">
                      Delete
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Tooltip Component
 */
export const Tooltip = ({ children, text, position = 'top' }) => {
  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2',
  };

  return (
    <div className="relative inline-block group">
      {children}
      <div
        className={`absolute ${positionClasses[position]} hidden group-hover:block bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap z-10`}
      >
        {text}
      </div>
    </div>
  );
};
