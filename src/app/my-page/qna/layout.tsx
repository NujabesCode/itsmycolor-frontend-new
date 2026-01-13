import { Suspense } from 'react';

export default function MyPageQnaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense>{children}</Suspense>;
}
