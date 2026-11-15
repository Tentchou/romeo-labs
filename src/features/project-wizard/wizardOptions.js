// Les options du questionnaire. Données pures, sans React ni texte :
// chaque identifiant a son libellé dans les dictionnaires (wizard.options.*).

export const PROJECT_TYPES = ["website", "mobile", "management", "api", "other"];

export const AUDIENCES = ["self", "smallBusiness", "largeCompany", "organization"];

export const STAGES = ["idea", "document", "existing"];

export const DEADLINES = ["asap", "oneToThreeMonths", "noRush"];

// « Je ne sais pas encore » : ne se combine avec aucun autre besoin.
export const UNSURE = "unsure";

// Besoins proposés quel que soit le type de projet.
export const COMMON_NEEDS = ["accounts", "mobileMoney", "notifications", "dashboard", "multilingual"];

// Besoins proposés en plus, selon la réponse à l'étape 1.
export const EXTRA_NEEDS = {
  website: ["showcase", "shop"],
  mobile: ["offline", "map"],
  management: ["stock", "invoices", "roles"],
};

// Les besoins proposés à l'étape 3 : d'abord ceux propres au type de projet,
// puis les besoins communs, et « Je ne sais pas encore » en dernier.
export function needsFor(projectType) {
  return [...(EXTRA_NEEDS[projectType] ?? []), ...COMMON_NEEDS, UNSURE];
}

// Coche ou décoche un besoin.
// « Je ne sais pas encore » décoche les autres, et inversement.
export function toggleNeed(selected, need) {
  if (selected.includes(need)) return selected.filter((item) => item !== need);
  if (need === UNSURE) return [UNSURE];
  return [...selected.filter((item) => item !== UNSURE), need];
}

// Quand la réponse à l'étape 1 change, retire les besoins qui ne sont plus proposés.
export function keepValidNeeds(selected, projectType) {
  const allowed = needsFor(projectType);
  return selected.filter((need) => allowed.includes(need));
}
