import algoliasearch from "algoliasearch";


// @ts-ignore
const client = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALGOLIA_PUBLIC_KEY);
// @ts-ignore
export const algolia = client.initIndex(process.env.NEXT_PUBLIC_ALGOLIA_INDEX);