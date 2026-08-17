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
  /** Nav header: logo trong suốt (không nền trắng mặc định của file logo.png) */
  header: {
    width: 300,
    height: 96,
    className: "h-[66px] w-auto bg-transparent sm:h-[74px] md:h-[82px]",
    src: "/logo-transparent.png",
  },
  /** Footer: giữ logo gốc (có nền), không dùng bản transparent */
  footer: {
    width: 260,
    height: 88,
    className: "h-20 sm:h-24 w-auto rounded-xl bg-white object-contain p-1.5",
    src: "/logo.png",
  },
  admin: {
    width: 150,
    height: 48,
    className: "h-11 w-auto bg-transparent",
    src: "/logo-transparent.png",
  },
  login: {
    width: 220,
    height: 72,
    className: "h-[72px] w-auto bg-transparent",
    src: "/logo-transparent.png",
  },
  compact: {
    width: 52,
    height: 52,
    className: "h-11 w-11 object-contain bg-transparent",
    src: "/logo-transparent.png",
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
