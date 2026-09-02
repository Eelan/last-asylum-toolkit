export default {
  skills: [{
    slot: 1,
    name: 'Lame volante',
    type: 'Attaque automatique',
    damage: 'DGT physiques',
    description: "Lance une dague, infligeant des DGT physiques d'ATQ à un ennemi unique.",
    upgrades: [
      { text: 'Inflige 25 % de dégâts supplémentaires.', unlockHeroStars: 1 },
      { text: 'Les dégâts supplémentaires passent à 60 %.', unlockHeroStars: 5 },
      { text: 'Les dégâts supplémentaires augmentent à 120 %.', unlockHeroStars: 10 }
    ]
  }, {
    slot: 2,
    name: 'Lame ricochet',
    type: 'Compétence Ultime',
    damage: 'DGT physiques',
    cooldownSeconds: 9,
    description: "Lance une dague qui ricoche 3 fois, infligeant des DGT physiques d'ATQ à 3 ennemis aléatoires.",
    upgrades: [
      { text: 'Inflige 25 % de dégâts supplémentaires.', unlockHeroStars: 2 },
      { text: 'Les dégâts supplémentaires passent à 60 %.', unlockHeroStars: 6 },
      { text: 'Les dégâts supplémentaires augmentent à 120 %.', unlockHeroStars: 10 }
    ]
  }, {
    slot: 3,
    name: 'Lotus mortel',
    type: 'Compétence Active',
    damage: 'DGT physiques',
    cooldownSeconds: 5,
    description: "Lance 2 dagues simultanément, infligeant des DGT physiques d'ATQ à 2 ennemis aléatoires.",
    upgrades: [
      { text: 'Inflige 25 % de dégâts supplémentaires.', unlockHeroStars: 3 },
      { text: 'Les dégâts supplémentaires passent à 60 %.', unlockHeroStars: 7 },
      { text: 'Les dégâts supplémentaires augmentent à 120 %.', unlockHeroStars: 9 }
    ]
  }, {
    slot: 4,
    name: 'Chasse ultime',
    type: 'Compétence Passive',
    description: "En combat, augmente les dégâts infligés aux monstres ainsi que les 3 types de ressources obtenues en vainquant des monstres de ressource et d'élite pour votre escouade.",
    upgrades: [
      { text: 'Bonus de dégâts : +1,2 %. Bonus de ressource : +4 %.', unlockHeroStars: 4 },
      { text: 'Bonus de dégâts : +1,8 %. Bonus de ressource : +6 %.', unlockHeroStars: 9 },
      { text: 'Bonus de dégâts : +3 %. Bonus de ressource : +10 %.', unlockHeroStars: 10 }
    ]
  }, {
    slot: 5,
    name: 'Ténacité',
    type: 'Compétence de soutien',
    description: 'ATQ, PV et DÉF +10 %.',
    unlockHeroLevel: 30,
    unlockHeroStars: 8,
    upgrades: []
  }]
};
