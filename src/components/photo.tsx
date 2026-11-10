import Image from "next/image";
import { PHOTOS, type PhotoKey } from "@/lib/photos";

/**
 * A photograph, or — until the file has been added — a tonal frame
 * labelled with the shot it needs. Works in any component.
 */
export function Photo({
  name,
  available,
  className = "",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  label = true,
  zoom = false,
  decorative = false,
}: {
  name: PhotoKey;
  available: boolean | undefined;
  className?: string;
  sizes?: string;
  priority?: boolean;
  label?: boolean;
  zoom?: boolean;
  /** Set when the photo sits inside a labelled control, so screen readers hear the label only. */
  decorative?: boolean;
}) {
  const info = PHOTOS[name];
  return (
    <div
      className={`relative overflow-hidden ${zoom ? "photo-zoom" : ""} ${className}`}
      style={{ backgroundColor: info.tone }}
    >
      {available ? (
        <Image src={`/images/${info.file}`} alt={decorative ? "" : info.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <div {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": info.alt })} className="absolute inset-0">
          <div className="absolute inset-3 border border-white/70" aria-hidden />
          {label && (
            <p className="absolute bottom-5 left-5 right-5 font-serif text-[14px] italic leading-snug text-ink/45">
              Photograph to come: {info.brief.toLowerCase()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
