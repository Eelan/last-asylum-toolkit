# Recoupement des statistiques et de la puissance des héros

Consultation : 11 septembre 2026. Conclusion : conserver la puissance saisie par
l’utilisateur. Les tables publiques permettent de recouper certaines statistiques,
mais pas encore de reproduire la puissance totale affichée en jeu.

## Sources et limites

- [Méthodologie du wiki](https://wiki-last-asylum.com/en/wiki/methodology) :
  annonce une extraction du client Android 1.0.87. Cette provenance est déclarée
  par le site, non vérifiée ici sur les fichiers du jeu. Les bonus du compte
  peuvent modifier les valeurs de base. Plusieurs pages de ce wiki ne constituent
  pas des confirmations indépendantes.
- SatoriMeta : tables de niveaux, étoiles, compétences et éveil. Comparaisons
  chiffrées effectuées sur Arthur, Marlena, Joker et Bella, couvrant UR/SSR,
  tanks et héros de dégâts. Les deux sites pourraient partager des données
  d'origine : concordance numérique ne signifie pas indépendance des sources.
- LastAsylumPlague.com et A Jack Of : fiches et compétences comparées pour Arthur
  et Marlena. Des valeurs identiques ne suffisent pas à établir leur provenance.
- Last Asylum Database, utilisé par le dépôt : la fiche Arthur n’a pas pu être
  consultée avec l’outil de recherche. Le guide de l’éditeur mentionné par le wiki
  (`https://gevents.globallap.com/officialGuide`) n’a pas pu être consulté non plus.
  Aucune confirmation officielle de la formule n’a donc été obtenue.

## Recoupement des niveaux

Hypothèse testée : statistique du niveau dans SatoriMeta × coefficient individuel
publié par le wiki. Résultats au niveau 150, dans l’ordre PV / ATQ / DEF :

| Héros | Table SatoriMeta | Coefficients du wiki | Résultat arrondi, également publié par le wiki |
| --- | --- | --- | --- |
| Arthur | 1 739 410,9 / 12 423,4 / 12 423,4 | 1,34 / 0,82 / 1,05 | 2 330 811 / 10 187 / 13 045 |
| Marlena | 1 739 410,9 / 12 423,4 / 12 423,4 | 0,58 / 1,49 / 0,91 | 1 008 858 / 18 511 / 11 305 |
| Joker | 1 739 410,9 / 12 423,4 / 12 423,4 | 0,60 / 1,45 / 0,91 | 1 043 647 / 18 014 / 11 305 |
| Bella | 1 739 412,9 / 12 425,4 / 12 425,4 | 0,88 / 0,55 / 0,70 | 1 530 683 / 6 834 / 8 698 |

Sources par ligne :
[Arthur SatoriMeta](https://satorimeta.com/en/last-asylum/heroes/arthur/) et
[Arthur wiki](https://wiki-last-asylum.com/en/wiki/hero-arthur) ;
[Marlena SatoriMeta](https://satorimeta.com/en/last-asylum/heroes/marlena/) et
[Marlena wiki](https://wiki-last-asylum.com/en/wiki/hero-marlena) ;
[Joker SatoriMeta](https://satorimeta.com/en/last-asylum/heroes/joker/) et
[Joker wiki](https://wiki-last-asylum.com/en/wiki/hero-joker) ;
[Bella SatoriMeta](https://satorimeta.com/en/last-asylum/heroes/bella/) et
[Bella wiki](https://wiki-last-asylum.com/en/wiki/hero-bella).

C’est une concordance arithmétique, pas une validation des statistiques finales
sur un compte réel. Ne pas interpoler les niveaux absents, généraliser aux héros
non contrôlés ou ajouter ces valeurs à des statistiques qui incluent déjà les bonus.

## Pourquoi les autres fiches semblent diverger

Les fiches [Arthur](https://lastasylumplague.com/heroes/arthur/) et
[Marlena](https://lastasylumplague.com/heroes/marlena/) de LastAsylumPlague.com
annoncent toutes deux 2 236 301 PV, 15 971 ATQ et 15 971 DEF.
A Jack Of reprend les mêmes nombres pour
[Arthur](https://lastasylumplague.ajackof.com/heroes/arthur/) et
[Marlena](https://lastasylumplague.ajackof.com/heroes/marlena/).
Le périmètre des bonus n'est pas assez explicite pour les comparer aux seules
statistiques de niveau. Aucune moyenne ni priorité automatique entre ces nombres.

Les unités de progression diffèrent aussi : le wiki affiche 50 rangs là où
SatoriMeta affiche 10 étoiles. Le déblocage de Tenacity à rang 40 contre 8 étoiles
est compatible avec cinq rangs par étoile. Les compétences peuvent être montrées
à des niveaux différents : ne pas comparer deux pourcentages sans leur niveau,
leur variante, les étoiles, l’éveil et les bonus de vitesse.

## La formule de puissance reste partielle

La [page puissance du wiki](https://wiki-last-asylum.com/en/wiki/power) publie
`12,5 × ATQ + 7 × DEF + 0,15 × PV`, et mentionne aussi des contributions fixes
et des coefficients pour certains bonus. Les recherches ciblées n'ont pas fourni
une seconde confirmation indépendante de ces trois coefficients.

Contrôle de cohérence : la fiche Arthur donne un total de progression de
4 672 764 PV, 33 965 ATQ et 29 332 DEF. La somme pondérée donne **1 330 801,1**,
alors que sa colonne « Max Might » indique **1 052 453**. Les périmètres ou règles
de cumul ne sont donc pas suffisamment expliqués pour assimiler les deux.
Ce décalage ne prouve pas que les coefficients sont faux ; il empêche de les
présenter comme la formule complète de puissance du héros.

Enfin, le [modèle d’escouade du wiki](https://wiki-last-asylum.com/en/wiki/squad-model)
est une simulation de combat sur 30 secondes, avec des hypothèses et exclusions
explicites. Son score relatif ne remplace pas la puissance affichée en jeu.

## Décision pour le toolkit

La puissance reste libre, facultative et persistée par héros. Changer le niveau
ne l’écrase pas. Les boutons + / − sélectionnent le mode comme dans les stocks ; les boutons
de paliers appliquent ensuite la variation choisie,
sans descendre sous zéro. Une valeur vide reste inconnue ; cliquer sur un palier en mode + commence
explicitement à ce palier. Aucun coefficient incertain n’entre dans les données
actives, et les escouades continuent de sommer les puissances saisies.

Pour valider ultérieurement un calcul : relever puissance et statistiques sur
plusieurs héros, puis refaire les relevés après une seule amélioration à la fois
(niveau, rang, compétence, équipement). Consigner aussi recherches, Corbeau,
bonus du compte et version du jeu. Comparer les écarts, les arrondis et les effets
de seuil avant toute activation automatique.
