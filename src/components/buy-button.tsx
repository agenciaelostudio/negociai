"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function BuyButton({
  children,
  ...props
}: ButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      // Obtém o email do usuário do lado do cliente
      // (onde a sessão SEMPRE está disponível, ao contrário do server-side)
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const email = user?.email || "";

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
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