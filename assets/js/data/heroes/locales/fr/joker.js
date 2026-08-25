export default {
  skills: [{
    slot: 1,
    name: 'Distribuer les cartes',
    type: 'Attaque automatique',
    damage: 'DGT physiques',
    description: "Lance une carte, infligeant 87.15% de DGT physiques d'ATQ à la cible ayant le moins de PV.",
    upgrades: [
      { text: 'Inflige 40 % de dégâts additionnels.', unlockHeroStars: 1 },
      { text: 'Les dégâts additionnels augmentent à 100 %.', unlockHeroStars: 5 },
      { text: 'Les dégâts additionnels augmentent à 200 %.', unlockHeroStars: 10 }
    ]
  }, {
    slot: 2,
    name: 'As joker',
    type: 'Compétence Ultime',
    damage: 'DGT physiques',
    cooldownSeconds: 15,
    description: "Lance 2 cartes joker, infligeant 706.65% de DGT physiques d'ATQ aux 2 ennemis ayant le moins de PV.",
    upgrades: [
      { text: 'Inflige 40 % de dégâts additionnels.', unlockHeroStars: 2 },
      { text: 'Les dégâts additionnels augmentent à 150 %.', unlockHeroStars: 6 },
      { text: "Cible d'attaque +1.", unlockHeroStars: 10 }
    ]
  }, {
    slot: 3,
    name: 'Carte rouge de chasse de cœur',
    type: 'Compétence Active',
    damage: 'DGT physiques',
    cooldownSeconds: 5,
    description: "Lance une carte cœur, infligeant 283.5% de DGT physiques d'ATQ à 2 cibles aléatoires.",
    upgrades: [
      { text: 'Inflige 40 % de dégâts additionnels.', unlockHeroStars: 3 },
      { text: 'Les dégâts additionnels augmentent à 100 %.', unlockHeroStars: 7 },
      { text: "Inflige [Brûlure] à la cible, lui infligeant 400% de dégâts d'attaque par seconde pendant 3 s.", unlockHeroStars: 9 }
    ]
  }, {
    slot: 4,
    name: 'Émotion frénétique',
    type: 'Compétence Passive',
    description: 'En combat, augmente le taux de critique de 8.2%.',
    upgrades: [
      { text: "L'effet augmente de 1,6%.", unlockHeroStars: 4 },
      { text: "L'effet augmente de 2,4%.", unlockHeroStars: 9 },
      { text: "L'effet augmente de 4%.", unlockHeroStars: 10 }
    ]
  }, {
    slot: 5,
    name: 'Ténacité',
    type: 'Compétence de soutien',
    description: 'ATQ, PV et DÉF +20 % ; vitesse de temps de recharge des compétences +10 %.',
    unlockHeroLevel: 30,
    unlockHeroStars: 8,
    upgrades: []
  }]
};
