import Image from "next/image";
import Link from "next/link";

export function NavbarLogo() {
  return (
    <Link href="/" className="flex items-center">
      <Image
        src="/quetzal_logo_no_bg.png"
        alt="Clube Quetzal"
        width={140}
        height={50}
        className="h-10 w-auto"
        priority
      />
    </Link>
  );
}
