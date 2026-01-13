import { Suspense } from 'react';

export default function MyPageOrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense>{children}</Suspense>;
}
