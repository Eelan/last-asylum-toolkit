export default {
  skills: [{
    slot: 1,
    name: 'Bouclier de Bataille',
    type: 'Attaque automatique',
    damage: 'DGT physiques',
    description: "Assène un coup de bouclier, infligeant 300.0% de DGT Physiques d'ATQ à un ennemi unique.",
    upgrades: [
      { text: 'Inflige 40 % de dégâts additionnels.', unlockHeroStars: 1 },
      { text: 'Les dégâts additionnels augmentent à 100 %.', unlockHeroStars: 5 },
      { text: 'Les dégâts additionnels augmentent à 200 %.', unlockHeroStars: 10 }
    ]
  }, {
    slot: 2,
    name: 'Fracas Terrestre',
    type: 'Compétence Ultime',
    damage: 'DGT physiques',
    cooldownSeconds: 7,
    description: "Assène un coup de bouclier au sol, infligeant 844.5% de DGT physiques d'ATQ aux ennemis à portée, et réduisant les DGT physiques subis par les alliés à portée de 20.0% pendant 5 s.",
    upgrades: [
      { text: 'Réduction des DGT physiques augmentée de 3 %.', unlockHeroStars: 2 },
      { text: 'Réduction des DGT physiques augmentée de 4,5 %.', unlockHeroStars: 6 },
      { text: 'Réduction des DGT physiques augmentée de 7,5 %.', unlockHeroStars: 10 }
    ]
  }, {
    slot: 3,
    name: 'Inébranlable',
    type: 'Compétence Active',
    cooldownSeconds: 5,
    description: "Confère un bouclier équivalent à 9.0% des PV max actuels, absorbant 50 % des dégâts subis, d'une durée de 3 s.",
    upgrades: [
      { text: 'Effet du bouclier augmenté de 20 %.', unlockHeroStars: 3 },
      { text: 'Effet du bouclier augmenté de 30 %.', unlockHeroStars: 7 },
      { text: 'Effet du bouclier augmenté de 50 %.', unlockHeroStars: 9 }
    ]
  }, {
    slot: 4,
    name: 'Volonté de fer',
    type: 'Compétence Passive',
    description: 'En combat, réduit tous les dégâts reçus par les héros tanks alliés de 4.35%.',
    upgrades: [
      { text: 'Effet augmenté de 0,6 %.', unlockHeroStars: 4 },
      { text: 'Effet augmenté de 0,9 %.', unlockHeroStars: 9 },
      { text: 'Effet augmenté de 1,5 %.', unlockHeroStars: 10 }
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
