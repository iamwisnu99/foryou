export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  year?: string;
  fileName: string;
  src: string;
  cover: string;
  isSpecial?: boolean;
}

export const DEFAULT_COVER = "/apple-touch-icon.png";

export const TRACK_LIST: Track[] = [
  {
    id: "ambar-kucing-2",
    title: "Ambar dan Kucing Kesayangan Pt. 2",
    artist: "Wisnu",
    album: "Spesial Buat Ambar",
    fileName: "Ambar dan Kucing Kesayangan Pt. 2.mp3",
    src: encodeURI("/music/Ambar dan Kucing Kesayangan Pt. 2.mp3"),
    cover: encodeURI("/music/Ambar dan Kucing Kesayangan Pt. 2.jpeg"),
    isSpecial: true,
  },
  {
    id: "blue-jeans",
    title: "Blue Jeans",
    artist: "GANGGA",
    album: "Blue Jeans",
    year: "2020",
    fileName: "Blue Jeans.mp3",
    src: encodeURI("/music/Blue Jeans.mp3"),
    cover: encodeURI("/music/Blue Jeans.jpeg"),
  },
  {
    id: "wildflower",
    title: "WILDFLOWER",
    artist: "Billie Eilish",
    album: "HIT ME HARD AND SOFT",
    year: "2024",
    fileName: "WILDFLOWER.mp3",
    src: encodeURI("/music/WILDFLOWER.mp3"),
    cover: encodeURI("/music/WILDFLOWER.jpeg"),
  },
  {
    id: "glimpse-of-us",
    title: "Glimpse of Us",
    artist: "Joji",
    album: "Glimpse of Us",
    year: "2022",
    fileName: "Glimpse of Us.mp3",
    src: encodeURI("/music/Glimpse of Us.mp3"),
    cover: encodeURI("/music/Glimpse of Us.jpeg"),
  },
  {
    id: "easy-on-me",
    title: "Easy On Me",
    artist: "Adele",
    album: "Easy On Me",
    year: "2021",
    fileName: "Easy On Me.mp3",
    src: encodeURI("/music/Easy On Me.mp3"),
    cover: encodeURI("/music/Easy On Me.jpeg"),
  },
  {
    id: "day-after-day",
    title: "Day After Day",
    artist: "GANGGA",
    album: "It's Never Easy",
    year: "2021",
    fileName: "Day After Day.mp3",
    src: encodeURI("/music/Day After Day.mp3"),
    cover: encodeURI("/music/Day After Day.jpeg"),
  },
  {
    id: "all-i-ask",
    title: "All I Ask",
    artist: "Adele",
    album: "25",
    year: "2015",
    fileName: "All I Ask.mp3",
    src: encodeURI("/music/All I Ask.mp3"),
    cover: encodeURI("/music/All I Ask.jpeg"),
  },
  {
    id: "jealous",
    title: "Jealous",
    artist: "Labrinth",
    album: "Jealous - EP",
    year: "2014",
    fileName: "Jealous.mp3",
    src: encodeURI("/music/Jealous.mp3"),
    cover: encodeURI("/music/Jealous.jpeg"),
  },
  {
    id: "meet-me-in-amsterdam",
    title: "Meet Me in Amsterdam",
    artist: "RINI",
    album: "After the Sun",
    year: "2018",
    fileName: "Meet Me in Amsterdam.mp3",
    src: encodeURI("/music/Meet Me in Amsterdam.mp3"),
    cover: encodeURI("/music/Meet Me in Amsterdam.jpeg"),
  },
  {
    id: "die-on-this-hill",
    title: "Die On This Hill",
    artist: "SIENNA SPIRO",
    album: "The Visitor",
    year: "2026",
    fileName: "Die On This Hill.mp3",
    src: encodeURI("/music/Die On This Hill.mp3"),
    cover: encodeURI("/music/Die On This Hill.jpeg"),
  },
  {
    id: "you-stole-the-show",
    title: "You Stole The Show",
    artist: "SIENNA SPIRO",
    album: "The Visitor",
    year: "2026",
    fileName: "You Stole The Show.mp3",
    src: encodeURI("/music/You Stole The Show.mp3"),
    cover: encodeURI("/music/You Stole The Show.jpeg"),
  },
];
