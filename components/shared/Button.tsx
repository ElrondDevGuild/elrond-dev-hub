import Link from 'next/link';
import React from 'react';
import { useMemo } from 'react';

type BtnTheme = "primary" | "secondary";
interface IButtonProps {
  icon?: any;
  label: string;
  href?: string;
  disabled?: boolean;
  theme?: BtnTheme;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  type?: "button" | "submit" | "reset";
  extraClasses?: string;
}

const ButtonComponent = (btnProps: IButtonProps) => {
  const btnClasses = useMemo(() => {
    let classes = "";
    if (btnProps.theme === "secondary") {
      classes = "bg-transparent text-theme-text dark:text-theme-text-dark border-theme-text dark:border-theme-text-dark";
    } else {
      classes = "bg-primary dark:bg-primary-dark  text-secondary dark:text-secondary-dark border-transparent";
    }

    return classes + " " + btnProps.extraClasses;
  }, [btnProps.extraClasses, btnProps.theme]);

  return (
    <button
        disabled={btnProps?.disabled}
        className={`border font-medium text-xs sm:text-sm py-2 px-4 rounded-md transition-opacity ease-in-out hover:opacity-80 flex items-center disabled:opacity-80 disabled:cursor-not-allowed ${btnClasses}`}
        {...{onClick: btnProps?.onClick}}
    >
      {btnProps.icon && (
        <span className="pr-2">
          <btnProps.icon />
        </span>
      )}{" "}
      {btnProps.label}
    </button>
  );
};

export default function Button(btnProps: IButtonProps) {
  if (btnProps?.href) {
    if (btnProps.href.startsWith("http")) {
      return (
        <a href={btnProps.href} target="_blank" rel="noreferrer">
          <ButtonComponent {...btnProps} />
        </a>
      );
    }
    return (
      <Link href={btnProps.href}>
        <a>
          <ButtonComponent {...btnProps} />
        </a>
      </Link>
    );
  }
  return <ButtonComponent {...btnProps} />;
}
