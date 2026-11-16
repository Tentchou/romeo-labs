# Romeo Labs

Le site de Romeo Labs. Sa mission : un client décrit son projet en 2 minutes et l'envoie sur WhatsApp.

Une seule page, en français et en anglais, avec un thème clair et un thème sombre. Pas de serveur : le site est fait de fichiers statiques.

## Démarrer

Il faut [Node.js](https://nodejs.org) 22 ou plus récent.

```bash
npm install
npm run dev
```

Le site s'ouvre sur l'adresse affichée dans le terminal (http://localhost:5173 en général).

## Les commandes

| Commande | Ce qu'elle fait |
|---|---|
| `npm run dev` | Lance le site en local, avec rechargement automatique |
| `npm test` | Lance les tests |
| `npm run lint` | Vérifie le code |
| `npm run build` | Construit le site dans le dossier `dist/` |
| `npm run preview` | Sert le dossier `dist/` pour vérifier avant la mise en ligne |

## Vos coordonnées

Tout se règle dans un seul fichier : [src/config.js](src/config.js).

- `whatsappNumber` : votre numéro, chiffres seulement, avec l'indicatif, sans `+` ni espaces. Exemple de forme : `2376XXXXXXXX`.
- `email` : votre adresse. Tant qu'elle vaut `[À COMPLÉTER]`, les boutons e-mail ne s'affichent pas.
- `links` : vos chaînes. Un lien laissé à `[À COMPLÉTER]` n'est pas affiché ; si aucun n'est rempli, la section « Mes chaînes » disparaît.
- `budget` : la devise, la graduation du curseur et le montant de départ.

## Changer un texte

Aucun texte n'est écrit dans les composants. Ils sont tous dans deux fichiers :

- [src/i18n/fr.js](src/i18n/fr.js) pour le français ;
- [src/i18n/en.js](src/i18n/en.js) pour l'anglais.

Les deux fichiers doivent avoir exactement les mêmes clés : un test le vérifie.

## L'organisation du code

```
src/
  config.js            coordonnées et réglages
  links.js             liens WhatsApp et e-mail (logique pure)
  storage.js           accès protégé à la mémoire du navigateur
  i18n/                dictionnaires FR et EN, choix de la langue
  theme/               thème clair ou sombre
  components/          les sections de la page et les briques communes
  features/project-wizard/
    budget.js          paliers du curseur et mise en forme des montants
    wizardOptions.js   les réponses possibles à chaque question
    wizardState.js     les règles du questionnaire : avancer, reculer, corriger, reprendre
    message.js         le message envoyé, les liens WhatsApp et e-mail
    useWizard.js       l'état côté React et la sauvegarde
    ProjectWizard.jsx  l'affichage du questionnaire
    steps/             un composant par type d'écran
```

La logique est séparée de l'affichage : les fichiers `budget.js`, `wizardOptions.js`, `wizardState.js` et `message.js` n'utilisent pas React et ont chacun leurs tests (`*.test.js`).

Le navigateur garde trois réglages en mémoire : `rl-lang` (langue), `rl-theme` (thème) et `rl-wizard` (progression du questionnaire).

## Mettre en ligne sur Cloudflare Pages

Le site est hébergé sur [Cloudflare Pages](https://pages.cloudflare.com), qui suit le dépôt GitHub : à chaque envoi sur la branche `main`, Cloudflare reconstruit le site et le publie.

À faire une seule fois, dans le tableau de bord Cloudflare :

1. Ouvrez **Workers & Pages**, puis **Create application > Pages > Connect to Git**.
2. Choisissez **GitHub**, autorisez Cloudflare, puis sélectionnez le dépôt.
3. Dans **Set up builds and deployments**, réglez :

   | Champ | Valeur |
   |---|---|
   | Production branch | `main` |
   | Framework preset | `React (Vite)` (ou `None`) |
   | Build command | `npm run build` |
   | Build output directory | `dist` |

4. Cliquez sur **Save and Deploy**.

Le site sera à l'adresse `https://NOM-DU-PROJET.pages.dev`.

La version de Node.js utilisée par Cloudflare est celle du fichier [.node-version](.node-version).

Le fichier [.github/workflows/checks.yml](.github/workflows/checks.yml) ne publie rien : il relance le lint, les tests et la construction sur GitHub à chaque envoi.

### L'option `base`

Sur Cloudflare Pages, le site est à la racine de son adresse : l'option `base` de [vite.config.js](vite.config.js) garde sa valeur `/` et il n'y a rien à régler.

Elle ne sert que si le site doit un jour vivre dans un sous-dossier (par exemple sur GitHub Pages, à `/nom-du-depot/`). Il suffit alors de donner ce chemin dans la variable `BASE_PATH` au moment de construire.

### Brancher un nom de domaine

1. Dans le tableau de bord Cloudflare, ouvrez le projet, puis l'onglet **Custom domains**.
2. Cliquez sur **Set up a custom domain** et écrivez votre nom de domaine.
3. Suivez les instructions affichées :
   - si le nom de domaine est déjà géré par Cloudflare, l'enregistrement DNS est créé tout seul ;
   - sinon, ajoutez chez votre vendeur un enregistrement `CNAME` vers `NOM-DU-PROJET.pages.dev` (pour un sous-domaine comme `www`). Pour le domaine nu (`exemple.com`), Cloudflare demande de lui confier la gestion du nom de domaine.

Le HTTPS est activé automatiquement. La marche à suivre officielle est dans la [documentation de Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/custom-domains/).

## Qualité

- Lighthouse : 100 en Accessibilité et 100 en Bonnes pratiques.
- Tout le site s'utilise au clavier seul.
- Vérifié à 360, 768 et 1280 px de large.
- Les animations sont coupées si l'appareil demande moins de mouvement.
