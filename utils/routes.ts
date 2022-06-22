import { Category } from '../types/supabase';

export const homePath = "/";
export const submitPath = "/submit";
export const thankYouPath = "/thank-you";
export const categoryPath = (category: Category) => `/grid?category=${category.id}`; // TODO: replace this with the real route
