"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks() {
    const pathname = usePathname();
    const links = [
        { href: '/', label: 'Home' },
        { href: '/properties', label: 'Properties' },
        { href: '/profileusers', label: 'Users' },
        { href: '/bookings', label: 'Bookings' },
        { href: '/login', label: 'Login' },
        { href: '/register', label: 'Register' },
    ];

    return (
        <nav className="flex space-x-4"> 
            {links.map(({href, label}) => (
                <Link 
                    key={href} 
                    href={href} 
                    className={`${pathname === href ? 'text-blue-800 font-bold underline' : 'text-blue-600 hover:underline'}
                     hover:underline`}
                     >
                        {label}
                     </Link>
            ))}
        
        </nav>
    );
}
