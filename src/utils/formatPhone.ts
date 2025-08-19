export function formatPhone(numero: string | number | undefined): string {
  if (!numero) return "";
  const num = String(numero).replace(/\D/g, "");
  if (num.length === 11) {
    return `(${num.slice(0, 2)}) ${num.slice(2, 7)}-${num.slice(7)}`;
  }
  if (num.length === 10) {
    return `(${num.slice(0, 2)}) ${num.slice(2, 6)}-${num.slice(6)}`;
  }
  return String(numero);
}
