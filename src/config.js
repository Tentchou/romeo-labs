// Toutes les coordonnées et tous les réglages du site sont ici.
// Remplacez chaque valeur « [À COMPLÉTER] » par la vôtre.
export const config = {
  brand: "Romeo Labs",
  whatsappNumber: "237XXXXXXXXX", // [À COMPLÉTER] chiffres seulement, avec l'indicatif, sans + ni espaces
  email: "[À COMPLÉTER]",
  links: {
    youtube: "[À COMPLÉTER]",
    tiktok: "[À COMPLÉTER]",
    facebook: "[À COMPLÉTER]",
    linkedin: "[À COMPLÉTER]",
    github: "[À COMPLÉTER]",
  },
  budget: {
    currency: "FCFA",
    // Graduation progressive du curseur : chaque tranche va de `from` à `to` par pas de `step`.
    // Après la dernière tranche vient une position « Plus de <dernier montant> ».
    ranges: [
      { from: 100_000, to: 500_000, step: 25_000 },
      { from: 600_000, to: 2_000_000, step: 100_000 },
      { from: 2_500_000, to: 10_000_000, step: 500_000 },
    ],
    defaultAmount: 500_000,
  },
};
