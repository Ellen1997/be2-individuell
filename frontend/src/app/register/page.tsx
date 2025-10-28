"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
    ispropertyowner: false,
    isadmin: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Kunde inte registrera användare");
      }

      alert("Registrering lyckades! Du kan nu logga in.");
      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleRegister}
        className="bg-white shadow-md rounded-xl p-6 w-full max-w-sm"
      >
        <h1 className="text-xl font-semibold mb-4 text-center">Registrera dig</h1>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        <label className="block mb-2 text-sm font-medium">Namn</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border rounded-md p-2 mb-3"
        />

        <label className="block mb-2 text-sm font-medium">E-post</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border rounded-md p-2 mb-3"
        />

        <label className="block mb-2 text-sm font-medium">Lösenord</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full border rounded-md p-2 mb-3"
        />

        <label className="block mb-2 text-sm font-medium">Telefonnummer</label>
        <input
          type="tel"
          name="phone_number"
          value={form.phone_number}
          onChange={handleChange}
          className="w-full border rounded-md p-2 mb-3"
        />

        {/* <div className="flex items-center mb-4">
          <input
            type="checkbox"
            name="ispropertyowner"
            checked={form.ispropertyowner}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-sm">Jag är en Property Owner</label>
        </div> */}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? "Registrerar..." : "Registrera"}
        </button>

        <p className="text-sm mt-4 text-center">
          Har du redan ett konto?{" "}
          <a href="/login" className="text-blue-600 underline">
            Logga in här
          </a>
        </p>
      </form>
    </div>
  );
}