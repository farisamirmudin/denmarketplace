import { sanityClient } from "sanity";
import Display from "./Display";

interface Params {
  params: {
    id: string;
  };
}
const getCollection = async (id: string) => {
  const query = `*[_type == "collection" && slug.current == $id][0]{
    _id,
    title,
    address,
    description,
    collectionName,
    mainImage {
      asset
    },
    previewImage {
      asset
    },
    slug {
      current
    },
    creator -> {
      _id,
      name,
      bio,
      address,
      slug {
      current
    },
    },
    }`;
  const collection = await sanityClient.fetch<Collection>(query, { id });
  return collection;
};

const page = async ({ params: { id } }: Params) => {
  const collection = await getCollection(id);
  return <Display collection={collection} />;
};

export default page;
