import { Category } from "../types/supabase";

export const homePath = "/";
export const submitPath = "/submit";
export const thankYouPath = "/thank-you";
export const categoryPath = (category?: Category | number) => {
  if (!category) {
    return "/list";
  }
  if (typeof category === "number") {
    return `/list?category=${category}`;
  }
  return `/list?category=${category.id}`;
};
export const gettingStartedPath = "/getting-started";
export const searchPath = (q?: string) => {
  if (!q) {
    return "/search";
  }
  return `/search?q=${q}`;
};
export const bountyPath = "/bounty";
export const expertsPath = "/experts";
