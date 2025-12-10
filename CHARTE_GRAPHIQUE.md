# Charte Graphique - NewStud Front-End

## 🎨 Palette de Couleurs

### Couleur Principale (Primary)
- **Rouge NewStud** : `#D73738` / `RGB(215, 55, 56)`
  - Utilisée pour : boutons principaux, éléments d'accentuation, navigation active
  - Format Flutter : `Color(0xffD73738)` ou `Color.fromRGBO(215, 55, 56, 1)`

### Couleurs Secondaires
- **Blanc** : `#FFFFFF` / `RGB(255, 255, 255)`
  - Utilisée pour : texte sur fond rouge, boutons secondaires, arrière-plans clairs

- **Noir** : `#0C0C0C` / `RGB(12, 12, 12)`
  - Utilisée pour : texte principal, boutons sur fond blanc

- **Gris** : `#D9D9D9` / `RGB(217, 217, 217)`
  - Utilisée pour : ombres légères, éléments désactivés

- **Gris clair** : Utilisé pour les éléments non sélectionnés dans la navigation

## 📝 Typographie

### Police de caractères
- **Famille** : `Roboto`
- **Défini dans** : `main.dart` - `fontFamily: 'Roboto'`

### Tailles de texte observées
- **Titre principal** : 24px (fontSize: 24)
- **Titre secondaire** : 20px (fontSize: 20)
- **Texte de bouton** : 18px (fontSize: 18)
- **Texte standard** : 16px (fontSize: 16)
- **Texte secondaire** : 12px (fontSize: 12)

### Poids de police
- **Normal** : `FontWeight.normal`
- **Gras** : `FontWeight.bold`

## 🎯 Composants UI

### Boutons

#### Bouton Principal
- **Couleur de fond** : Rouge NewStud `#D73738`
- **Couleur du texte** : Blanc `#FFFFFF`
- **Border radius** : 12px (`BorderRadius.circular(12)`)
- **Padding** : Vertical 13px, Horizontal 50px
- **Largeur fixe** : 300px (pour les boutons d'authentification)

#### Bouton Secondaire (sur fond rouge)
- **Couleur de fond** : Blanc
- **Couleur du texte** : Noir `#0C0C0C`
- **Style** : Gras (FontWeight.bold)

### Cartes (Cards)

#### Building Card / Company Card
- **Couleur de fond** : Blanc
- **Border radius** : 20px (pour les cartes principales)
- **Élévation** : 4 (elevation: 4)
- **Ombre** : 
  - Couleur : `RGB(217, 217, 217)`
  - Spread radius : 1
  - Blur radius : 0.5
  - Offset : (0, 0.5)
- **Marges** : 20px gauche/droite, 8px haut, 16px bas

### Boîte de Réduction (ReductionBox)
- **Couleur de fond** : Rouge NewStud `#D73738`
- **Border radius** : 15px (tous les coins)
- **Largeur** : 70% de l'écran (`widthFactor: 0.7`)
- **Padding** : 12px horizontal et vertical
- **Texte** : Blanc, taille 24px pour le titre, 12px pour le sous-titre

### Navigation

#### Bottom Navigation Bar
- **Couleur sélectionnée** : Rouge NewStud `#D73738`
- **Couleur non sélectionnée** : Gris (`Colors.grey`)
- **Éléments** : Home, Favorites, Profile

## 🖼️ Assets & Icônes

### Logos
- **Logo principal** : `assets/img/logo.svg`
  - Dimensions affichées : 200px hauteur, 250px largeur

### Icônes SVG
- **Cœur (favoris)** : `assets/home/coeur_gris.svg`
  - Couleur appliquée : Rouge NewStud `#D73738`
- **Éléphant** : 
  - `assets/home/elephant_rouge.svg` (profil)
  - `assets/home/elephant_gris.svg`
- **Logo bar** : `assets/home/logo_bar.png`

### Icônes Material
- Utilisation des icônes Material Design de Flutter
- Couleur principale : Rouge NewStud pour les icônes actives

## 📐 Espacements

### Marges et Padding standards
- **Espacement entre éléments** : 8px, 10px, 16px
- **Padding des cartes** : 10px, 16px
- **Marges des cartes** : 20px (gauche/droite), 8px/16px (haut/bas)
- **Espacement vertical important** : 100px (entre logo et boutons sur page d'accueil)

### Border Radius
- **Petits éléments** : 12px (boutons)
- **Cartes moyennes** : 15px (boîte de réduction)
- **Cartes grandes** : 20px (cartes d'entreprise)

## 🎭 Style Global

### Thème de l'application
- **Padding top global** : 40px (`EdgeInsets.only(top: 40.0)`)
- **Style général** : Design moderne, épuré, avec des coins arrondis
- **Palette** : Monochrome avec accent rouge vif
- **Contraste** : Fort contraste entre le rouge et le blanc pour une bonne lisibilité

### Éléments récurrents
- Utilisation systématique de coins arrondis
- Ombres légères pour la profondeur
- Espacement généreux pour une interface aérée
- Typographie claire et lisible

