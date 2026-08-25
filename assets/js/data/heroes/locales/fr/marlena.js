// Transcribed from in-game French screenshots supplied by the player on 2026-08-25.
export default {
  source: 'in-game-screenshots',
  skills: [{
    slot: 1,
    name: 'Fente Céleste',
    type: 'Attaque Automatique',
    damage: 'DGT énergétiques',
    observedLevel: 1,
    observedSkillStars: 0,
    description: "Déchaîne une bourrasque d'épée, infligeant 91.35% DGT énergétiques d'ATQ à une cible unique.",
    upgrades: [
      { text: 'Inflige 40 % de dégâts additionnels.', unlockHeroStars: 1 },
      { text: 'Les dégâts additionnels augmentent à 100 %.', unlockHeroStars: 5 },
      { text: 'Les dégâts additionnels augmentent à 200 %.', unlockHeroStars: 10 }
    ]
  }, {
    slot: 2,
    name: 'Lame Sans Pareille',
    type: 'Compétence Ultime',
    damage: 'DGT énergétiques',
    cooldownSeconds: 15,
    observedLevel: 1,
    observedSkillStars: 0,
    description: "Lance 3 lames de vent qui ciblent aléatoirement un ennemi, infligeant 357.0% de DGT énergétiques d'ATQ.",
    upgrades: [
      { text: "Vent d'épée +1 ; chaque coup inflige 20 % de dégâts additionnels.", unlockHeroStars: 2 },
      { text: 'Chaque coup inflige 100 % de dégâts additionnels.', unlockHeroStars: 6 },
      { text: "Vent d'épée +1 ; chaque coup inflige 140 % de dégâts additionnels.", unlockHeroStars: 10 }
    ]
  }, {
    slot: 3,
    name: 'Floraison Cramoisie',
    type: 'Compétence Active',
    damage: 'DGT énergétiques',
    cooldownSeconds: 5,
    observedLevel: 1,
    observedSkillStars: 0,
    description: "Lance une fleur écarlate qui explose à l'impact, infligeant 204.75% de DGT énergétiques d'ATQ aux cibles à portée.",
    upgrades: [
      { text: "Inflige 20 % de dégâts additionnels et augmente l'ATQ de 12 % pendant 3 s.", unlockHeroStars: 3 },
      { text: 'Les dégâts additionnels augmentent à 70 %.', unlockHeroStars: 7 },
      { text: 'Les dégâts additionnels augmentent à 150 %.', unlockHeroStars: 9 }
    ]
  }, {
    slot: 4,
    name: 'Volonté du Dieu de la Guerre',
    type: 'Compétence Passive',
    observedLevel: 1,
    observedSkillStars: 0,
    description: 'En combat, augmente les DGT énergétiques infligés de 8.2%.',
    upgrades: [
      { text: "L'effet augmente de 1,6 %.", unlockHeroStars: 4 },
      { text: "L'effet augmente de 2,4 %.", unlockHeroStars: 9 },
      { text: "L'effet augmente de 4 %.", unlockHeroStars: 10 }
    ]
  }, {
    slot: 5,
    name: 'Ténacité',
    type: 'Compétence de soutien',
    observedLevel: 1,
    observedSkillStars: 0,
    description: 'ATQ, PV et DÉF +20 % ; vitesse de temps de recharge des compétences +10 %.',
    unlockHeroLevel: 30,
    unlockHeroStars: 8,
    upgrades: []
  }]
};
