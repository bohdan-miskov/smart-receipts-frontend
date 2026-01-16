import { Loader } from '../ui/Loader';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  isLoading,
  onClick,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const baseStyles =
    'px-6 py-3 rounded-full font-semibold transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30',
    secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={isLoading || props.disabled}
    >
      {isLoading ? (
        <Loader sizes={{ h: 5, w: 5 }}>Processing...</Loader>
      ) : (
        children
      )}
    </button>
  );
};
