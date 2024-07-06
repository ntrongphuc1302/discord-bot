const { ActivityType } = require("discord.js");

module.exports = {
  playingNames: [
    "Minecraft",
    "League of Legends",
    "Counter-Strike 2",
    "Dota 2",
    "PUBG: BATTLEGROUNDS",
    "Banana",
    "ELDEN RING",
    "NARAKA: BLADEPOINT",
    "The First Descendant",
    "Apex Legends™",
    "Team Fortress 2",
    "Grand Theft Auto V",
    "Stardew Valley",
    "Rust",
    "Wallpaper Engine",
    "Palworld",
    "Destiny 2",
    "Crab Game",
    "Call of Duty®",
    "Baldur's Gate 3",
    "Sid Meier’s Civilization® VI",
    "7 Days to Die",
    "War Thunder",
    "Tom Clancy's Rainbow Six® Siege",
    "Governor of Poker 3",
    "EA SPORTS FC™ 24",
    "FINAL FANTASY XIV Online",
    "Monster Hunter: World",
    "Don't Starve Together",
    "Forza Horizon 4",
    "Football Manager 2024",
    "VRChat",
    "Warframe",
    "Left 4 Dead 2",
    "Terraria",
    "Hearts of Iron IV",
    "tModLoader",
    "Dark and Darker",
    "Red Dead Redemption 2",
    "Battlefield™ V",
    "Dead by Daylight",
    "Cats",
    "HELLDIVERS™ 2",
    "Cyberpunk 2077",
    "Overwatch® 2",
    "The Sims™ 4",
    "DayZ",
    "Chained Together",
    "Euro Truck Simulator 2",
    "Project Zomboid",
    "Unturned",
    "ARK: Survival Evolved",
    "Total War: WARHAMMER III",
    "The Witcher 3: Wild Hunt",
    "Street Fighter™ 6",
    "Fallout 4",
    "RimWorld",
    "Mount & Blade II: Bannerlord",
    "PAYDAY 2",
    "NBA 2K24",
    "Valheim",
    "Crosshair X",
    "MIR4",
    "Black Desert",
    "Lost Ark",
    "Fallout 76",
    "Yu-Gi-Oh! Master Duel",
    "Garry's Mod",
    "Bloons TD 6",
    "Hero's Land",
    "Deep Rock Galactic",
    "Age of Empires II: Definitive Edition",
    "Battlefield™ 2042",
    "Farming Simulator 22",
    "ARK: Survival Ascended",
    "SCUM",
    "The Elder Scrolls V: Skyrim Special Edition",
    "Forza Horizon 5",
    "Phasmophobia",
    "Battlefield™ 1",
    "Lethal Company",
    "Stellaris",
    "Sid Meier's Civilization® V",
    "The Binding of Isaac: Rebirth",
    "DAVE THE DIVER",
    "Cookie Clicker",
    "Limbus Company",
    "Slay the Spire",
    "Eternal Return",
    "Supermarket Simulator",
    "Cities: Skylines",
    "Crusader Kings III",
    "Killing Floor 2",
    "Russian Fishing 4",
    "Victoria 3",
    "OBS Studio",
    "Rocket League®",
    "Risk of Rain 2",
    "Soulmask",
    "It Takes Two",
    "Europa Universalis IV",
    "Sekiro™: Shadows Die Twice - GOTY Edition",
  ],

  streamingNames: [
    "Minecraft",
    "League of Legends",
    "Counter-Strike 2",
    "Dota 2",
    "PUBG: BATTLEGROUNDS",
    "Banana",
    "ELDEN RING",
    "NARAKA: BLADEPOINT",
    "The First Descendant",
    "Apex Legends™",
    "Team Fortress 2",
    "Grand Theft Auto V",
    "Stardew Valley",
    "Rust",
    "Wallpaper Engine",
    "Palworld",
    "Destiny 2",
    "Crab Game",
    "Call of Duty®",
    "Baldur's Gate 3",
    "Sid Meier’s Civilization® VI",
    "7 Days to Die",
    "War Thunder",
    "Tom Clancy's Rainbow Six® Siege",
    "Governor of Poker 3",
    "EA SPORTS FC™ 24",
    "FINAL FANTASY XIV Online",
    "Monster Hunter: World",
    "Don't Starve Together",
    "Forza Horizon 4",
    "Football Manager 2024",
    "VRChat",
    "Warframe",
    "Left 4 Dead 2",
    "Terraria",
    "Hearts of Iron IV",
    "tModLoader",
    "Dark and Darker",
    "Red Dead Redemption 2",
    "Battlefield™ V",
    "Dead by Daylight",
    "Cats",
    "HELLDIVERS™ 2",
    "Cyberpunk 2077",
    "Overwatch® 2",
    "The Sims™ 4",
    "DayZ",
    "Chained Together",
    "Euro Truck Simulator 2",
    "Project Zomboid",
    "Unturned",
    "ARK: Survival Evolved",
    "Total War: WARHAMMER III",
    "The Witcher 3: Wild Hunt",
    "Street Fighter™ 6",
    "Fallout 4",
    "RimWorld",
    "Mount & Blade II: Bannerlord",
    "PAYDAY 2",
    "NBA 2K24",
    "Valheim",
    "Crosshair X",
    "MIR4",
    "Black Desert",
    "Lost Ark",
    "Fallout 76",
    "Yu-Gi-Oh! Master Duel",
    "Garry's Mod",
    "Bloons TD 6",
    "Hero's Land",
    "Deep Rock Galactic",
    "Age of Empires II: Definitive Edition",
    "Battlefield™ 2042",
    "Farming Simulator 22",
    "ARK: Survival Ascended",
    "SCUM",
    "The Elder Scrolls V: Skyrim Special Edition",
    "Forza Horizon 5",
    "Phasmophobia",
    "Battlefield™ 1",
    "Lethal Company",
    "Stellaris",
    "Sid Meier's Civilization® V",
    "The Binding of Isaac: Rebirth",
    "DAVE THE DIVER",
    "Cookie Clicker",
    "Limbus Company",
    "Slay the Spire",
    "Eternal Return",
    "Supermarket Simulator",
    "Cities: Skylines",
    "Crusader Kings III",
    "Killing Floor 2",
    "Russian Fishing 4",
    "Victoria 3",
    "OBS Studio",
    "Rocket League®",
    "Risk of Rain 2",
    "Soulmask",
    "It Takes Two",
    "Europa Universalis IV",
    "Sekiro™: Shadows Die Twice - GOTY Edition",
  ],

  watchingNames: [
    "a movie",
    "a TV show",
    "a documentary",
    "a YouTube video",
    "a live stream",
    "an anime series",
    "a tutorial",
    "a webinar",
    "a cooking show",
    "a sports game",
    "a concert",
    "a play",
    "a musical",
    "a news broadcast",
    "a game stream",
    "a fitness video",
    "a meditation guide",
    "a nature documentary",
    "a travel vlog",
    "a science experiment",
    "a magic show",
    "a DIY project",
    "a tech review",
    "a makeup tutorial",
    "a fashion show",
    "a charity event",
    "a pet video",
    "a kids' show",
    "a horror movie",
    "a comedy special",
    "a reality show",
    "a talent show",
    "a dance performance",
    "a historical documentary",
    "a drama series",
    "a sitcom",
    "a quiz show",
    "a game show",
    "a superhero movie",
    "an action movie",
    "a thriller",
    "a mystery series",
    "a crime drama",
    "a fantasy series",
    "a sci-fi movie",
    "a romance movie",
    "an indie film",
    "a foreign film",
    "a classic film",
    "a short film",
  ],

  listeningNames: [
    "music",
    "a podcast",
    "audiobooks",
    "an interview",
    "a lecture",
    "a debate",
    "a radio show",
    "a live concert",
    "a motivational speech",
    "a guided meditation",
    "a language lesson",
    "a news report",
    "a nature sounds playlist",
    "a relaxation playlist",
    "a workout playlist",
    "a jazz playlist",
    "a classical music playlist",
    "a rock album",
    "a pop album",
    "a hip-hop mix",
    "an R&B playlist",
    "a country music playlist",
    "an electronic dance mix",
    "a chill beats playlist",
    "a blues album",
    "a reggae playlist",
    "a metal album",
    "a punk rock playlist",
    "a folk music playlist",
    "an indie playlist",
    "a soundtrack",
    "a comedy album",
    "a historical podcast",
    "a true crime podcast",
    "a science podcast",
    "a storytelling podcast",
    "a fantasy audiobook",
    "a sci-fi audiobook",
    "a mystery audiobook",
    "a romance audiobook",
    "a self-help audiobook",
    "a biography audiobook",
    "a memoir audiobook",
    "a thriller audiobook",
    "a horror audiobook",
    "a business podcast",
    "a tech podcast",
    "a gaming podcast",
    "a health and wellness podcast",
    "a travel podcast",
    "a cooking podcast",
  ],

  competingNames: [
    "in a sports tournament",
    "in a video game competition",
    "in a chess match",
    "in a cooking contest",
    "in a spelling bee",
    "in a talent show",
    "in a science fair",
    "in a debate",
    "in a math competition",
    "in a robotics competition",
    "in a dance competition",
    "in a singing competition",
    "in a marathon",
    "in a triathlon",
    "in a cycling race",
    "in a swimming competition",
    "in a bodybuilding contest",
    "in a fishing tournament",
    "in a poker tournament",
    "in a golf tournament",
    "in a track and field event",
    "in an eSports tournament",
    "in a beauty pageant",
    "in a trivia contest",
    "in a jiu-jitsu competition",
    "in a karate tournament",
    "in a bodybuilding competition",
    "in a gymnastics meet",
    "in a surfing competition",
    "in a skateboarding competition",
    "in a snowboarding competition",
    "in a skiing competition",
    "in a rock climbing competition",
    "in a horse riding competition",
    "in a dog show",
    "in a cat show",
    "in a martial arts tournament",
    "in a wrestling match",
    "in a boxing match",
    "in a MMA fight",
    "in a fencing match",
    "in a rowing competition",
    "in a sailing race",
    "in a drone racing competition",
    "in a coding competition",
    "in a hackathon",
    "in a design competition",
    "in a photography contest",
    "in a film festival",
    "in a art competition",
  ],
};