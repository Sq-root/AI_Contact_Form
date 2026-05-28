export interface NavLink {
  label: string;
  href: string;
}

export interface Stat {
  number: string;
  label: string;
}

export interface Pillar {
  num: string;
  label: string;
  desc: string;
  src: string;
  pos: string;
}

export interface GalleryItem {
  src: string;
  cap: string;
  n: string;
  pos: string;
}

export interface FormData {
  fullName: string;
  phone: string;
  address: string;
  playingRole: string;
  battingStyle: string;
  bowlingStyle: string;
  referenceName: string;
  imageUrls: string[];
}
