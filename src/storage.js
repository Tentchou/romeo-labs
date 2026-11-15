// Accès à localStorage qui ne plante jamais : si le stockage est bloqué
// (navigation privée, réglages du navigateur), le site continue de fonctionner.

export function readStored(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStored(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Stockage bloqué : le choix ne sera simplement pas mémorisé.
  }
}

export function removeStored(key) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Stockage bloqué : rien à effacer.
  }
}
