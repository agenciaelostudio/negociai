import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/painel";

  // Usar a URL oficial do site para evitar que o Next.js redirecione para localhost em produção
  const siteUrlRaw = process.env.NEXT_PUBLIC_SITE_URL ?? "https://negociai-blue.vercel.app";
  const siteUrl = siteUrlRaw.replace(/\uFEFF/g, "").trim().replace(/\/$/, "");

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${siteUrl}${next}`);
      } else {
        const errorMsg = encodeURIComponent(error.message);
        return NextResponse.redirect(`${siteUrl}/entrar?erro=auth&detalhe=${errorMsg}`);
      }
    }
  }

  return NextResponse.redirect(`${siteUrl}/entrar?erro=auth&detalhe=sem_codigo`);
}
