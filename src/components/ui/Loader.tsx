interface LoaderProps extends React.HTMLAttributes<HTMLSpanElement> {
  sizes: {
    w: number;
    h: number;
  };
  color?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  children,
  sizes,
  color = 'currentColor',
  className = '',
}) => {
  const baseStyles =
    'px-6 py-3 rounded-full font-semibold transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30',
    secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300',
  };

  return (
    <span className={`${className} flex items-center gap-2`}>
      <svg
        className={`animate-spin h-${sizes.h} w-${sizes.w}`}
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill={color}
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      {children ?? 'Processing...'}
    </span>
  );
};
