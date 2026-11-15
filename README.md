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

## Mettre en ligne sur GitHub Pages

Le fichier [.github/workflows/deploy.yml](.github/workflows/deploy.yml) fait tout : à chaque envoi sur la branche `main`, il lance les tests, construit le site et le publie.

À faire une seule fois :

1. Créez un dépôt sur GitHub, puis envoyez-y le code :

   ```bash
   git remote add origin https://github.com/VOTRE-COMPTE/NOM-DU-DEPOT.git
   git push -u origin main
   ```

2. Sur GitHub, ouvrez **Settings > Pages**, et choisissez **Source : GitHub Actions**.
3. Ouvrez l'onglet **Actions** : la mise en ligne démarre. À la fin, l'adresse du site s'affiche.

Le site sera à l'adresse `https://VOTRE-COMPTE.github.io/NOM-DU-DEPOT/`.

### L'option `base`

Sur GitHub Pages, le site vit dans un sous-dossier qui porte le nom du dépôt. Vite doit le savoir : c'est l'option `base` de [vite.config.js](vite.config.js).

Vous n'avez rien à régler : le workflow lit le nom du dépôt et le transmet dans la variable `BASE_PATH`. En local, `base` vaut `/`.

Pour essayer chez vous la version exacte qui sera en ligne (PowerShell) :

```powershell
$env:BASE_PATH = "/NOM-DU-DEPOT/"; npm run build; npm run preview
```

### Brancher un nom de domaine

1. Chez le vendeur de votre nom de domaine, ajoutez un enregistrement DNS :
   - pour un sous-domaine (`www.exemple.com`) : un enregistrement `CNAME` vers `VOTRE-COMPTE.github.io` ;
   - pour le domaine nu (`exemple.com`) : quatre enregistrements `A` vers `185.199.108.153`, `185.199.109.153`, `185.199.110.153` et `185.199.111.153`.
2. Sur GitHub, dans **Settings > Pages > Custom domain**, écrivez votre nom de domaine et enregistrez.
3. Quand la vérification est terminée, cochez **Enforce HTTPS**.
4. Relancez la mise en ligne (onglet **Actions > Mise en ligne > Run workflow**).

Avec un nom de domaine, le site n'est plus dans un sous-dossier. Le workflow s'en aperçoit et remet `base` à `/` tout seul.

La propagation DNS peut prendre jusqu'à 24 heures. La marche à suivre officielle est dans la [documentation de GitHub Pages](https://docs.github.com/fr/pages/configuring-a-custom-domain-for-your-github-pages-site).

## Qualité

- Lighthouse : 100 en Accessibilité et 100 en Bonnes pratiques.
- Tout le site s'utilise au clavier seul.
- Vérifié à 360, 768 et 1280 px de large.
- Les animations sont coupées si l'appareil demande moins de mouvement.
