interface IButtonProps {
  label: string;
}

export default function Button({ label }: IButtonProps) {
  return (
    <button className="bg-primary dark:bg-primary-dark text-secondary dark:text-secondary-dark font-medium text-xs sm:text-sm py-2 px-4 rounded-md">
      {label}
    </button>
  );
}
