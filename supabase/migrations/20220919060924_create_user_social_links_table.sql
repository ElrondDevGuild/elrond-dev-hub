CREATE TABLE IF NOT EXISTS public.user_social_links
(
    id         uuid NOT NULL            DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id    uuid NOT NULL,
    platform   text NOT NULL,
    username   text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT user_social_links_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);