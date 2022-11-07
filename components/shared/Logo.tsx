export default function Logo({ onlyIcon = false }: { onlyIcon?: boolean }) {
  if (onlyIcon) {
    return (
      <>
        <img src="/icon_light.svg" alt="xDevHub" className="dark:hidden h-5" />
        <img src="/icon_dark.svg" alt="xDevHub" className="hidden dark:block h-5" />
      </>
    );
  } else {
    return (
      <>
        <img src="/logo_light.svg" alt="xDevHub" className="dark:hidden h-9" />
        <img src="/logo_dark.svg" alt="xDevHub" className="hidden dark:block h-9" />
      </>
    );
  }
}
