type Variant = 'solid' | 'outline';

interface SmallButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: Variant;       
  className?: string;
}

export default function SmallButton({
  children,
  variant = 'solid',
  className = '',
  ...props
}: SmallButtonProps) {
  const base = 'px-4 py-2 rounded-md font-medium transition focus:outline-none';
  const styles: Record<Variant, string> = {
    solid:
      'bg-green-500 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-300',
    outline:
      'border border-green-500 text-green-500 bg-white hover:bg-green-700 hover:text-white focus:ring-2 focus:ring-green-300',
  };

  return (
    <button
      className={`${base} ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
