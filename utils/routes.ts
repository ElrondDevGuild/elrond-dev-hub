import { Category } from '../types/supabase';

export const homePath = "/";
export const submitPath = "/submit";
export const thankYouPath = "/thank-you";
export const categoryPath = (category: Category | number) => {
  if (typeof category === "number") {
    return `/list?category=${category}`;
  }
  return `/list?category=${category.id}`;
};
