// Le message envoyé à Romeo, et les liens WhatsApp et e-mail qui le transportent.
// Fonctions pures, sans React.

import { fill } from "../../i18n/fill.js";
import { emailLink, whatsappLink } from "../../links.js";
import { formatBudget } from "./budget.js";

function hasText(value) {
  return typeof value === "string" && value.trim() !== "";
}

// Construit le texte du message, dans la langue du dictionnaire reçu.
//
// answers : les réponses du questionnaire (identifiants, pas de texte traduit)
//   { projectType, audience, needs, stage, deadline, budgetPosition, budgetUnknown, name, city, message }
// context : ce qu'il faut pour les mettre en mots
//   { t: dictionnaire.wizard, brand, currency, budgetSteps }
//
// Une ligne sans réponse (ville ou message non remplis, par exemple) n'apparaît pas.
export function buildMessage(answers, { t, brand, currency, budgetSteps }) {
  const { options, message: labels } = t;

  const needs = (answers.needs ?? []).map((need) => options.needs[need]).join(", ");

  const budget = answers.budgetUnknown
    ? t.budget.unknown
    : Number.isInteger(answers.budgetPosition)
      ? formatBudget(answers.budgetPosition, { steps: budgetSteps, currency, labels: t.budget })
      : "";

  const lines = [
    [labels.type, options.projectType[answers.projectType]],
    [labels.audience, options.audience[answers.audience]],
    [labels.needs, needs],
    [labels.stage, options.stage[answers.stage]],
    [labels.deadline, options.deadline[answers.deadline]],
    [labels.budget, budget],
    [labels.name, answers.name],
    [labels.city, answers.city],
    [labels.message, answers.message],
  ]
    .filter(([, value]) => hasText(value))
    .map(([label, value]) => `- ${label}${labels.separator}${value.trim()}`);

  return [fill(labels.greeting, { brand }), labels.intro, "", ...lines].join("\n");
}

// Le sujet de l'e-mail : « Nouveau projet : Jean ».
export function buildEmailSubject(answers, { t }) {
  return fill(t.message.emailSubject, { name: (answers.name ?? "").trim() });
}

// https://wa.me/<numéro>?text=<message encodé>
export function whatsappMessageLink(number, text) {
  return `${whatsappLink(number)}?text=${encodeURIComponent(text)}`;
}

// mailto:<adresse>?subject=<sujet>&body=<message>
// Dans un lien mailto, les retours à la ligne s'écrivent CRLF (RFC 6068).
export function mailtoMessageLink(email, subject, body) {
  const encodedBody = encodeURIComponent(body.replace(/\r?\n/g, "\r\n"));
  return `${emailLink(email)}?subject=${encodeURIComponent(subject)}&body=${encodedBody}`;
}
