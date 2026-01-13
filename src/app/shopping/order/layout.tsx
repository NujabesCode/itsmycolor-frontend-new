import { Suspense } from "react";

export default function ShoppingOrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense>{children}</Suspense>;
}
