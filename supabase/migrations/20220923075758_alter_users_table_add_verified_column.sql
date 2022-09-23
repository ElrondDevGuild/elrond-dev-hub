ALTER TABLE IF EXISTS public.users
ADD COLUMN verified boolean NOT NULL DEFAULT false;