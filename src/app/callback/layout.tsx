import { Suspense } from "react";

export default function CallbackLayout({ children }: { children: React.ReactNode }) {
  return <Suspense>{children}</Suspense>;
}
