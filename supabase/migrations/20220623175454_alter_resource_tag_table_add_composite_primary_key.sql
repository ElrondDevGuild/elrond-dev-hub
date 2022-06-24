ALTER TABLE public.resource_tag DROP  CONSTRAINT resource_tag_pkey;
ALTER TABLE public.resource_tag ADD CONSTRAINT resource_tag_pkey PRIMARY KEY (id, resource_id, tag_id);