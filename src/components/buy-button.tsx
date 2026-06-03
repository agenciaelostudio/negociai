"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";

export function BuyButton({
  children,
  ...props
}: ButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      if (!res.ok) throw new Error("checkout");
      const data: { url?: string } = await res.json();
      if (!data.url) throw new Error("sem url");

      if (data.url.startsWith("http")) {
        window.location.href = data.url;
      } else {
        router.push(data.url);
      }
    } catch {
      toast.error("Não foi possível iniciar o pagamento. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleClick} disabled={loading} {...props}>
      {loading ? (
        <>
          <Loader2 className="animate-spin" /> Redirecionando...
        </>
      ) : (
        children
      )}
    </Button>
  );
}
