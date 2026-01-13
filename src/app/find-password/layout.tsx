import { Suspense } from "react";

export default function FindPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense>{children}</Suspense>;
}