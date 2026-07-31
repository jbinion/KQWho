export const FILTER_HELP = {
  Species: [
    "human",
    "lizard",
    "bird",
    "raccoon",
    "monster",
    "cat",
    "dog",
    "robot",
    "crab",
    "ferret",
  ],
  Hair: ["black", "white", "brown", "blue", "green", "pink", "etc."],
  Accessory: [
    "glasses",
    "backpack",
    "drink",
    "food",
    "headphones",
    "watch",
    "etc.",
  ],
  ColorScheme: ["black", "white", "gray", "red", "blue", "orange", "etc."],
  Hostname: ["computer", "device", "laptop", "mobile"],
  IP: ["10.0.0.X", "172.16.X.X", "192.168.X.X"],
  VisitedDomains: [
    "sketchydocs.io",
    "raisinkanes.com",
    "phishynews.net",
    "kc7cyber.com",
    "etc.",
  ],
  FilesDownloaded: ["Invoice.docx", "Resume.pdf", "RansomNote.txt", "etc."],
  SuspiciousActivity: [
    "clicked phishing ad",
    "malware download",
    "unauthorized login",
    "etc.",
  ],
  LoginAccount: ["related to their name", "jdoe", "admin", "guest", "itadmin"],
};

export const BOARD_SIZE = 16;

export const MODES = [
  { value: "normal", label: "Normal" },
  { value: "image", label: "Image Only" },
  { value: "data", label: "Data Only" },
  { value: "prompt", label: "Prompt Challenge" },
];

export const FEEDBACK_COLORS = {
  good: "green",
  win: "green",
  bad: "red",
  error: "red",
  info: "gold",
};
