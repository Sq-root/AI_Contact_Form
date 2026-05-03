export interface NavLink {
  label: string;
  href:  string;
}

export interface Stat {
  number: string;
  label:  string;
}

export interface Pillar {
  num:   string;
  label: string;
  desc:  string;
  src:   string;
  pos:   string;
}

export interface GalleryItem {
  src: string;
  cap: string;
  n:   string;
  pos: string;
}

export interface FormData {
  /* Step 1 — Personal */
  fullName:          string;
  phone:             string;
  fieldOfStudy:      string;
  fieldOfStudyOther: string;

  /* Step 2 — Cricket */
  battingStyle:      string;
  bowlingStyle:      string;
  referenceName:     string;
  playingRole:       string;

  /* Step 3 — Sabha */
  sabhaLike:         string[];
  sabhaLikeOther:    string;
  otherTopics:       string;

  /* Step 4 — AI Avatar */
  imageUrls:         string[];
}
