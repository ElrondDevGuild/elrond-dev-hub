import Image from "next/image";

export default function Logo({ onlyIcon = false }: { onlyIcon?: boolean }) {
  if (onlyIcon) {
    return (
      <>
        <div className="dark:hidden relative h-5 w-5">
          <Image
            src="/icon_light.svg"
            alt="xDevHub"
            width={20}
            height={20}
            layout="responsive"
          />
        </div>
        <div className="hidden dark:block relative h-5 w-5">
          <Image
            src="/icon_dark.svg"
            alt="xDevHub"
            width={20}
            height={20}
            layout="responsive"
          />
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="dark:hidden relative h-9 w-auto">
          <Image
            src="/logo_light.svg"
            alt="xDevHub"
            width={120}
            height={36}
            layout="intrinsic"
          />
        </div>
        <div className="hidden dark:block relative h-9 w-auto">
          <Image
            src="/logo_dark.svg"
            alt="xDevHub"
            width={120}
            height={36}
            layout="intrinsic"
          />
        </div>
      </>
    );
  }
}
