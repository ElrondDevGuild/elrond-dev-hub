import { MediaResource } from '../types/supabase';
import { RESOURCES_TABLE } from '../utils/dbtables';
import { RESOURCE_BASE_URL } from '../utils/storage_buckets';
import { supabaseAdmin } from '../utils/supabase';
import { BaseRepository } from './base/BaseRepository';

export class ResourceRepository extends BaseRepository<MediaResource> {
  constructor() {
    const table = supabaseAdmin.from<MediaResource>(RESOURCES_TABLE);
    super(table, "id");
  }

  async paginate({
    page,
    size,
    categories,
    category,
    tags,
    published,
  }: {
    page?: number;
    size?: number;
    categories?: number[];
    category?: number;
    tags?: number[];
    published?: boolean;
  } = {}) {
    const { from, to } = ResourceRepository.computePageRange({ page, size });

    let query = this._table
      .select(
        `
            *,
            tags(id, title),
            category:category_id(id, title),
            resource_tag!inner(tag_id)
        `,
        { count: "exact" }
      )
      .is("deleted_at", null)
      .order("published_at", { ascending: false })
      .range(from, to);

    if (categories?.length) {
      query = query.in("category_id", categories);
    }

    if (category) {
      query = query.eq("category_id", category);
    }

    if (tags?.length) {
      // @ts-ignore
      query = query.in("resource_tag.tag_id", tags);
    }

    if (published) {
      query = query.not("published_at", "is", null);
    }

    const { data, error, count } = await query;
    if (error) {
      throw error;
    }

    const finalData = data?.map((resource: MediaResource) => {
      if (!resource?.image_url) {
        resource.image_url = `${RESOURCE_BASE_URL}resource-images/post-placeholder.jpg`;
      } else if (!resource?.image_url?.startsWith("http")) {
        resource.image_url = `${RESOURCE_BASE_URL}${resource.image_url}`;
      }
      return resource;
    });

    return { data: finalData, count };
  }
}
