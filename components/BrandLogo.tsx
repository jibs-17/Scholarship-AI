import Image from "next/image";

const sizesPx = { sm: 48, md: 96, lg: 128 } as const;

type BrandLogoProps = {
  size?: keyof typeof sizesPx;
  className?: string;
  priority?: boolean;
};

/**
 * Circular badge with a soft rainbow ring — logo scales inside with object-contain.
 */
export function BrandLogo({
  size = "md",
  className = "",
  priority = false,
}: BrandLogoProps) {
  const px = sizesPx[size];

  return (
    <div
      className={`inline-flex rounded-full bg-gradient-to-br from-sky-400 via-violet-400 to-amber-400 p-[3px] shadow-playful sm:p-[2.5px] ${className}`}
    >
      <div
        className="relative overflow-hidden rounded-full bg-white shadow-inner"
        style={{ width: px, height: px }}
      >
        <Image
          src="/scholarship-logo.png"
          alt="ScholarShip AI logo"
          fill
          sizes={`${px}px`}
          className="object-contain object-center p-[6%]"
          priority={priority}
        />
      </div>
    </div>
  );
}
