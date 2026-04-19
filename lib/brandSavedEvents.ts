export const BRAND_SAVED_INFLUENCERS_EVENT = "brand-saved-influencers-changed";

export function dispatchBrandSavedInfluencersChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(BRAND_SAVED_INFLUENCERS_EVENT));
}
