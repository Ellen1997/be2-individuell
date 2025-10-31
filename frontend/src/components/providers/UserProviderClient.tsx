"use client";

import { UserProvider } from "@/context/UserContext";

export default function UserProviderClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserProvider>{children}</UserProvider>;
}