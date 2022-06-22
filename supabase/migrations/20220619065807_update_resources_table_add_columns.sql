ALTER TABLE IF EXISTS public.resources
ADD COLUMN deleted_at timestamp,
ADD COLUMN synced_at timestamp,
ADD COLUMN image_url text COLLATE pg_catalog."default";
