// Le message envoyé à Romeo, et les liens WhatsApp et e-mail qui le transportent.
// Fonctions pures, sans React.

import { fill } from "../../i18n/fill.js";
import { emailLink, whatsappLink } from "../../links.js";
import { formatBudget } from "./budget.js";

function hasText(value) {
  return typeof value === "string" && value.trim() !== "";
}

// Met les réponses en mots, dans la langue du dictionnaire reçu.
//
// answers : les réponses du questionnaire (identifiants, pas de texte traduit)
//   { projectType, audience, needs, stage, deadline, budgetPosition, budgetUnknown, name, city, message }
// context : ce qu'il faut pour les mettre en mots
//   { t: dictionnaire.wizard, currency, budgetSteps }
//
// Renvoie une liste de lignes { step, label, value } ; `step` est l'écran du
// questionnaire où la réponse a été donnée. Une ligne sans réponse (ville ou
// message non remplis, par exemple) n'apparaît pas.
export function answerRows(answers, { t, currency, budgetSteps }) {
  const { options, message: labels } = t;

  const needs = (answers.needs ?? []).map((need) => options.needs[need]).join(", ");

  const budget = answers.budgetUnknown
    ? t.budget.unknown
    : Number.isInteger(answers.budgetPosition)
      ? formatBudget(answers.budgetPosition, { steps: budgetSteps, currency, labels: t.budget })
      : "";

  return [
    ["projectType", labels.type, options.projectType[answers.projectType]],
    ["audience", labels.audience, options.audience[answers.audience]],
    ["needs", labels.needs, needs],
    ["stage", labels.stage, options.stage[answers.stage]],
    ["deadline", labels.deadline, options.deadline[answers.deadline]],
    ["budget", labels.budget, budget],
    ["contact", labels.name, answers.name],
    ["contact", labels.city, answers.city],
    ["contact", labels.message, answers.message],
  ]
    .filter(([, , value]) => hasText(value))
    .map(([step, label, value]) => ({ step, label, value: value.trim() }));
}

// Construit le texte du message envoyé à Romeo : une ligne par réponse.
export function buildMessage(answers, { t, brand, currency, budgetSteps }) {
  const labels = t.message;
  const lines = answerRows(answers, { t, currency, budgetSteps }).map(
    ({ label, value }) => `- ${label}${labels.separator}${value}`,
  );

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
