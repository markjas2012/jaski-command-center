// Editorial preferences shared by the news feed and upcoming releases.
// RAWG does not supply a reliable AAA flag, so major franchises and audience
// interest are used as a conservative approximation for upcoming releases.
const majorGames = /\b(?:grand theft auto|gta\s*(?:vi|6)|red dead|call of duty|battlefield|halo|gears of war|gears\s*of|doom|wolfenstein|indiana jones|elder scrolls|skyrim|fallout|starfield|fable|avowed|the outer worlds|forza|gran turismo|need for speed|the crew|assassin['’]?s creed|far cry|watch dogs|ghost recon|rainbow six|splinter cell|the division|resident evil|silent hill|monster hunter|devil may cry|pragmata|dragon['’]?s dogma|final fantasy|kingdom hearts|dragon quest|nier|metal gear|death stranding|god of war|the last of us|uncharted|horizon|ghost of (?:tsushima|yotei)|spider-man|wolverine|marvel|star wars|mass effect|dragon age|witcher|cyberpunk|baldur['’]?s gate|diablo|warcraft|overwatch|destiny|borderlands|bioshock|mafia|hitman|tomb raider|007|james bond|control|alan wake|max payne|elden ring|dark souls|bloodborne|sekiro|armored core|black myth|phantom blade|crimson desert|stellar blade|returnal|saros|helldivers|housemarque|ratchet|sackboy|astro bot|super mario|mario kart|zelda|metroid|donkey kong|pokemon|pokémon|splatoon|fire emblem|xenoblade|kirby|animal crossing|super smash bros|smash bros|sonic|persona|yakuza|like a dragon|judgment|hogwarts|harry potter|batman|wonder woman|suicide squad|dead space|titanfall|apex legends|fortnite|pubg|minecraft|sea of thieves|perfect dark)\b/i;
const fightingGames = /\b(?:fighting games?|street fighter|mortal kombat|tekken|killer instinct|fatal fury|king of fighters|guilty gear|blazblue|virtua fighter|soulcalibur|soul calibur|samurai shodown|dragon ball|sparking!? zero|budokai|injustice|marvel vs\.? capcom|marvel tokon|marvel tōkon|2xko|rivals of aether|under night|melty blood|granblue fantasy versus|evo|evolution championship|capcom cup)\b/i;
const sportsGames = /\b(?:sports games?|madden|ea sports|ea\s*fc\s*\d*|fc\s*2[5-9]|fifa|nba\s*2k|nba live|nba the run|nba bounce|nhl|mlb the show|mlb\s*2k|pga tour|pga\s*2k|college football|college basketball|wwe\s*2k|wwe|ufc|efootball|football manager|football simulator|topspin|top spin|tennis|golf|baseball|basketball|hockey|boxing|cricket|rugby|f1\s*\d*|formula (?:1|one)|nascar|motogp|wrc|skate|tony hawk|session: skate|riders republic|descenders|rocket league)\b/i;
const hardware = /\b(?:hardware|accessories|accessory|controller|controllers|dualsense|dualshock|fightstick|fight stick|arcade stick|leverless|headset|headsets|earbuds|console|consoles|ps5 pro|playstation 5 pro|playstation portal|playstation vr2|ps vr2|xbox series|steam deck|rog ally|legion go|nintendo switch 2|graphics card|gpu|geforce|radeon|gaming monitor|gaming keyboard|gaming mouse|ssd|storage expansion)\b/i;
const regionalOnly = /(?:\bfor\s+(?:southeast asia|south east asia|asia|japan|korea|china|india|europe|australia|new zealand|latin america|brazil|middle east)\b|\b(?:southeast asia|south east asia|asia|japan|korea|china|india|europe|australia|new zealand|latin america|brazil|middle east)[ -]only\b|\b(?:regional exclusive|region-exclusive|only in japan|japan exclusive)\b)/i;
const lowInterest = /\b(?:demo|prologue|soundtrack|artbook|art book|wallpaper|theme pack|mobile|android|ios|casino|slots|hentai|adult only|hidden object|puzzle pack)\b/i;

export function gamingNewsPriority(headline: string, categories = ""): number {
  if (regionalOnly.test(headline)) return 0;
  // Classify the headline and feed categories, not the full article's unrelated links.
  const subject = `${headline} ${categories}`;
  if (hardware.test(subject)) return 3;
  if (lowInterest.test(headline)) return 0;
  if (fightingGames.test(subject) || sportsGames.test(subject)) return 3;
  return majorGames.test(subject) ? 2 : 0;
}

export type PreferredRelease = {
  name: string;
  added?: number;
  genres?: { name?: string }[];
  platforms?: { platform?: { name?: string } }[];
};

export function upcomingGamePriority(game: PreferredRelease): number {
  if (regionalOnly.test(game.name) || lowInterest.test(game.name)) return 0;
  const supported = game.platforms?.some(({ platform }) => /^(?:PC|PlayStation [45]|Xbox (?:One|Series.*)|Nintendo Switch(?: 2)?)$/i.test(platform?.name ?? ""));
  if (!supported) return 0;
  const genres = (game.genres ?? []).map(({ name }) => name ?? "").join(" ");
  if (fightingGames.test(game.name) || sportsGames.test(game.name) || /\b(?:fighting|sports)\b/i.test(genres)) return 3;
  if (majorGames.test(game.name)) return 2;
  // Popular new IP can qualify without adding every new title to the list.
  return (game.added ?? 0) >= 1000 ? 1 : 0;
}

