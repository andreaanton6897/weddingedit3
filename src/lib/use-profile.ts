"use client";

import { useEffect, useState } from "react";
import { loadProfile, type WeddingProfile } from "./wedding-profile";

/** Reads the saved profile after the page has loaded in the browser. */
export function useProfile() {
  const [state, setState] = useState<{ loaded: boolean; profile: WeddingProfile | null }>({ loaded: false, profile: null });
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading browser storage after mount
    setState({ loaded: true, profile: loadProfile() });
  }, []);
  return state;
}
