// Remplace les repères {nom} d'un texte par leurs valeurs.
// fill("Bonjour {brand},", { brand: "Romeo Labs" }) → "Bonjour Romeo Labs,"
export function fill(template, values) {
  return template.replace(/\{(\w+)\}/g, (match, key) => (key in values ? String(values[key]) : match));
}
