export const GAME_DATA = {
  // #region Heroes
  // Stable ids let several tools reference the same hero without coupling saved data to display labels.
  "heroes": [{ "id": "annie", "name": "Annie", "rarity": "ur", "faction": "warlock", "role": "carry", "image": "assets/images/heroes/annie.webp" },
    { "id": "arthur", "name": "Arthur", "rarity": "ur", "faction": "warrior", "role": "tank", "image": "assets/images/heroes/arthur.webp" },
    { "id": "bell", "name": "Bell", "rarity": "ur", "faction": "ranger", "role": "support", "image": "assets/images/heroes/bell.webp" },
    { "id": "billy", "name": "Billy", "rarity": "ur", "faction": "warlock", "role": "tank", "image": "assets/images/heroes/billy.webp" },
    { "id": "cynthia", "name": "Cynthia", "rarity": "ur", "faction": "ranger", "role": "carry", "image": "assets/images/heroes/cynthia.webp" },
    { "id": "daskal", "name": "Daskal", "rarity": "ur", "faction": "warrior", "role": "tank", "image": "assets/images/heroes/daskal.webp" },
    { "id": "harper", "name": "Harper", "rarity": "ur", "faction": "warrior", "role": "support", "image": "assets/images/heroes/harper.webp" },
    { "id": "joker", "name": "Joker", "rarity": "ur", "faction": "warlock", "role": "carry", "image": "assets/images/heroes/joker.webp" },
    { "id": "louis", "name": "Louis", "rarity": "ur", "faction": "ranger", "role": "tank", "image": "assets/images/heroes/louis.webp" },
    { "id": "marlena", "name": "Marlena", "rarity": "ur", "faction": "warrior", "role": "carry", "image": "assets/images/heroes/marlena.webp" },
    { "id": "nicole", "name": "Nicole", "rarity": "ur", "faction": "warlock", "role": "support", "image": "assets/images/heroes/nicole.webp" },
    { "id": "red-lady", "name": "Red Lady", "rarity": "ur", "faction": "ranger", "role": "carry", "image": "assets/images/heroes/red-lady.webp" },
    { "id": "shadow", "name": "Shadow", "rarity": "ur", "faction": "ranger", "role": "tank", "image": "assets/images/heroes/shadow.webp" },
    { "id": "ulfrid", "name": "Ulfrid", "rarity": "ur", "faction": "warlock", "role": "tank", "image": "assets/images/heroes/ulfrid.webp" },
    { "id": "zoya", "name": "Zoya", "rarity": "ur", "faction": "warrior", "role": "carry", "image": "assets/images/heroes/zoya.webp" },
    { "id": "ash", "name": "Ash", "rarity": "ssr", "faction": "ranger", "role": "carry", "image": "assets/images/heroes/ash.webp" },
    { "id": "bella", "name": "Bella", "rarity": "ssr", "faction": "warrior", "role": "tank", "image": "assets/images/heroes/bella.webp" },
    { "id": "bestar", "name": "Bestar", "rarity": "ssr", "faction": "ranger", "role": "carry", "image": "assets/images/heroes/bestar.webp" },
    { "id": "celia", "name": "Celia", "rarity": "ssr", "faction": "warrior", "role": "support", "image": "assets/images/heroes/celia.webp" },
    { "id": "claire", "name": "Claire", "rarity": "ssr", "faction": "warrior", "role": "carry", "image": "assets/images/heroes/claire.webp" },
    { "id": "grenwald", "name": "Grenwald", "rarity": "ssr", "faction": "warlock", "role": "carry", "image": "assets/images/heroes/grenwald.webp" },
    { "id": "griffith", "name": "Griffith", "rarity": "ssr", "faction": "ranger", "role": "tank", "image": "assets/images/heroes/griffith.webp" },
    { "id": "hastar", "name": "Hastar", "rarity": "ssr", "faction": "warlock", "role": "tank", "image": "assets/images/heroes/hastar.webp" },
    { "id": "kesso", "name": "Kesso", "rarity": "ssr", "faction": "warrior", "role": "carry", "image": "assets/images/heroes/kesso.webp" },
    { "id": "lucius", "name": "Lucius", "rarity": "ssr", "faction": "warrior", "role": "tank", "image": "assets/images/heroes/lucius.webp" },
    { "id": "sivir", "name": "Sivir", "rarity": "ssr", "faction": "warrior", "role": "carry", "image": "assets/images/heroes/sivir.webp" },
    { "id": "stellar", "name": "Stellar", "rarity": "ssr", "faction": "warlock", "role": "support", "image": "assets/images/heroes/stellar.webp" },
    { "id": "durant", "name": "Durant", "rarity": "sr", "faction": "warrior", "role": "tank", "image": "assets/images/heroes/durant.webp" },
    { "id": "kafa", "name": "Kafa", "rarity": "sr", "faction": "warlock", "role": "carry", "image": "assets/images/heroes/kafa.webp" },
    { "id": "robin", "name": "Robin", "rarity": "sr", "faction": "ranger", "role": "carry", "image": "assets/images/heroes/robin.webp" },
    { "id": "william", "name": "William", "rarity": "sr", "faction": "warrior", "role": "carry", "image": "assets/images/heroes/william.webp" }],

  // Compact skill tuples encode [name, type, unlock level]. Skill names remain the in-game labels.
  "heroProfiles": {
    "annie": { "counters": "ranger", "counteredBy": "warrior", "awakenable": true, "skills": [["Candy", "auto-attack", 1], ["Candy Jar", "ultimate-skill", 5], ["Surprise Gift", "active-skill", 10], ["Charged Gummies", "passive-skill", 20], ["Tenacity", "support-skill", 30]] },
    "arthur": { "counters": "warlock", "counteredBy": "ranger", "awakenable": false, "skills": [["Battle Shield", "auto-attack", 1], ["Earthshattering", "ultimate-skill", 5], ["Rock Solid", "active-skill", 10], ["Strong Will", "passive-skill", 20], ["Tenacity", "support-skill", 30]] },
    "ash": { "counters": "warrior", "counteredBy": "warlock", "awakenable": false, "skills": [["Precision Shot", "auto-attack", 1], ["Eagle Spirit Hunt", "ultimate-skill", 5], ["One Stone Two Birds", "active-skill", 10], ["Focus", "passive-skill", 20], ["Tenacity", "support-skill", 30]] },
    "bell": { "counters": "warrior", "counteredBy": "warlock", "awakenable": false, "skills": [["Musical Note", "auto-attack", 1], ["Inspiration", "ultimate-skill", 5], ["Healing Sound", "active-skill", 10], ["Battle Anthem", "passive-skill", 20], ["Tenacity", "support-skill", 30]] },
    "bella": { "counters": "warlock", "counteredBy": "ranger", "awakenable": false, "skills": [["Swing", "auto-attack", 1], ["Bloody Requiem", "ultimate-skill", 5], ["Crimson Prayer", "active-skill", 10], ["Purity", "passive-skill", 20], ["Tenacity", "support-skill", 30]] },
    "bestar": { "counters": "warrior", "counteredBy": "warlock", "awakenable": false, "skills": [["Cat Bell", "auto-attack", 1], ["Sacred Flame Kitty", "ultimate-skill", 5], ["Black Cat Messenger", "active-skill", 10], ["Bloodstain Tracker", "passive-skill", 20], ["Tenacity", "support-skill", 30]] },
    "billy": { "counters": "ranger", "counteredBy": "warrior", "awakenable": false, "skills": [["Wooden Frame", "auto-attack", 1], ["Truth and Lies", "ultimate-skill", 5], ["Fate's Thread", "active-skill", 10], ["Puppet", "passive-skill", 20], ["Tenacity", "support-skill", 30]] },
    "celia": { "counters": "warlock", "counteredBy": "ranger", "awakenable": false, "skills": [["Flying Blade", "auto-attack", 1], ["Ricochet Blade", "ultimate-skill", 5], ["Deadly Lotus", "active-skill", 10], ["Ultimate Hunt", "passive-skill", 20], ["Tenacity", "support-skill", 30]] },
    "claire": { "counters": "warlock", "counteredBy": "ranger", "awakenable": false, "skills": [["Holy Banner", "auto-attack", 1], ["Celestial Judgment", "ultimate-skill", 5], ["Rain of Arrows", "active-skill", 10], ["Call of the Brave", "passive-skill", 20], ["Tenacity", "support-skill", 30]] },
    "cynthia": { "counters": "warrior", "counteredBy": "warlock", "awakenable": true, "skills": [["Moon Blade", "auto-attack", 1], ["Moonfall Dance", "ultimate-skill", 5], ["Lunar Hunt", "active-skill", 10], ["Moon's Blessing", "passive-skill", 20], ["Tenacity", "support-skill", 30]] },
    "daskal": { "counters": "warlock", "counteredBy": "ranger", "awakenable": false, "skills": [["Battle Will", "auto-attack", 1], ["Bloodshed Defense", "ultimate-skill", 5], ["Deadly Pierce", "active-skill", 10], ["Resolute Fight", "passive-skill", 20], ["Tenacity", "support-skill", 30]] },
    "durant": { "counters": "warlock", "counteredBy": "ranger", "awakenable": false, "skills": [["Slash", "auto-attack", 1], ["Blade Fury", "ultimate-skill", 5], ["Leap Slash", "active-skill", 10], ["Unyielding", "support-skill", 30]] },
    "grenwald": { "counters": "ranger", "counteredBy": "warrior", "awakenable": false, "skills": [["Cast Spell", "auto-attack", 1], ["Soul Capture Spell", "ultimate-skill", 5], ["Heartbreaker Spell", "active-skill", 10], ["Exorcism Spell", "passive-skill", 20], ["Tenacity", "support-skill", 30]] },
    "griffith": { "counters": "warrior", "counteredBy": "warlock", "awakenable": false, "skills": [["Serpent Flute", "auto-attack", 1], ["Serpent Veil", "ultimate-skill", 5], ["Venomous Bite", "active-skill", 10], ["Serpent Resonance", "passive-skill", 20], ["Tenacity", "support-skill", 30]] },
    "harper": { "counters": "warlock", "counteredBy": "ranger", "awakenable": false, "skills": [["Bubble", "auto-attack", 1], ["War Flute Sound", "ultimate-skill", 5], ["Vitality Bubble", "active-skill", 10], ["Warrior's Anthem", "passive-skill", 20], ["Tenacity", "support-skill", 30]] },
    "hastar": { "counters": "ranger", "counteredBy": "warrior", "awakenable": false, "skills": [["Lash", "auto-attack", 1], ["Wrath of Old Gods", "ultimate-skill", 5], ["Undercurrent", "active-skill", 10], ["Scorn Guard", "passive-skill", 20], ["Tenacity", "support-skill", 30]] },
    "joker": { "counters": "ranger", "counteredBy": "warrior", "awakenable": false, "skills": [["Deal Cards", "auto-attack", 1], ["Joker Ace", "ultimate-skill", 5], ["Hearthunt Red Card", "active-skill", 10], ["Frenzied Emotion", "passive-skill", 20], ["Tenacity", "support-skill", 30]] },
    "kafa": { "counters": "ranger", "counteredBy": "warrior", "awakenable": false, "skills": [["Coffee", "auto-attack", 1], ["Love Infusion", "ultimate-skill", 5], ["Double Expresso", "active-skill", 10], ["Unyielding", "support-skill", 30]] },
    "kesso": { "counters": "warlock", "counteredBy": "ranger", "awakenable": false, "skills": [["Spear Throw", "auto-attack", 1], ["Summon Warhawk", "ultimate-skill", 5], ["Hunting Skills", "active-skill", 10], ["Wild Survival", "passive-skill", 20], ["Tenacity", "support-skill", 30]] },
    "louis": { "counters": "warrior", "counteredBy": "warlock", "awakenable": false, "skills": [["Shackles", "auto-attack", 1], ["Cross Whip", "ultimate-skill", 5], ["Force Link", "active-skill", 10], ["Indomitable Spirit", "passive-skill", 20], ["Tenacity", "support-skill", 30]] },
    "lucius": { "counters": "warlock", "counteredBy": "ranger", "awakenable": false, "skills": [["Battle Axe", "auto-attack", 1], ["Whirlwind Cut", "ultimate-skill", 5], ["Decapitation", "active-skill", 10], ["God of War Blessing", "passive-skill", 20], ["Tenacity", "support-skill", 30]] },
    "marlena": { "counters": "warlock", "counteredBy": "ranger", "awakenable": true, "skills": [["Skybreaker Slash", "auto-attack", 1], ["Peerless Blade", "ultimate-skill", 5], ["Crimson Bloom", "active-skill", 10], ["War God's Will", "passive-skill", 20], ["Tenacity", "support-skill", 30]] },
    "nicole": { "counters": "ranger", "counteredBy": "warrior", "awakenable": false, "skills": [["Ember Dust", "auto-attack", 1], ["Inferno Array", "ultimate-skill", 5], ["Heartwarming Flame", "active-skill", 10], ["Flame Soul Power", "passive-skill", 20], ["Tenacity", "support-skill", 30]] },
    "red-lady": { "counters": "warrior", "counteredBy": "warlock", "awakenable": false, "skills": [["Blood Blade", "auto-attack", 1], ["Crimson Rose", "ultimate-skill", 5], ["Bloodthirsty Slaughter", "active-skill", 10], ["Lone Flower", "passive-skill", 20], ["Tenacity", "support-skill", 30]] },
    "robin": { "counters": "warrior", "counteredBy": "warlock", "awakenable": false, "skills": [["Aim", "auto-attack", 1], ["Rapid Fire", "ultimate-skill", 5], ["Arrow of Retribution", "active-skill", 10], ["Unyielding", "support-skill", 30]] },
    "shadow": { "counters": "warrior", "counteredBy": "warlock", "awakenable": false, "skills": [["Smoke Cartridge", "auto-attack", 1], ["Shadow Hunt", "ultimate-skill", 5], ["Shadow Strike", "active-skill", 10], ["Shadow Veil", "passive-skill", 20], ["Tenacity", "support-skill", 30]] },
    "sivir": { "counters": "warlock", "counteredBy": "ranger", "awakenable": false, "skills": [["Hunt", "auto-attack", 1], ["Wild Pursuit", "ultimate-skill", 5], ["Shield Strike", "active-skill", 10], ["Hunter Bloodline", "passive-skill", 20], ["Tenacity", "support-skill", 30]] },
    "stellar": { "counters": "ranger", "counteredBy": "warrior", "awakenable": false, "skills": [["Meteorite", "auto-attack", 1], ["Wishing Star", "ultimate-skill", 5], ["Destructive Comet", "active-skill", 10], ["Final Starlight", "passive-skill", 20], ["Tenacity", "support-skill", 30]] },
    "ulfrid": { "counters": "ranger", "counteredBy": "warrior", "awakenable": false, "skills": [["Sharp Claw", "auto-attack", 1], ["Throat Bite", "ultimate-skill", 5], ["Lunar Howl", "active-skill", 10], ["Wolf Bloodline", "passive-skill", 20], ["Tenacity", "support-skill", 30]] },
    "william": { "counters": "warlock", "counteredBy": "ranger", "awakenable": false, "skills": [["Sword Gale", "auto-attack", 1], ["Whirlwind Blade", "ultimate-skill", 5], ["Twin Wind", "active-skill", 10], ["Unyielding", "support-skill", 30]] },
    "zoya": { "counters": "warlock", "counteredBy": "ranger", "awakenable": false, "skills": [["Dagger", "auto-attack", 1], ["Forest Hunter", "ultimate-skill", 5], ["Mountain God Wrath", "active-skill", 10], ["Lady of the Forest", "passive-skill", 20], ["Tenacity", "support-skill", 30]] }
  },
  // Skill detail tuples encode [damage type or null, maximum level].
  "heroProfileDetails": {
    "annie": { "title": "helpful", "skills": [["energy", 40], ["energy", 40], ["energy", 40], [null, 40], [null, 1]] },
    "arthur": { "title": "diligent", "skills": [["physical", 40], ["physical", 40], [null, 40], [null, 40], [null, 1]] },
    "ash": { "title": "brave", "skills": [["physical", 40], ["physical", 40], ["physical", 40], [null, 40], [null, 1]] },
    "bell": { "title": "diligent", "skills": [["physical", 40], [null, 40], [null, 40], [null, 40], [null, 1]] },
    "bella": { "title": "aloof", "skills": [["physical", 40], ["physical", 40], [null, 40], [null, 40], [null, 1]] },
    "bestar": { "title": "helpful", "skills": [["physical", 40], ["physical", 40], ["physical", 40], [null, 40], [null, 1]] },
    "billy": { "title": "helpful", "skills": [["physical", 40], ["physical", 40], ["physical", 40], [null, 40], [null, 1]] },
    "celia": { "title": "diligent", "skills": [["physical", 40], ["physical", 40], ["physical", 40], [null, 40], [null, 1]] },
    "claire": { "title": "helpful", "skills": [["physical", 40], ["physical", 40], ["physical", 40], [null, 40], [null, 1]] },
    "cynthia": { "title": "diligent", "skills": [["energy", 40], ["energy", 40], ["energy", 40], [null, 40], [null, 1]] },
    "daskal": { "title": "helpful", "skills": [["physical", 40], [null, 40], ["physical", 40], [null, 40], [null, 1]] },
    "durant": { "title": "steady", "skills": [["physical", 40], ["physical", 40], ["physical", 40], [null, 40]] },
    "grenwald": { "title": "smart", "skills": [["energy", 40], ["energy", 40], ["energy", 40], [null, 40], [null, 1]] },
    "griffith": { "title": "diligent", "skills": [["energy", 40], [null, 40], ["energy", 40], [null, 40], [null, 1]] },
    "harper": { "title": "diligent", "skills": [["energy", 40], [null, 40], [null, 40], [null, 40], [null, 1]] },
    "hastar": { "title": "diligent", "skills": [["energy", 40], ["energy", 40], ["energy", 40], [null, 40], [null, 1]] },
    "joker": { "title": "steady", "skills": [["physical", 40], ["physical", 40], ["physical", 40], [null, 40], [null, 1]] },
    "kafa": { "title": "steady", "skills": [["physical", 40], ["physical", 40], ["physical", 40], [null, 40]] },
    "kesso": { "title": "diligent", "skills": [["physical", 40], ["physical", 40], ["physical", 40], [null, 40], [null, 1]] },
    "louis": { "title": "steady", "skills": [["physical", 40], ["physical", 40], [null, 40], [null, 40], [null, 1]] },
    "lucius": { "title": "helpful", "skills": [["physical", 40], ["physical", 40], ["physical", 40], [null, 40], [null, 1]] },
    "marlena": { "title": "helpful", "skills": [["energy", 40], ["energy", 40], ["energy", 40], [null, 40], [null, 1]] },
    "nicole": { "title": "helpful", "skills": [["physical", 40], ["physical", 40], [null, 40], [null, 40], [null, 1]] },
    "red-lady": { "title": "steady", "skills": [["energy", 40], ["energy", 40], ["energy", 40], [null, 40], [null, 1]] },
    "robin": { "title": "complacent", "skills": [["physical", 40], ["physical", 40], ["physical", 40], [null, 40]] },
    "shadow": { "title": "steady", "skills": [["physical", 40], ["physical", 40], ["physical", 40], [null, 40], [null, 1]] },
    "sivir": { "title": "steady", "skills": [["physical", 40], ["physical", 40], ["physical", 40], [null, 40], [null, 1]] },
    "stellar": { "title": "helpful", "skills": [["physical", 40], [null, 40], ["physical", 40], [null, 40], [null, 1]] },
    "ulfrid": { "title": "diligent", "skills": [["physical", 40], ["physical", 40], ["physical", 40], [null, 40], [null, 1]] },
    "william": { "title": "diligent", "skills": [["physical", 40], ["physical", 40], ["physical", 40], [null, 40]] },
    "zoya": { "title": "helpful", "skills": [["energy", 40], ["energy", 40], ["energy", 40], [null, 40], [null, 1]] }
  },
  // #endregion

  // #region Hero levels and Antitoxin
  "antitoxin": {
    "2": 100,
    "3": 200,
    "4": 300,
    "5": 500,
    "6": 700,
    "7": 900,
    "8": 1100,
    "9": 1300,
    "10": 1500,
    "11": 2100,
    "12": 2700,
    "13": 3300,
    "14": 3900,
    "15": 4700,
    "16": 5500,
    "17": 6300,
    "18": 7100,
    "19": 7900,
    "20": 8700,
    "21": 9700,
    "22": 10700,
    "23": 11700,
    "24": 12700,
    "25": 13900,
    "26": 15100,
    "27": 16300,
    "28": 17500,
    "29": 18700,
    "30": 19900,
    "31": 21900,
    "32": 23900,
    "33": 25900,
    "34": 27900,
    "35": 29900,
    "36": 31900,
    "37": 33900,
    "38": 35900,
    "39": 37900,
    "40": 39900,
    "41": 41900,
    "42": 43900,
    "43": 45900,
    "44": 47900,
    "45": 137900,
    "46": 227900,
    "47": 317900,
    "48": 407900,
    "49": 497900,
    "50": 587900,
    "51": 677900,
    "52": 767900,
    "53": 857900,
    "54": 947900,
    "55": 1050000,
    "56": 1150000,
    "57": 1250000,
    "58": 1350000,
    "59": 1450000,
    "60": 1550000,
    "61": 1650000,
    "62": 1750000,
    "63": 1850000,
    "64": 1950000,
    "65": 2500000,
    "66": 3000000,
    "67": 3600000,
    "68": 4200000,
    "69": 4800000,
    "70": 5500000,
    "71": 6000000,
    "72": 6700000,
    "73": 7200000,
    "74": 7800000,
    "75": 8400000,
    "76": 9100000,
    "77": 9700000,
    "78": 10200000,
    "79": 10900000,
    "80": 11800000,
    "81": 12700000,
    "82": 13600000,
    "83": 14500000,
    "84": 15400000,
    "85": 16300000,
    "86": 17200000,
    "87": 18100000,
    "88": 19000000,
    "89": 19900000,
    "90": 20800000,
    "91": 21700000,
    "92": 22600000,
    "93": 23500000,
    "94": 24400000,
    "95": 26100000,
    "96": 27800000,
    "97": 29500000,
    "98": 31200000,
    "99": 32900000,
    "100": 34600000,
    "101": 36300000,
    "102": 38000000,
    "103": 39700000,
    "104": 41400000,
    "105": 43100000,
    "106": 44800000,
    "107": 46500000,
    "108": 48200000,
    "109": 49900000,
    "110": 51600000,
    "111": 53300000,
    "112": 55000000,
    "113": 56700000,
    "114": 58400000,
    "115": 60700000,
    "116": 63000000,
    "117": 65300000,
    "118": 67600000,
    "119": 69900000,
    "120": 72200000,
    "121": 74500000,
    "122": 76800000,
    "123": 79100000,
    "124": 81400000,
    "125": 83700000,
    "126": 86000000,
    "127": 88300000,
    "128": 90600000,
    "129": 92900000,
    "130": 96500000,
    "131": 100100000,
    "132": 104000000,
    "133": 108000000,
    "134": 112000000,
    "135": 116000000,
    "136": 120000000,
    "137": 124000000,
    "138": 128000000,
    "139": 132000000,
    "140": 136000000,
    "141": 140000000,
    "142": 144000000,
    "143": 148000000,
    "144": 152000000,
    "145": 156000000,
    "146": 160000000,
    "147": 164000000,
    "148": 168000000
  },
  // #endregion

  // #region Sanctuary progression
  // Rows: [level, power, grain, timber, herb, stars, Antitoxin reward, seconds, prerequisites].
  "sanctuary": [
    [1,900,29,29,0,0,5000,2,[]],
    [2,1600,32,32,0,0,5000,2,[]],
    [3,2500,983,983,0,17,5000,3,[]],
    [4,3400,2598,2598,0,19,5000,300,[["lumber_depot",1],["granary",1],["herb_storage",1]]],
    [5,4400,19730,19730,0,28,80000,658,[["walls",3]]],
    [6,5300,92710,92710,0,47,80000,2063,[["walls",5]]],
    [7,6200,235800,235800,0,61,90000,5440,[["training_grounds",4],["alliance_hall",3]]],
    [8,7000,395600,395600,0,80,130000,10895,[["training_grounds",6],["alliance_hall",5]]],
    [9,8300,605800,605800,208700,96,210000,15410,[["walls",8],["alliance_hall",7]]],
    [10,9700,748700,748700,232900,112,330000,20123,[["walls",9],["infirmary",7]]],
    [11,12000,1853000,1853000,601800,142,504000,26043,[["training_grounds",10],["research_lab",7]]],
    [12,14900,3104000,3104000,959000,155,799000,33857,[["research_lab",11],["walls",10],["antitoxin_workshop",7]]],
    [13,17700,3519000,3519000,1082000,173,1290000,44013,[["research_lab",12],["alliance_hall",11],["farm",7]]],
    [14,21200,4913000,4913000,1645000,193,2260000,57218,[["research_lab",13],["warrior_statue",12],["lumberyard",7]]],
    [15,25600,6474000,6474000,2290000,201,3720000,80105,[["research_lab",14],["training_grounds",14],["herb_garden",7]]],
    [16,30900,11900000,11900000,3970000,215,6350000,112146,[["research_lab",15],["warrior_statue",14],["granary",7]]],
    [17,37400,16670000,16670000,5138000,225,11300000,157004,[["research_lab",16],["barracks",15],["lumber_depot",7]]],
    [18,45700,28220000,28220000,9329000,231,19500000,219807,[["research_lab",17],["training_grounds",17],["herb_storage",7]]],
    [19,54900,32710000,32710000,11340000,237,31100000,307728,[["research_lab",18],["warrior_statue",17],["antitoxin_workshop",10]]],
    [20,67300,60030000,60030000,18410000,247,46200000,430820,[["research_lab",19],["alliance_hall",18],["farm",10]]],
    [21,81500,85450000,85450000,27640000,254,63500000,577211,[["research_lab",20],["training_grounds",20],["lumberyard",10]]],
    [22,98300,111200000,111200000,36660000,260,84700000,750375,[["research_lab",21],["warrior_statue",21],["herb_garden",10]]],
    [23,116700,145200000,145200000,42760000,270,95800000,975487,[["research_lab",22],["infirmary",22],["granary",10]]],
    [24,137300,171200000,171200000,56250000,282,110000000,1365682,[["research_lab",23],["walls",23],["lumber_depot",10]]],
    [25,164400,277900000,277900000,97530000,292,122000000,1911955,[["research_lab",24],["training_grounds",24],["herb_storage",10]]],
    [26,195900,386800000,386800000,123500000,304,125000000,2676737,[["research_lab",25],["warrior_statue",25],["antitoxin_workshop",13]]],
    [27,232300,548000000,548000000,168600000,314,134000000,3747432,[["research_lab",26],["training_grounds",26],["farm",13]]],
    [28,275200,731100000,731100000,236500000,326,164000000,5246404,[["research_lab",27],["barracks",27],["lumberyard",13]]],
    [29,325300,1047000000,1047000000,316400000,326,178000000,6820324,[["research_lab",28],["alliance_hall",28],["herb_garden",13]]],
    [30,384300,1356000000,1356000000,441300000,326,199000000,8866423,[["research_lab",29],["training_grounds",29],["antitoxin_workshop",15]]]
  ],
  // #endregion

  // #region Corbeau progression
  // Rows are [from level, to level, Fruit cost, Essence cost].
  "raven": [
    [1,4,1000,0], [5,5,2250,1], [6,9,1500,0], [10,10,3000,2],
    [11,14,2000,0], [15,15,3750,4], [16,19,3600,0], [20,20,4500,6],
    [21,24,5600,0], [25,25,5250,8], [26,29,6000,0], [30,30,6000,10],
    [31,34,15000,0], [35,35,7500,12], [36,39,15000,0], [40,40,7500,16],
    [41,44,15000,0], [45,45,7500,20], [46,49,15000,0], [50,50,7500,24],
    [51,54,22500,0], [55,55,9000,28], [56,59,22500,0], [60,60,9000,32],
    [61,64,22500,0], [65,65,9000,36], [66,69,22500,0], [70,70,9000,40],
    [71,74,25000,0], [75,75,10500,50], [76,79,25000,0], [80,80,10500,60],
    [81,84,25000,0], [85,85,10500,70], [86,89,25000,0], [90,90,10500,80],
    [91,94,30000,0], [95,95,12000,90], [96,99,30000,0], [100,100,12000,100],
    [101,104,30000,0], [105,105,15000,120], [106,109,30000,0], [110,110,15000,140],
    [111,114,80000,0], [115,115,36000,160], [116,119,80000,0], [120,120,36000,200],
    [121,124,82000,0], [125,125,42000,300], [126,129,82000,0], [130,130,42000,400],
    [131,134,92000,0], [135,135,48000,600], [136,139,92000,0], [140,140,48000,800],
    [141,144,105000,0], [145,145,60000,1000], [146,149,105000,0], [150,159,180000,100],
    [160,169,216000,120], [170,179,252000,140], [180,189,288000,160],
    [190,199,324000,180], [200,209,360000,200], [210,219,396000,220],
    [220,229,432000,240], [230,239,468000,260], [240,249,504000,280]
  ],
  // #endregion

  // #region Hero stars and fragments
  "stars": [{
    "value": 0.0,
    "cost": 0
  }, {
    "value": 0.2,
    "cost": 2
  }, {
    "value": 0.4,
    "cost": 2
  }, {
    "value": 0.6,
    "cost": 2
  }, {
    "value": 0.8,
    "cost": 2
  }, {
    "value": 1.0,
    "cost": 2
  }, {
    "value": 1.2,
    "cost": 3
  }, {
    "value": 1.4,
    "cost": 3
  }, {
    "value": 1.6,
    "cost": 3
  }, {
    "value": 1.8,
    "cost": 3
  }, {
    "value": 2.0,
    "cost": 3
  }, {
    "value": 2.2,
    "cost": 4
  }, {
    "value": 2.4,
    "cost": 4
  }, {
    "value": 2.6,
    "cost": 4
  }, {
    "value": 2.8,
    "cost": 4
  }, {
    "value": 3.0,
    "cost": 4
  }, {
    "value": 3.2,
    "cost": 6
  }, {
    "value": 3.4,
    "cost": 6
  }, {
    "value": 3.6,
    "cost": 6
  }, {
    "value": 3.8,
    "cost": 6
  }, {
    "value": 4.0,
    "cost": 6
  }, {
    "value": 4.2,
    "cost": 8
  }, {
    "value": 4.4,
    "cost": 8
  }, {
    "value": 4.6,
    "cost": 8
  }, {
    "value": 4.8,
    "cost": 8
  }, {
    "value": 5.0,
    "cost": 8
  }, {
    "value": 5.2,
    "cost": 12
  }, {
    "value": 5.4,
    "cost": 12
  }, {
    "value": 5.6,
    "cost": 12
  }, {
    "value": 5.8,
    "cost": 12
  }, {
    "value": 6.0,
    "cost": 12
  }, {
    "value": 6.2,
    "cost": 25
  }, {
    "value": 6.4,
    "cost": 25
  }, {
    "value": 6.6,
    "cost": 25
  }, {
    "value": 6.8,
    "cost": 25
  }, {
    "value": 7.0,
    "cost": 25
  }, {
    "value": 7.2,
    "cost": 35
  }, {
    "value": 7.4,
    "cost": 35
  }, {
    "value": 7.6,
    "cost": 35
  }, {
    "value": 7.8,
    "cost": 35
  }, {
    "value": 8.0,
    "cost": 35
  }, {
    "value": 8.2,
    "cost": 40
  }, {
    "value": 8.4,
    "cost": 40
  }, {
    "value": 8.6,
    "cost": 40
  }, {
    "value": 8.8,
    "cost": 40
  }, {
    "value": 9.0,
    "cost": 40
  }, {
    "value": 9.2,
    "cost": 60
  }, {
    "value": 9.4,
    "cost": 60
  }, {
    "value": 9.6,
    "cost": 60
  }, {
    "value": 9.8,
    "cost": 60
  }, {
    "value": 10.0,
    "cost": 60
  }],
  // #endregion

  // #region Skill Badge costs
  "skills": {
    "2": 50,
    "3": 100,
    "4": 150,
    "5": 300,
    "6": 450,
    "7": 600,
    "8": 750,
    "9": 900,
    "10": 1200,
    "11": 1500,
    "12": 1800,
    "13": 2100,
    "14": 2400,
    "15": 3100,
    "16": 3800,
    "17": 4500,
    "18": 5200,
    "19": 5900,
    "20": 6900,
    "21": 7900,
    "22": 8900
  },
  // #endregion

  // #region Alliance Duel base scoring
  "duel": {
    "antitoxinUnit": 660,
    "antitoxinPoints": 1,
    "recruitPoints": 1500,
    "urShardPoints": 10000,
    "ssrShardPoints": 3500,
    "srShardPoints": 1000,
    "skillBadgePoints": 10
  }
  // #endregion
};
