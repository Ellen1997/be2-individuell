"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

         localStorage.setItem("user", JSON.stringify(data.user));
         localStorage.setItem("isadmin", data.user.isadmin);    
         localStorage.setItem("ispropertyowner", data.user.ispropertyowner); 
         localStorage.setItem("session", JSON.stringify(data.session));

            router.push("/");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
    
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 w-full max-w-sm"
      >
        <h1 className="text-xl font-semibold mb-4 text-center">Logga in</h1>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        <label className="block mb-2 text-sm font-medium">E-post</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border rounded-md p-2 mb-3"
        />

        <label className="block mb-2 text-sm font-medium">Lösenord</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border rounded-md p-2 mb-4"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? "Loggar in..." : "Logga in"}
        </button>

        <p className="text-sm mt-4 text-center">
          Har du inget konto?{" "}
          <a href="/register" className="text-blue-600 underline">
            Registrera dig här
          </a>
        </p>
      </form>
    </div>
  );
}
