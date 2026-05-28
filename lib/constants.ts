/* ─── Divine Premier League — All data constants ────────────────────────────── */

export const APL_SEASON = {
  leagueName: "Divine Premier League",
  leagueShort: "DPL",
  monogram: "D",
  number: "04",
  opening: "21·06·2026",
  venue: "Lush Turf, Mira Road",
  format: "T10 · 6-OVER",
  teams: "10+",
  players: "100+",
  headlineLine1: "WE ARE ONE,",
  headlineLine2: "WE FOR ONE.",
} as const;

export const APL_STATS: { number: string; label: string }[] = [
  { number: "04", label: "SEASON" },
  { number: "10+", label: "TEAMS" },
  { number: "100+", label: "PLAYERS" },
  { number: "04", label: "PILLARS" },
];

export const APL_VALUES = [
  "BROTHERHOOD",
  "ATMIYATA",
  "DISCIPLINE",
  "SURRENDER",
  "PRAYER",
  "GROWTH",
] as const;

export const APL_PILLARS: {
  num: string;
  label: string;
  desc: string;
  src: string;
  pos: string;
}[] = [
    {
      num: "01",
      label: "Blessings",
      desc: "Flag raised, intention set before the first ball.",
      src: "/images/blessing-altar.png",
      pos: "center 30%",
    },
    {
      num: "02",
      label: "Brotherhood",
      desc: "Strangers become teammates. Teammates become brothers.",
      src: "/images/team-celebration.png",
      pos: "center 30%",
    },
    {
      num: "03",
      label: "Prayer",
      desc: "Bare feet on the pitch. Cricket as devotion.",
      src: "/images/prayer-line.png",
      pos: "center 35%",
    },
    {
      num: "04",
      label: "Growth",
      desc: "Friendships under the banyan tree last longer than trophies.",
      src: "/images/banyan-group.png",
      pos: "center 35%",
    },
  ];

export const APL_GALLERY: {
  src: string;
  cap: string;
  n: string;
  pos: string;
}[] = [
    { src: "/images/blessing-altar.png", cap: "OPENING · BLESSINGS", n: "01", pos: "center 25%" },
    { src: "/images/prayer-line.png", cap: "PRE-MATCH · PRAYER", n: "02", pos: "center 35%" },
    { src: "/images/five-batsmen.png", cap: "ON THE PITCH", n: "03", pos: "center 25%" },
    { src: "/images/banyan-group.png", cap: "CLOSING · GROWTH", n: "04", pos: "center 30%" },
  ];

/* ─── Registration form data ─────────────────────────────────────────────── */

export const APL_ROLES = [
  "As Captain",
  "As Vice Captain",
  "As a Participant",
] as const;

export const APL_TEAMS = [
  "ANY · DRAFT ME",
  "SAARANGPUR XI",
  "VADTAL KINGS",
  "GADHADA WARRIORS",
  "AKSHAR ROYALS",
] as const;

export const APL_JERSEY_SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export const APL_FORM_STEPS = 6;

export const BATTING_STYLES = ["Right-handed", "Left-handed"] as const;
export const BOWLING_STYLES = ["Right-handed", "Left-handed"] as const;

export const SABHA_LIKES = [
  "SPIRITUAL MOTIVATION",
  "PROFESSIONAL MOTIVATION AND CAREER",
  "ACADEMIC MOTIVATION",
  "NETWORKING AND DEVELOPMENT",
  "Other",
] as const;

/* ─── Ticker / Marquee strings ───────────────────────────────────────────── */

export const TICKER_TEXT =
  "★ DPL S4 ★ NOW REGISTERING ★ 10+ TEAMS · 100 PLAYERS ★ OPENING 21·06·2026 ★ " +
  "DPL S4 ★ NOW REGISTERING ★ 10+ TEAMS · 100 PLAYERS ★ OPENING 21·06·2026 ★ ";

export const NAV_LINKS: { label: string; href: string }[] = [];
