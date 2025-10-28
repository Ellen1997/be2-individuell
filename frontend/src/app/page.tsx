import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1>
          FRONTEND OSV individuella uppg. 
        </h1>

        <Link href="/properties" className="text-blue-600 underline">
          Gå till Propertysida
        </Link>
        <Link href="/profileusers" className="text-blue-600 underline">
          Gå till Usersida
        </Link>
        <Link href="/bookings" className="text-blue-600 underline">
          Gå till Bookingsida
        </Link>
      
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <h5>FOOTER </h5>
      </footer>
    </div>
  );
}
