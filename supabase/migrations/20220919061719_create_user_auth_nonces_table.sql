CREATE TABLE IF NOT EXISTS public.user_auth_nonces
(
    id         uuid NOT NULL            DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);