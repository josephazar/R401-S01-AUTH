# Mini-Projet « BidNow » — Cahier des charges

> **BUT2 — S4 — R401 Programmation Web Avancée**
> Joseph Azar — Université Marie Louis Pasteur — FEMTO-ST

---

## 1. Contexte

Vous avez étudié au cours des dernières séances :
- la **programmation événementielle** en Node.js (`EventEmitter`, pattern `.emit()` / `.on()`),
- les **WebSockets** avec **Socket.IO** (rooms, broadcast, événements personnalisés),
- la **persistance** avec **MongoDB** via le driver natif (sans Mongoose),
- l'**authentification** côté serveur (JWT et/ou sessions locales avec Passport).

Le mini-projet **BidNow** vise à intégrer ces quatre briques dans une application complète, du backend à l'interface utilisateur, dans un scénario réaliste : une **mini-place de marché aux enchères en temps réel**.

---

## 2. Objectifs pédagogiques

À l'issue du projet, vous devez démontrer votre capacité à :

1. Concevoir une API REST adossée à **MongoDB (driver natif)** avec des opérations CRUD et des filtres simples.
2. Mettre en place une couche **temps réel** avec **Socket.IO** utilisant les **rooms** et les trois patterns de diffusion (`socket.emit`, `io.to(room).emit`, `io.emit`).
3. Implémenter une **authentification** basée sur MongoDB (inscription + connexion), au choix **JWT** *ou* **sessions locales (Passport-local)**.
4. Construire une **interface utilisateur** réactive (Vue.js ou template engine) qui consomme à la fois l'API REST et les événements Socket.IO.
5. Articuler proprement les responsabilités entre le client, le serveur HTTP, le serveur WebSocket et la base de données.

---

## 3. Description fonctionnelle

**BidNow** est une plateforme d'enchères en direct.

- Tout visiteur peut **créer un compte** et **se connecter**.
- Un utilisateur connecté peut **mettre en vente un objet** : titre, description, prix de départ, durée de l'enchère (en minutes).
- Tous les utilisateurs voient la **liste des enchères actives** sur la page d'accueil, avec leur prix courant qui se met à jour **en direct**.
- En cliquant sur une enchère, l'utilisateur arrive sur la **page détail** : il rejoint automatiquement la « salle » de cette enchère et voit en temps réel chaque nouvelle mise (prix, surenchérisseur, horodatage).
- Il peut **placer une enchère** à condition que son montant soit **strictement supérieur** au prix courant et que l'enchère soit encore **active**.
- À l'expiration du délai, l'enchère passe automatiquement en statut **terminée**, le **gagnant** est figé et le formulaire de mise est désactivé pour tout le monde.
- Le créateur d'une enchère **terminée** peut la supprimer.

---

## 4. Stack technique imposée

| Couche | Outil imposé |
|---|---|
| Runtime | **Node.js** (≥ 18) |
| Serveur HTTP | **Express** |
| Temps réel | **Socket.IO** côté serveur et `socket.io-client` côté navigateur |
| Base de données | **MongoDB** via le **driver natif** (`mongodb`, v6.x) |
| Authentification | Au choix : **JWT** (`jsonwebtoken` + `bcryptjs`) **OU** **sessions locales** (`express-session` + `passport` + `passport-local` + `bcryptjs`) |
| Frontend | **Vue.js 3 + Vite** recommandé (ou un moteur de templates EJS/Pug) |
| Gestionnaire de paquets | npm |

### Interdictions strictes

- **Pas de Mongoose** ni d'ODM. Toutes les requêtes doivent passer par l'API du driver natif (`db.collection(...)...`).
- **Pas d'aggregation pipelines** (`.aggregate([...])`). Uniquement `find`, `findOne`, `insertOne`, `updateOne`, `deleteOne`, éventuellement `countDocuments`. Le tri/limit/skip restent autorisés sur un `find`.
- **Pas de bibliothèque temps réel autre que Socket.IO** (pas de `ws` brut, pas de SSE).
- **Pas de stockage des mots de passe en clair** : `bcryptjs` est obligatoire.

---

## 5. Modèle de données

L'étudiant doit proposer le modèle MongoDB : combien de collections sont nécessaires ? quel est le schéma ?


## 6. Authentification (au choix)


### Option A — JWT (stateless)

- `POST /api/auth/register` → crée un `user` (hash bcrypt), renvoie `{ token, user }`.
- `POST /api/auth/login` → vérifie le hash, renvoie `{ token, user }`.
- Token signé avec un secret depuis `.env`, durée de vie ≥ 1h.
- Middleware `requireAuth` qui lit l'en-tête `Authorization: Bearer <token>` et place `req.user` dans la requête.
- Côté Vue : token stocké dans `localStorage`, intercepteur Axios qui ajoute l'en-tête sur chaque requête.
- **Authentification du socket** : le client envoie le token via `io({ auth: { token } })`, le serveur le vérifie dans le middleware `io.use((socket, next) => ...)`.

