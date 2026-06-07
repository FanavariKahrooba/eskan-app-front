import { cn } from "@/utils/tools";
import Link from "next/link";
import { ReactNode } from "react";

const HeaderNavLink = ({
  href,
  title,
  icon,
  className,
}: {
  href: string;
  title: string;
  icon: any | ReactNode;
  className?: string;
}) => {
  return (
    <Link
      href={href}
      className={cn(
        `nav-link flex items-center justify-center gap-1 transition hover:text-primary`,
        className
      )}
    >
      {/* <span className="w-5 h-5">{icon}</span> */}
      <span>{title}</span>
    </Link>
  );
};

export default HeaderNavLink;
