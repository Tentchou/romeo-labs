// L'état du questionnaire et ses règles de navigation.
// Fonctions pures, sans React : chacune reçoit un état et en renvoie un nouveau.
//
// état : { step, answers, editing, sentBy }
//   step    : l'écran affiché
//   answers : les réponses (identifiants, jamais de texte traduit)
//   editing : vrai quand on corrige une réponse depuis le récapitulatif
//   sentBy  : "whatsapp" ou "email" une fois la demande envoyée

import { clampPosition } from "./budget.js";
import {
  AUDIENCES,
  DEADLINES,
  PROJECT_TYPES,
  STAGES,
  keepValidNeeds,
} from "./wizardOptions.js";

// Les 7 écrans comptés dans la barre de progression.
export const QUESTION_STEPS = [
  "projectType",
  "audience",
  "needs",
  "stage",
  "deadline",
  "budget",
  "contact",
];

export const SUMMARY = "summary";
export const THANKS = "thanks";

const STEPS = [...QUESTION_STEPS, SUMMARY, THANKS];

export function initialState(defaultBudgetPosition) {
  return {
    step: QUESTION_STEPS[0],
    answers: {
      projectType: null,
      audience: null,
      needs: [],
      stage: null,
      deadline: null,
      budgetPosition: defaultBudgetPosition,
      budgetUnknown: false,
      name: "",
      city: "",
      message: "",
    },
    editing: false,
    sentBy: null,
  };
}

// 1 pour la première question, 7 pour la dernière.
export function stepNumber(step) {
  return QUESTION_STEPS.indexOf(step) + 1;
}

// Vrai si on peut quitter cet écran pour le suivant.
export function isStepComplete(step, answers) {
  switch (step) {
    case "projectType":
    case "audience":
    case "stage":
    case "deadline":
      return answers[step] !== null;
    case "needs":
      return answers.needs.length > 0;
    case "contact":
      return answers.name.trim() !== "";
    default:
      // Le budget a toujours une valeur : le curseur ou « Je ne sais pas encore ».
      return true;
  }
}

// La première question sans réponse, ou le récapitulatif si tout est rempli.
export function firstIncompleteStep(answers) {
  return QUESTION_STEPS.find((step) => !isStepComplete(step, answers)) ?? SUMMARY;
}

// Enregistre une réponse.
// Si le type de projet change, les besoins qui ne sont plus proposés sont retirés.
export function setAnswer(state, field, value) {
  const answers = { ...state.answers, [field]: value };
  if (field === "projectType") {
    answers.needs = keepValidNeeds(answers.needs, value);
  }
  return { ...state, answers };
}

// Passe à l'écran suivant, seulement si l'écran actuel est rempli.
// Depuis le récapitulatif (« Modifier »), on y retourne dès que tout est rempli.
export function goNext(state) {
  if (!isStepComplete(state.step, state.answers)) return state;

  if (state.editing) {
    const step = firstIncompleteStep(state.answers);
    return { ...state, step, editing: step !== SUMMARY };
  }

  const index = QUESTION_STEPS.indexOf(state.step);
  if (index === -1) return state;
  return { ...state, step: STEPS[index + 1] };
}

export function canGoBack(state) {
  return state.step !== QUESTION_STEPS[0] && state.step !== THANKS;
}

// Revient à l'écran précédent. Pendant une correction, revient au récapitulatif
// si rien ne manque.
export function goBack(state) {
  if (!canGoBack(state)) return state;

  if (state.editing && firstIncompleteStep(state.answers) === SUMMARY) {
    return { ...state, step: SUMMARY, editing: false };
  }

  return { ...state, step: STEPS[STEPS.indexOf(state.step) - 1], editing: false };
}

// Ouvre une question depuis le récapitulatif pour la corriger.
export function editStep(state, step) {
  if (!QUESTION_STEPS.includes(step)) return state;
  return { ...state, step, editing: true };
}

// La demande est partie vers WhatsApp ou la messagerie : on affiche « Merci ».
export function markSent(state, channel) {
  return { ...state, step: THANKS, editing: false, sentBy: channel };
}

function oneOf(value, allowed) {
  return allowed.includes(value) ? value : null;
}

function text(value) {
  return typeof value === "string" ? value : "";
}

// Reconstruit un état sûr à partir de ce qui a été sauvegardé dans le navigateur.
// Tout ce qui est absent, abîmé ou inconnu est remplacé par la valeur de départ.
// On ne reprend jamais plus loin que la première question sans réponse.
export function restoreState(saved, { defaultBudgetPosition, budgetSteps }) {
  const fresh = initialState(defaultBudgetPosition);
  const raw = saved?.answers;
  if (raw === null || typeof raw !== "object") return fresh;

  const projectType = oneOf(raw.projectType, PROJECT_TYPES);
  const answers = {
    projectType,
    audience: oneOf(raw.audience, AUDIENCES),
    needs: keepValidNeeds(Array.isArray(raw.needs) ? [...new Set(raw.needs)] : [], projectType),
    stage: oneOf(raw.stage, STAGES),
    deadline: oneOf(raw.deadline, DEADLINES),
    budgetPosition: Number.isInteger(raw.budgetPosition)
      ? clampPosition(raw.budgetPosition, budgetSteps)
      : defaultBudgetPosition,
    budgetUnknown: raw.budgetUnknown === true,
    name: text(raw.name),
    city: text(raw.city),
    message: text(raw.message),
  };

  const wanted = STEPS.includes(saved.step) ? saved.step : fresh.step;
  const furthest = firstIncompleteStep(answers);
  const tooFar = furthest !== SUMMARY && STEPS.indexOf(wanted) > STEPS.indexOf(furthest);
  const step = tooFar ? furthest : wanted;
  const sentBy = step === THANKS ? (saved.sentBy === "email" ? "email" : "whatsapp") : null;

  return { step, answers, editing: false, sentBy };
}