### Option B — Sessions locales avec Passport

- `express-session` + `passport` + `passport-local` (champ `email` + `password`).
- `POST /api/auth/register`, `POST /api/auth/login` (utilise `passport.authenticate('local')`), `POST /api/auth/logout`.
- `serializeUser` / `deserializeUser` stockent `user._id` dans la session.
- Cookie de session côté navigateur (CORS configuré avec `credentials: true` si front et back sont sur des ports différents).
- **Authentification du socket** : partager la session Express avec Socket.IO via le middleware classique (`io.engine.use(sessionMiddleware)`), récupérer `socket.request.session.passport.user`.

Dans les deux cas :
- `username` et `email` doivent être **uniques**.
- Le mot de passe est haché avec `bcryptjs.hash(pwd, 10)`.

---

## 7. API REST attendue

Toutes les routes `/api/items*` et `/api/items/:id/bids` (en lecture publique : optionnel) sont **protégées** par le middleware d'authentification, **sauf** `GET /api/items` et `GET /api/items/:id` que vous pouvez laisser publiques.

| Méthode | Chemin | Authentifié | Opération MongoDB attendue |
|---|---|---|---|
| `POST` | `/api/auth/register` | non | `findOne({ email })`, `findOne({ username })`, `insertOne` dans `users` |
| `POST` | `/api/auth/login` | non | `findOne({ email })` + `bcrypt.compare` |
| `GET` | `/api/auth/me` | oui | `findOne({ _id: new ObjectId(req.user.id) })` |
| `POST` | `/api/items` | oui | `insertOne` dans `items` (calcul de `endsAt`) |
| `GET` | `/api/items?status=active` | non | `find({ status: { $in: [...] } }).sort({ createdAt: -1 }).toArray()` |
| `GET` | `/api/items/:id` | non | `findOne({ _id: new ObjectId(id) })` |
| `GET` | `/api/items/:id/bids` | non | `find({ itemId: new ObjectId(id) }).sort({ createdAt: -1 }).limit(20).toArray()` |
| `DELETE` | `/api/items/:id` | oui | `deleteOne({ _id: new ObjectId(id), ownerId: ..., status: "ended" })` |

### Filtres MongoDB que vous devez démontrer

