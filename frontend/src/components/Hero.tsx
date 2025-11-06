"use client";

import React from "react";
import { useUser } from "@/context/UserContext";

export default function Hero() {
  const { user } = useUser();

  let imageUrl = "https://sverigeinspiration.se/wp-content/uploads/2024/11/20240806_095152-riktad-o-exponering-1280x640.jpg";
  let title = "Säng&Frukost AB";
  let title2 = "Välkommen!";
  let title3 = "";
  let subtitle = "Trött på november? Registrera dig eller logga in och boka ett boende långt bort från kylan!";

  if (user?.isadmin) {
    imageUrl = "https://sverigeinspiration.se/wp-content/uploads/2024/11/20240806_095152-riktad-o-exponering-1280x640.jpg";
    title = "Välkommen till Adminpanelen";
    title2 = "";
    title3 = "Säng&Frukost AB";
    subtitle = "Hantera användare, bokningar och properties";
  } else if (user?.ispropertyowner) {
    imageUrl = "https://sverigeinspiration.se/wp-content/uploads/2024/11/20240806_095152-riktad-o-exponering-1280x640.jpg";
    title = `Välkommen ${user.name}`
    title2 = "";
    title3 = "Säng&Frukost AB";
    subtitle = "Se och hantera dina properties och bokningar.";
  } else if (user) {
    imageUrl = "https://sverigeinspiration.se/wp-content/uploads/2024/11/20240806_095152-riktad-o-exponering-1280x640.jpg";
    title = `Välkommen ${user.name}`;
    title2 = "";
    title3 = "Säng&Frukost AB";
    subtitle = "Utforska våra properties och boka enkelt";
  }

  return (
    <div className="relative w-full h-64 md:h-96">
     
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
         <h1 className="text-4xl md:text-2xl font-bold">{title3}</h1>
        <h1 className="text-4xl md:text-5xl font-bold">{title}</h1>
        <h1 className="text-3xl md:text-5xl font-bold">{title2}</h1>
        <p className="mt-2 md:mt-4 text-lg md:text-2xl">{subtitle}</p>
      </div>
    </div>
  );
}
