import Link from 'next/link';

interface IButtonProps {
  label: string;
  href?: string;
  disabled?:boolean
}

export default function Button({ label, href, disabled }: IButtonProps) {
  if (href) {
    return (
      <Link href={href}>
        <button disabled={disabled} className="bg-primary dark:bg-primary-dark text-secondary dark:text-secondary-dark font-medium text-xs sm:text-sm py-2 px-4 rounded-md transition-opacity ease-in-out hover:opacity-80">
          {label}
        </button>
      </Link>
    );
  }
  return (
    <button disabled={disabled} className="bg-primary dark:bg-primary-dark text-secondary dark:text-secondary-dark font-medium text-xs sm:text-sm py-2 px-4 rounded-md transition-opacity ease-in-out hover:opacity-80">
      {label}
    </button>
  );
}
