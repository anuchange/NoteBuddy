const Button = ({ children, onClick, type = 'button', variant = 'primary', size = 'default', disabled = false }) => {
    const variants = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      outline: 'border-2 border-gray-300 hover:border-gray-400 text-gray-700',
      destructive: 'bg-red-600 hover:bg-red-700 text-white'
    };
  
    const sizes = {
      default: 'px-4 py-2',
      icon: 'p-2',
      small: 'px-2 py-1 text-sm'
    };
  
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`
          ${variants[variant]}
          ${sizes[size]}
          rounded-lg
          transition-colors
          duration-200
          flex
          items-center
          justify-center
          disabled:opacity-50
          disabled:cursor-not-allowed
        `}
      >
        {children}
      </button>
    );
  };

  export default Button;