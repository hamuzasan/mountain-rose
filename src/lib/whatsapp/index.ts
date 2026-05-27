export function buildWhatsAppLink(phoneNumber: string, message?: string) {
  const cleaned = (phoneNumber || "").replace(/[^\d]/g, "");
  if (!cleaned) return "https://wa.me/";

  const base = `https://wa.me/${cleaned}`;
  if (!message) return base;

  const encoded = encodeURIComponent(message);
  return `${base}?text=${encoded}`;
}
