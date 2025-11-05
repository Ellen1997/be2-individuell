"use client";

import Link from "next/link";

interface NavLinksProps {
  guest?: boolean;
  customer?: boolean;
  owner?: boolean;
  admin?: boolean;
}

export default function NavLinks({ guest, customer, owner, admin }: NavLinksProps) {
  let links: { href: string; label: string }[] = [];

  if (guest) {
    links = [
      { href: "/", label: "Hem" },
      { href: "/login", label: "Logga in" },
      { href: "/register", label: "Registrera" },
      { href: "/properties", label: "Utforska boenden" },
    ];
  }

  if (customer) {
    links = [
      { href: "/", label: "Hem" },
      { href: "/properties", label: "Utforska boenden" },
      { href: "/bookings/ownerOfProp", label: "Mina bokningar" },
    ];
  }

  if (owner) {
    links = [
      { href: "/", label: "Hem" },
      { href: "/profile/propOwner", label: "Mina properties" },
      { href: "/properties/new", label: "Lägg till ny property" },
      { href: "/bookings/ownerOfProp", label: "Bokningar av mina bostäder" },
      { href: "/properties", label: "Utforska boenden" },
    ];
  }

  if (admin) {
    links = [
      { href: "/", label: "Hem" },
      { href: "/admin/users", label: "Hantera användare" },
      { href: "/bookings", label: "Hantera Bokningar" },
      { href: "/admin/properties", label: "Hantera properties" }
    ];
  }

  return (
    <nav className="flex gap-4">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