- **Égalité directe** (`{ email: ... }`, `{ username: ... }`).
- **Opérateur `$in`** sur `status` 
- **Filtre par `ObjectId`** 
- **Filtre composé** sur `DELETE` : `_id` **+** `ownerId` **+** `status` (sécurité : un user ne peut supprimer qu'une de *ses* enchères, et seulement si elle est terminée).

> ⚠️ Aucun de ces filtres ne nécessite `aggregate`. Si vous êtes tenté·e d'utiliser `$lookup`, c'est probablement que vous mélangez deux requêtes : faites-en deux séparées.

---

## 8. Couche temps réel (Socket.IO)

### 8.1. Connexion et authentification

- À la connexion, le serveur **doit identifier l'utilisateur** (via le token JWT ou la session Express selon votre choix). Si l'identification échoue, refuser la connexion (`next(new Error('unauthorized'))`).

### 8.2. Événements écoutés par le serveur (`socket.on`)

| Événement | Charge utile | Comportement attendu |
|---|---|---|
| `'join-item'` | `itemId` (string) | `socket.join('item:' + itemId)` |
| `'leave-item'` | `itemId` (string) | `socket.leave('item:' + itemId)` |
| `'place-bid'` | `{ itemId, amount }` | Voir §8.4 |

### 8.3. Événements émis par le serveur

| Événement | Cible | Charge utile |
|---|---|---|
| `'new-bid'` | `io.to('item:'+itemId).emit(...)` | `{ itemId, amount, bidder, at }` |
| `'item-updated'` | `io.emit(...)` (global) | `{ itemId, currentPrice, currentBidder, status }` |
| `'auction-ended'` | `io.to('item:'+itemId).emit(...)` | `{ itemId, winner, finalPrice }` |
| `'bid-rejected'` | `socket.emit(...)` (uniquement à l'auteur) | `{ reason }` |

### 8.4. Algorithme de `place-bid` (côté serveur)

```text
1. Vérifier que l'utilisateur est authentifié (sinon : 'bid-rejected', 'not authenticated').
2. findOne({ _id: new ObjectId(itemId) })
3. Si !item       → 'bid-rejected', 'item not found'
4. Si status !== "active" ou Date.now() > endsAt
                  → 'bid-rejected', 'auction is closed'
5. Si amount n'est pas un nombre > currentPrice
                  → 'bid-rejected', 'amount too low'
6. updateOne({ _id }, { $set: { currentPrice: amount, currentBidder: username } })
7. insertOne dans bids : { itemId, bidder: username, amount, createdAt: new Date() }
8. io.to('item:'+itemId).emit('new-bid', { itemId, amount, bidder, at })
9. io.emit('item-updated', { itemId, currentPrice, currentBidder, status: "active" })
```

### 8.5. Clôture automatique des enchères

Vous devez fermer automatiquement les enchères dont `endsAt` est dépassé. Au choix :

- **Approche `setTimeout` par enchère** : à la création d'un item, planifier un `setTimeout` qui exécute la clôture à `endsAt - now`.
- **Approche `setInterval` global** : toutes les 5 secondes, balayer `find({ status: "active", endsAt: { $lte: new Date() } })` et clore chaque résultat.

Lors de la clôture :
1. `updateOne({ _id }, { $set: { status: "ended" } })`,
2. `io.to('item:'+itemId).emit('auction-ended', { itemId, winner, finalPrice })`,
3. `io.emit('item-updated', { itemId, currentPrice, currentBidder, status: "ended" })`.

---

## 9. Interface utilisateur

L'interface comporte **au minimum les pages suivantes** (URLs indicatives en Vue Router) :

| Route | Description |
|---|---|
| `/register` | Formulaire d'inscription (username, email, password). |
| `/login` | Formulaire de connexion (email + password). |
| `/` | Liste des enchères avec onglets *Actives* / *Terminées* (filtre `?status=`). Mise à jour live des prix et bidders sur réception de `'item-updated'`. |
| `/items/new` | Formulaire de mise en vente (auth requis). |
| `/items/:id` | Détail d'une enchère : informations, compte à rebours, prix courant, formulaire de mise, **fil des dernières mises** alimenté par `'new-bid'`. |
| `/me/items` *(optionnel)* | Liste des enchères créées par l'utilisateur connecté (filtre `find({ ownerId })`). |

Exigences UX :
- Le **compte à rebours** doit ticquer côté client (recalculé à partir de `endsAt`).
- Un **toast / message** doit s'afficher si une mise est rejetée (`'bid-rejected'`).
- Le formulaire de mise est **désactivé** dès réception de `'auction-ended'` ou si `status === "ended"`.
- Les onglets *Actives* / *Terminées* doivent refléter en direct les changements de statut sans recharger la page.

---

## 10. Règles métier à respecter

1. Un utilisateur **ne peut pas miser sur sa propre enchère**.
2. Un utilisateur **ne peut pas miser** s'il n'est pas authentifié (rejet socket).
3. Une mise **doit être strictement supérieure** au `currentPrice`.
4. Une enchère terminée **ne peut plus recevoir de mise**, même si le client triche.
5. Un utilisateur **ne peut supprimer que ses propres enchères**, et seulement si elles sont terminées.
6. Les mots de passe **ne sont jamais renvoyés** au client (filtrage côté serveur).

---

## 11. Livrables

À déposer (Github) :

1. **Code source** structuré en deux dossiers `backend/` et `frontend/`.
2. **`README.md`** à la racine contenant :
   - Présentation rapide du projet.
   - **Choix de la stratégie d'authentification** (JWT *ou* sessions)  
   - Instructions d'installation et de lancement (`npm install`, variables `.env`, commandes de démarrage des deux serveurs).
   - URL d'accès et port du frontend / backend.
   - Liste des éventuelles fonctionnalités bonus implémentées.
3. **`.env.example`** listant les variables requises (`MONGODB_URI`, `JWT_SECRET` ou `SESSION_SECRET`, `PORT`, etc.) — sans valeurs sensibles.
4. **Court scénario de démonstration** (5 lignes) à dérouler en jury : créer 2 comptes, mettre un objet en vente, surenchérir depuis le second compte, observer la clôture automatique.


---

## 12. Pistes d'extension 

À ne tenter qu'**une fois le tronc commun fonctionnel** :

- **Indicateur « N spectateurs sur cette enchère »** en exploitant `io.sockets.adapter.rooms.get('item:'+id)?.size`, broadcasté à chaque join/leave.
- **Pas d'enchère minimum** (`amount >= currentPrice + step`) configurable par l'auteur.
- **Historique personnel** : page « Mes mises » utilisant `find({ bidder: username })`.
- **Notification globale** quand une enchère démarre (`io.emit('item-listed', ...)` à la création).
- **Recherche** par titre via une regex insensible à la casse (`{ title: { $regex: q, $options: "i" } }`).
- **Rate-limit** sur `'place-bid'` côté serveur (1 mise / seconde / utilisateur) pour éviter le spam.

---

*Bon courage ! 🔨*
