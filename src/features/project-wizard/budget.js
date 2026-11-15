// Le budget : paliers du curseur et formatage des montants.
// Fonctions pures, sans React. Les tranches viennent de config.js.

import { fill } from "../../i18n/fill.js";

// Construit la liste des montants à partir des tranches { from, to, step }.
// Le curseur avance d'une position à la fois dans cette liste.
export function buildBudgetSteps(ranges) {
  const steps = [];
  for (const { from, to, step } of ranges) {
    for (let amount = from; amount <= to; amount += step) {
      steps.push(amount);
    }
  }
  return steps;
}

// Après le dernier montant vient une position de plus : « Plus de <dernier montant> ».
export function lastPosition(steps) {
  return steps.length;
}

export function isAboveMax(position, steps) {
  return position >= lastPosition(steps);
}

// Ramène une position dans les limites du curseur.
export function clampPosition(position, steps) {
  return Math.min(Math.max(Math.round(position), 0), lastPosition(steps));
}

// Position du premier palier qui atteint ce montant (sert pour la valeur de départ).
export function positionOfAmount(amount, steps) {
  const index = steps.findIndex((step) => step >= amount);
  return index === -1 ? lastPosition(steps) : index;
}

// 750000 → "750 000" (séparateur " " en français, "," en anglais).
export function groupThousands(amount, separator) {
  return String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

// Le texte affiché pour une position du curseur : "750 000 FCFA" ou "Plus de 10 000 000 FCFA".
// `labels` vient des dictionnaires : { thousands: " ", moreThan: "Plus de {amount}" }.
export function formatBudget(position, { steps, currency, labels }) {
  const index = Math.min(clampPosition(position, steps), steps.length - 1);
  const amount = `${groupThousands(steps[index], labels.thousands)} ${currency}`;
  return isAboveMax(position, steps) ? fill(labels.moreThan, { amount }) : amount;
}
