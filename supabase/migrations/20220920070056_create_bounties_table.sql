CREATE TABLE IF NOT EXISTS public.bounties
(
    id                       uuid                     NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    title                    text                     NULL,
    description              text                     NULL,
    acceptance_criteria      text                     NULL,
    status                   text                     NOT NULL,
    project_type             text                     NOT NULL,
    issue_type               text                     NOT NULL,
    requires_work_permission boolean                  NOT NULL,
    experience_level         text                     NOT NULL,
    repository_url           text                     NULL,
    repository_issue_url     text                     NULL,
    value                    numeric(8,5)                  NOT NULL,
    owner_id                 uuid                     NOT NULL,
    created_at               timestamp with time zone          DEFAULT now() NOT NULL,
    deleted_at               timestamp with time zone NULL,
    CONSTRAINT bounties_owner_id_fkey FOREIGN KEY (owner_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
);