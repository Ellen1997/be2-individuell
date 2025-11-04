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


  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");

  const [limit, setLimit] = useState(5);
  const [offset, setOffset] = useState(0);
  const [count, setCount] = useState(0);


   useEffect(() => {
    if (user !== undefined) fetchProperties();
  }, [user, offset]);

  const fetchProperties = async () => {
    if (user === null) {
            setError("Du måste vara inloggad för att se properties.");
            setLoading(false);
            return;
        }

        if (user === undefined) {
            return;
        }

    setLoading(true);
    setError(null);

      try {

    const params = new URLSearchParams();

      if (location) params.append("location", location);
      if (sort) params.append("sort", sort);
      if (minPrice !== "") params.append("minPrice", String(minPrice));
      if (maxPrice !== "") params.append("maxPrice", String(maxPrice));

      params.append("limit", String(limit));
      params.append("offset", String(offset));


        const response = await fetch(`${baseUrl}/api/properties?${params.toString()}`, {
          credentials: "include", 
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || "Misslyckades att hämta properties");
        }

        const data: PaginatedListResponse<Property> = await response.json();
        setProperties(data.data);
        setCount(data.count);
        setLimit(data.limit);
        setOffset(data.offset);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

      const resetFilters = () => {
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setSort("");
    fetchProperties();
  };

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

      <div className="flex gap-4 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Plats"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <input
          type="number"
          placeholder="Min pris"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : "")}
          className="border rounded px-2 py-1"
        />
        <input
          type="number"
          placeholder="Max pris"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : "")}
          className="border rounded px-2 py-1"
        />
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="border rounded px-2 py-1">
          <option value="price_asc">Pris (stigande)</option>
          <option value="price_desc">Pris (fallande)</option>
          <option value="newest">Senast skapad</option>
        </select>
        <button
          onClick={fetchProperties}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Filtrera
        </button>

        <button
          onClick={resetFilters}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        >
          Återställ filter
        </button>
      </div>
      
      <PropertyList properties={properties} />

      <div className="flex justify-between items-center mt-8">
  <button
    onClick={() => {
      if (offset - limit >= 0) {
        setOffset(offset - limit);
      }
    }}
    disabled={offset === 0}
    className={`px-4 py-2 rounded ${offset === 0 ? "bg-gray-300" : "bg-blue-600 text-white hover:bg-blue-700"}`}
  >
    Föregående
  </button>

  <p>
    Sida {Math.floor(offset / limit) + 1} av {Math.ceil(count / limit) || 1}
  </p>

  <button
    onClick={() => {
      if (offset + limit < count) {
        setOffset(offset + limit);
      }
    }}
    disabled={offset + limit >= count}
    className={`px-4 py-2 rounded ${offset + limit >= count ? "bg-gray-300" : "bg-blue-600 text-white hover:bg-blue-700"}`}
  >
    Nästa
  </button>
</div>

    </div>
  );
}



