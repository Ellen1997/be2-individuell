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
      { href: "/login", label: "Logga in" },
      { href: "/register", label: "Registrera" },
      { href: "/properties", label: "Utforska boenden" },
    ];
  }

  if (customer) {
    links = [
      { href: "/properties", label: "Utforska boenden" },
      { href: "/profile/mybookings", label: "Mina bokningar" },
      { href: "/profile", label: "Profil" }

    ];
  }

  if (owner) {
    links = [
      { href: "/profile/propOwner", label: "Mina properties" },
      { href: "/properties/new", label: "Lägg till ny property" },
      { href: "/bookings/ownerOfProp", label: "Bokningar av mina bostäder" },
      { href: "/properties", label: "Utforska boenden" },
      { href: "/profile", label: "Profil" }
    ];
  }

  if (admin) {
    links = [
  
      { href: "/admin/users", label: "Hantera användare" },
      { href: "/profileusers", label: "Detaljer användare"},
      { href: "/bookings", label: "Hantera Bokningar" },
      { href: "/admin/properties", label: "Hantera properties" },
      { href: "/admin", label: "Admin" },

    ];
  }

  return (
    <nav className="flex gap-4">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-balance text-gray-700 hover:text-blue-600 transition-colors font-medium"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

