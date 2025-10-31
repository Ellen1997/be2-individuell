"use client";

import PropertyList from "@/components/Property/propertyList";
import { Property } from "../../../../types/property";
import { PaginatedListResponse } from "../../../../types/general";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";

export default function PropertiesPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const { user, actions } = useUser();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
        if (user === null) {
            setError("Du måste vara inloggad för att se properties.");
            setLoading(false);
            return;
        }

        if (user === undefined) {
            return;
        }

      try {
        const response = await fetch(`${baseUrl}/api/v1/properties/`, {
          credentials: "include", 
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || "Misslyckades att hämta properties");
        }

        const data: PaginatedListResponse<Property> = await response.json();
        setProperties(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [user, actions]);

  if (loading) return <p>Laddar properties...</p>;

  if (error)
    return (
      <div className="p-16">
        <Link href="/" className="text-blue-600 underline">
          Tillbaka till startsidan
        </Link>
        <h1 className="text-2xl font-bold">PROPERTIES</h1>
        <p className="text-red-600 mt-4">{error}</p>
      </div>
    );

  return (
    <div className="p-16">
      <Link href="/" className="text-blue-600 underline">
        Tillbaka till startsidan
      </Link>
      <h1 className="text-2xl font-bold">PROPERTY</h1>
      <PropertyList properties={properties} />
    </div>
  );
}



