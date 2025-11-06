export default function Footer() {
  return (
    <footer
      className="relative text-white py-12 mt-16"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-2">Tack för att du besöker oss</h2>
        <p className="text-gray-200 mb-4">
          Hitta ditt nästa drömboende – året runt, var du än befinner dig.
        </p>

        <p className="text-sm text-gray-300">
          © {new Date().getFullYear()} Säng&Frukost AB
        </p>
      </div>
    </footer>
  );
}

