export type MediaResource = {
  id: number;
  category_id: number;
  title: string;
  author: string;
  description: string;
  curator_address: string;
  image_url: string | null;
  resource_url: string;
  published_at: string | null;
  created_at?: string;
  deleted_at?: string | null;
  synced_at?: string | null;
  tags?: Tag[];
  slug: string;
};

export type Category = {
  id: number;
  title: string;
  created_at: string;
};

export type Tag = {
  id: number;
  title: string;
  created_at: string;
};

export type ResourceTag = {
  id: number;
  resource_id: number;
  tag_id: number;
};
