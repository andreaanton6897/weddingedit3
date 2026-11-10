import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";
import { PHOTOS, type PhotoAvailability, type PhotoKey } from "./photos";

/** Checks, when the site is built, which photographs have been added to public/images. */
export function photoAvailability(): PhotoAvailability {
  const out: PhotoAvailability = {};
  for (const key of Object.keys(PHOTOS) as PhotoKey[]) {
    out[key] = existsSync(path.join(process.cwd(), "public", "images", PHOTOS[key].file));
  }
  return out;
}
