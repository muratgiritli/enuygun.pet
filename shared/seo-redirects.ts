/**
 * Cannibal / doorway URL → canonical path (301).
 * Keep this list pattern-based so client + server share one map.
 */

const ATAKUM_CANONICAL = "/atakum-petshop";
const SAMSUN_CANONICAL = "/petshop-samsun";
const DELIVERY_CANONICAL = "/kapida-teslim-petshop";

const EXACT: Record<string, string> = {
  "/local/atakum-petshop": ATAKUM_CANONICAL,
  "/petshop-atakum": ATAKUM_CANONICAL,
  "/samsun-atakum-petshop": ATAKUM_CANONICAL,
  "/atakum-samsun-petshop": ATAKUM_CANONICAL,
  "/enuygun-petshop-samsun-atakum": ATAKUM_CANONICAL,
  "/samsun-petshop": SAMSUN_CANONICAL,
  "/local/samsun-petshop": SAMSUN_CANONICAL,
  "/en-uygun-petshop-samsun": SAMSUN_CANONICAL,
  "/enuygun-petshop-samsun": SAMSUN_CANONICAL,
  "/enuygun-pet-samsun-petshop": SAMSUN_CANONICAL,
  "/yakinimda-petshop-samsun": SAMSUN_CANONICAL,
  "/gece-acik-petshop-samsun": SAMSUN_CANONICAL,
  "/local/kapida-teslim-petshop-samsun": DELIVERY_CANONICAL,
};

/** Rakip / dizin isimli doorway sayfalar — Samsun petshop kanoniğine. */
const COMPETITOR_SLUGS = new Set([
  "asiyan-petshop-samsun",
  "biggie-petshop-samsun",
  "botanik-petshop-samsun",
  "candas-petshop-samsun",
  "alkan-petshop-samsun",
  "kukuli-petshop-samsun",
  "leon-petshop-samsun",
  "medusa-petshop-samsun",
  "melis-petshop-samsun",
  "mirmir-petshop-samsun",
  "ysc-petshop-samsun",
  "pati-pet-samsun",
  "pati-pet-store-atakum-petshop-samsun-petshop",
  "th-pet-center-samsun",
  "cazip-ve-uygun-pet-samsun",
  "express-mama-samsun",
  "samsun-petshop-botanik",
  "samsun-pethouse-petshop-samsun-akvaryum",
  "express-mama-yerine-atakum-petshop",
  "express-mama-yerine-samsun-petshop",
]);

function normalizePath(pathname: string): string {
  const noQuery = pathname.split("?")[0].split("#")[0];
  const trimmed = noQuery.replace(/\/+$/, "") || "/";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function slugOf(path: string): string {
  if (path.startsWith("/local/")) return path.slice("/local/".length);
  return path.replace(/^\//, "");
}

/**
 * Returns a same-origin path to 301 to, or null if the URL should stay.
 */
export function resolveSeoRedirect(pathname: string): string | null {
  const path = normalizePath(pathname);
  if (path === ATAKUM_CANONICAL || path === SAMSUN_CANONICAL || path === DELIVERY_CANONICAL) {
    return null;
  }

  const exact = EXACT[path];
  if (exact) return exact;

  const slug = slugOf(path);
  if (!slug || slug.includes("/")) return null;

  if (COMPETITOR_SLUGS.has(slug)) {
    return slug.includes("atakum") ? ATAKUM_CANONICAL : SAMSUN_CANONICAL;
  }

  if (slug !== "atakum-petshop" && /^(atakum-petshop)(-|$)/.test(slug)) {
    return ATAKUM_CANONICAL;
  }

  if (slug !== "petshop-samsun" && /^(petshop-samsun)(-|$)/.test(slug)) {
    return SAMSUN_CANONICAL;
  }

  if (slug !== "samsun-petshop" && /^(samsun-petshop)(-|$)/.test(slug)) {
    return SAMSUN_CANONICAL;
  }

  return null;
}

export function isIndexablePath(pathname: string): boolean {
  return resolveSeoRedirect(pathname) == null;
}

export const SEO_CANONICALS = {
  atakumPetshop: ATAKUM_CANONICAL,
  samsunPetshop: SAMSUN_CANONICAL,
  kapidaTeslim: DELIVERY_CANONICAL,
};
