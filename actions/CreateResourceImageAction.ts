import Jimp from 'jimp';
import Joi from 'joi';
import { NextApiRequest } from 'next';
import ogs from 'open-graph-scraper';

import { ResourceRepository } from '../repositories/ResourceRepository';
import { RESOURCE_IMAGE_BUCKET } from '../utils/storage_buckets';
import { supabaseAdmin } from '../utils/supabase';
import ApiResponse from './_base/ApiResponse';
import BaseAction from './_base/BaseAction';

export default class CreateResourceImageAction extends BaseAction {
  async handle(req: NextApiRequest): Promise<ApiResponse> {
    const {
      body: { resource_url, resource_id },
    } = req;
    let imageKey;
    const imageUrl = await this.getOgImage(resource_url);
    try {
      const imageBuffer = await this.processImage(imageUrl);
      imageKey = await this.uploadImageToStorage(resource_id, imageBuffer);
    } finally {
      if (imageKey) {
        await this.updateResourceImageUrl(resource_id, imageKey);
      }
    }

    return new ApiResponse().body({ imageKey }).status(201);
  }

  rules(): Joi.Schema {
    return Joi.object({
      resource_url: Joi.string().uri().required(),
      resource_id: Joi.number().required(),
    }).required();
  }

  private getOgImage(url: string): Promise<string> {
    return ogs({ url }).then((data) => {
      // @ts-ignore
      return data?.result?.ogImage?.url;
    });
  }

  private async processImage(url: string): Promise<Buffer> {
    const jimpImage = await Jimp.read(url);
    const imageWidth = jimpImage.getWidth();
    const maxWidth = 1200;
    if (imageWidth > maxWidth) {
      return jimpImage.resize(maxWidth, Jimp.AUTO, Jimp.RESIZE_BEZIER).getBufferAsync(Jimp.MIME_JPEG);
    }
    return jimpImage.getBufferAsync(Jimp.MIME_JPEG);
  }

  private async uploadImageToStorage(resource_id: number, image: Buffer): Promise<string> {
    const { data, error } = await supabaseAdmin.storage
      .from(RESOURCE_IMAGE_BUCKET)
      .upload(`${resource_id}.jpeg`, image, {
        contentType: Jimp.MIME_JPEG,
        upsert: true,
      });

    return data?.Key as string;
  }

  private async updateResourceImageUrl(resource_id: number, imageUrl: string) {
    const resourceRepository = new ResourceRepository();
    return resourceRepository.update(resource_id, { image_url: imageUrl });
  }
}
