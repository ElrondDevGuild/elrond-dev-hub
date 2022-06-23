ALTER TABLE IF EXISTS public.resources
    ADD COLUMN slug text COLLATE pg_catalog."default" DEFAULT NULL;