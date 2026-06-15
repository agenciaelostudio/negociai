import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function EntrarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <main className="grid min-h-screen place-items-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </main>
      }
    >
      {children}
    </Suspense>
  );
}
