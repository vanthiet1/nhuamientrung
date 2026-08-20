import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  href?: string | null;
  /** header | footer | admin | login | compact */
  variant?: "header" | "footer" | "admin" | "login" | "compact";
  className?: string;
  priority?: boolean;
};

const sizes = {
  header: {
    width: 240,
    height: 72,
    className: "h-11 sm:h-13 md:h-[52px] w-auto bg-transparent",
    src: "/logo.webp",
  },
  footer: {
    width: 240,
    height: 72,
    className: "h-14 sm:h-16 w-auto rounded-xl bg-white object-contain p-1.5",
    src: "/logo.webp",
  },
  admin: {
    width: 150,
    height: 48,
    className: "h-10 w-auto bg-transparent",
    src: "/logo.webp",
  },
  login: {
    width: 220,
    height: 72,
    className: "h-14 w-auto bg-transparent",
    src: "/logo.webp",
  },
  compact: {
    width: 52,
    height: 52,
    className: "h-10 w-10 object-contain bg-transparent",
    src: "/logo.webp",
  },
} as const;

export default function BrandLogo({
  href = "/",
  variant = "header",
  className = "",
  priority = false,
}: BrandLogoProps) {
  const s = sizes[variant];

  const img = (
    <Image
      src={s.src}
      alt="Bao Bì Thành Phát"
      width={s.width}
      height={s.height}
      priority={priority}
      unoptimized
      className={`${s.className} object-contain object-left ${className}`}
    />
  );

  if (href === null) {
    return img;
  }

  return (
    <Link
      href={href}
      className="inline-flex shrink-0 items-center transition hover:opacity-90"
      aria-label="Bao Bì Thành Phát - Trang chủ"
    >
      {img}
    </Link>
  );
}
