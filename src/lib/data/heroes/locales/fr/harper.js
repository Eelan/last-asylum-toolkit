export default {
  skills: [{
    slot: 1,
    name: 'Bulle',
    type: 'Attaque Automatique',
    damage: 'DGT énergétiques',
    description: "Joue de la flûte pour créer des bulles, infligeant 87.15% de DGT énergétiques d'ATQ à un ennemi unique.",
    upgrades: [
      { text: 'Inflige 40 % de dégâts additionnels.', unlockHeroStars: 1 },
      { text: 'Les dégâts additionnels augmentent à 100 %.', unlockHeroStars: 5 },
      { text: 'Les dégâts additionnels augmentent à 200 %.', unlockHeroStars: 10 }
    ]
  }, {
    slot: 2,
    name: 'Son de flûte de guerre',
    type: 'Compétence Ultime',
    cooldownSeconds: 14,
    description: "Harper joue de la flûte de guerre pour inspirer ses alliés, augmentant l'ATQ de tous les héros alliés de 15.375% pendant 5 s.",
    upgrades: [
      { text: "Après l'incantation, augmente les DGT énergétiques infligés par tous les alliés de 4,5 % pendant 7 s.", unlockHeroStars: 2 },
      { text: "Bonus d'ATQ augmenté de 4,5%.", unlockHeroStars: 6 },
      { text: "Durée du bonus d'ATQ +5 s.", unlockHeroStars: 10 }
    ]
  }, {
    slot: 3,
    name: 'Bulle vitale',
    type: 'Compétence Active',
    cooldownSeconds: 5,
    description: "Harper crée une bulle, réduisant les dégâts subis par l'allié ayant le moins de PV de 8.2% pendant 4 s.",
    upgrades: [
      { text: "L'effet augmente de 1,6%.", unlockHeroStars: 3 },
      { text: "L'effet augmente de 2,4%.", unlockHeroStars: 7 },
      { text: 'Cible +1.', unlockHeroStars: 9 }
    ]
  }, {
    slot: 4,
    name: 'Hymne du guerrier',
    type: 'Compétence Passive',
    description: "En combat, augmente l'ATQ de tous les héros guerriers alliés de 6.15%.",
    upgrades: [
      { text: 'Effet augmenté de 1,2 %.', unlockHeroStars: 4 },
      { text: 'Effet augmenté de 1,8 %.', unlockHeroStars: 9 },
      { text: "L'effet augmente de 3%.", unlockHeroStars: 10 }
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
