import { SellerProductFormStoreProvider } from "@/providers/SellerProductFormStoreProvider";

export default function SellerProductFormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SellerProductFormStoreProvider>{children}</SellerProductFormStoreProvider>
  );
}
