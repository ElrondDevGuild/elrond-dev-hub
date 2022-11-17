CREATE TABLE IF NOT EXISTS public.bounty_applications
(
    id              uuid NOT NULL            DEFAULT uuid_generate_v4() PRIMARY KEY,
    bounty_id       uuid NOT NULL,
    user_id         uuid NOT NULL,
    approval_status text NOT NULL,
    work_url        text NULL,
    created_at      timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT bounty_applications_bounty_id_fkey FOREIGN KEY (bounty_id)
        REFERENCES public.bounties (id) MATCH SIMPLE
        ON UPDATE CASCADE,
    CONSTRAINT bounty_applications_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
);