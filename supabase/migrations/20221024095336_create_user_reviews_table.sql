CREATE TABLE IF NOT EXISTS public.user_reviews
(
    id          uuid NOT NULL            DEFAULT uuid_generate_v4() PRIMARY KEY,
    bounty_id   uuid NOT NULL,
    user_id     uuid NOT NULL,
    reviewer_id uuid NOT NULL,
    rating      int  NOT NULL,
    review      text NULL,
    created_at  timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT user_reviews_bounty_id_fkey FOREIGN KEY (bounty_id)
        REFERENCES public.bounties (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT user_reviews_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE,
    CONSTRAINT user_reviews_reviewer_id_fkey FOREIGN KEY (reviewer_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
);