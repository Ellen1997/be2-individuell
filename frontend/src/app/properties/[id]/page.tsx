"use client";

import type { Property } from "../../../../../types/property";
import SingleProperty from "@/components/Property/SingleProperty";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import React from "react";

type Params = {
  params: Promise<{ id: string }>;
};

export default function PropertyPage({ params }: Params) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const { user, actions } = useUser();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {

      try {
       
        const response = await fetch(`${baseUrl}/api/properties/${id}/`, {
          credentials: "include",
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || "Misslyckades att hämta property");
        }

        const data: Property = await response.json();
        setProperty(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, user]);

  if (loading) return <p>Laddar property...</p>;

  if (error)
    return (
      <div className="p-16">
        <h1 className="text-2xl font-bold text-gray-600">Uthyrningsobjekt detaljsida</h1>
        <p className="text-red-600 mt-4">{error}</p>
      </div>
    );

  if (!property) return null;

  return (
    <div className="p-16">
      <h1 className="text-2xl font-bold mb-4 text-gray-600">Uthyrningsobjekt detaljsida</h1>
      <SingleProperty property={property} />
    </div>
  );
}
