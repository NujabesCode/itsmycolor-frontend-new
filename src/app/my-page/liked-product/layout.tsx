import { Suspense } from "react";

export default function LikedProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense>{children}</Suspense>;
}