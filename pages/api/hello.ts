// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

const ogs = require("open-graph-scraper");

type Data = {
  name: string;
};

const getOgImage = (url: string): Promise<string> => {
  return ogs({ url }).then((data: any) => {
    const { error, result, response } = data;
    return result?.ogImage?.url;
  });
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  res.status(200).json({ name: "John Doe" });
}
