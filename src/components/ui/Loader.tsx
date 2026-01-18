interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size: number;
  color?: string;
  label?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  size,
  color = 'currentColor',
  label,
  className = '',
  ...props
}) => {
  const textSize = Math.max(12, Math.floor(size * 0.4));

  return (
    <div
      {...props}
      className={`flex items-center gap-2 ${className}`}
      style={{ height: size }}
    >
      <svg
        className="animate-spin shrink-0"
        style={{ width: size, height: size }}
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

      {label && (
        <span style={{ fontSize: textSize }} className="font-medium">
          {label}
        </span>
      )}
    </div>
  );
};
