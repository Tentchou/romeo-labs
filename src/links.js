// Fonctions pures autour des coordonnées de config.js.

const PLACEHOLDER = "[À COMPLÉTER]";

// Vrai si la valeur a été remplie dans config.js.
// Un bouton dont le lien n'est pas rempli n'est pas affiché.
export function isFilled(value) {
  return typeof value === "string" && value.trim() !== "" && !value.includes(PLACEHOLDER);
}

export function whatsappLink(number) {
  return `https://wa.me/${number}`;
}

export function emailLink(email) {
  return `mailto:${email}`;
}
