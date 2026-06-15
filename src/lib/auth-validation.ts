export function validatePasswordPair(
  password: string,
  confirm: string,
): string | null {
  if (password.length < 8) {
    return "A senha deve ter pelo menos 8 caracteres.";
  }
  if (password !== confirm) {
    return "As senhas não coincidem.";
  }
  return null;
}

export function validateEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return "Informe um e-mail válido.";
  }
  return null;
}
