export default function Logo({ onlyIcon = false }: { onlyIcon?: boolean }) {
  if (onlyIcon) {
    return (
      <>
        <img src="/icon_light.svg" alt="Elrond Dev Hub" className="dark:hidden" />
        <img src="/icon_dark.svg" alt="Elrond Dev Hub" className="hidden dark:block" />
      </>
    );
  } else {
    return (
      <>
        <img src="/logo_light.svg" alt="Elrond Dev Hub" className="dark:hidden" />
        <img src="/logo_dark.svg" alt="Elrond Dev Hub" className="hidden dark:block" />
      </>
    );
  }
}
