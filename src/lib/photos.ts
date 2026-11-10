/*
  THE PHOTO LIST
  Every photograph used on the site is listed here. To add a photo,
  save it into the `public/images` folder with the file name shown,
  then rebuild. Until a file exists, an elegant labelled frame is shown
  in its place, so nothing ever looks broken.

  Use only photos you own or have a licence for.
*/

export type PhotoKey = keyof typeof PHOTOS;

export type PhotoInfo = {
  file: string;
  alt: string;
  /** What the photograph should show — used as the placeholder label and shot list. */
  brief: string;
  /** Background tone for the placeholder frame. */
  tone: string;
};

export const PHOTOS = {
  hero: { file: "hero.jpg", alt: "A bride in a modern gown in soft natural light", brief: "Editorial bridal portrait, natural light, modern gown", tone: "#ece5da" },
  tablescape: { file: "tablescape.jpg", alt: "A candlelit wedding table with ivory linen and flowers", brief: "Candlelit tablescape, ivory linen", tone: "#e9e3d6" },
  florals: { file: "florals.jpg", alt: "A loose arrangement of seasonal wedding flowers", brief: "Loose seasonal florals", tone: "#e4e7dc" },
  stationery: { file: "stationery.jpg", alt: "A wedding invitation suite laid out on linen", brief: "Invitation suite flat lay", tone: "#f1ece4" },
  venue: { file: "venue.jpg", alt: "A garden wedding venue set for a ceremony", brief: "Venue or garden ceremony set-up", tone: "#e2e5d9" },
  destination: { file: "destination.jpg", alt: "A coastal destination wedding setting", brief: "Destination setting, coast or terrace", tone: "#e6e3dc" },
  details: { file: "details.jpg", alt: "Wedding rings and bridal accessories", brief: "Rings and accessories detail", tone: "#efe7dc" },
  dress: { file: "dress.jpg", alt: "A wedding dress hanging in a bright room", brief: "Wedding dress, bright room", tone: "#f2eee8" },

  "style-romantic": { file: "style-romantic.jpg", alt: "Romantic wedding styling with soft florals", brief: "Romantic", tone: "#efe2dc" },
  "style-modern": { file: "style-modern.jpg", alt: "Modern wedding styling with clean lines", brief: "Modern", tone: "#e6e6e3" },
  "style-classic": { file: "style-classic.jpg", alt: "Classic wedding styling with white flowers", brief: "Classic", tone: "#f0ece5" },
  "style-minimalist": { file: "style-minimalist.jpg", alt: "Minimalist wedding styling with simple greenery", brief: "Minimalist", tone: "#eeeeea" },
  "style-luxury": { file: "style-luxury.jpg", alt: "Luxurious wedding styling with candles and gold", brief: "Luxury", tone: "#e9dfcd" },
  "style-rustic": { file: "style-rustic.jpg", alt: "Rustic wedding styling with wood and wildflowers", brief: "Rustic", tone: "#e7ddd0" },
  "style-bohemian": { file: "style-bohemian.jpg", alt: "Bohemian wedding styling with dried flowers", brief: "Bohemian", tone: "#eadfd2" },
  "style-traditional": { file: "style-traditional.jpg", alt: "Traditional wedding styling with rich details", brief: "Traditional", tone: "#e8e0d6" },
} satisfies Record<string, PhotoInfo>;

export type PhotoAvailability = Partial<Record<PhotoKey, boolean>>;
