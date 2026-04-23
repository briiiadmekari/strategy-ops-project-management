import { Button } from './ui/button';
import { Spinner } from './ui/spinner';
import { cn } from '@/lib/utils';

interface CustomButtonProps {
  title: string;
  type: 'button' | 'submit' | 'reset';
  variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size: 'sm' | 'lg' | 'icon' | 'xs' | 'icon-xs' | 'icon-sm' | 'icon-lg' | null | undefined;
  onClick?: () => void;
  isPending?: boolean;
  disabled?: boolean;
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  type,
  variant,
  size,
  onClick,
  isPending = false,
  disabled = false,
  className,
  leftIcon,
  rightIcon,
}) => {
  return (
    <Button
      type={type}
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled || isPending}
      className={cn(className, { 'opacity-50': isPending })}
    >
      {isPending && <Spinner className="mr-2" />}
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {title}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </Button>
  );
};
