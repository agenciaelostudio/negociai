"use client";

import Link from "next/link";

import { Button, type ButtonProps } from "@/components/ui/button";

export function StartButton({
  children,
  ...props
}: ButtonProps) {
  return (
    <Button asChild {...props}>
      <Link href="/entrar">{children}</Link>
    </Button>
  );
}
