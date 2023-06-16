import Image from "next/image";
import { Roboto } from "next/font/google";
import { sanityClient, urlFor } from "sanity";
import Link from "next/link";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["italic", "normal"],
});

const getContract = async () => {
  const query = `*[_type == "collection"]{
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
  const collections = sanityClient.fetch<Collection[]>(query);
  return collections;
};

export default async function Home() {
  const collections = await getContract();
  return (
    <div className="">
      <p className="text-lg">Welcome to DEN Market Place</p>
      <p className="">Take a look at the available NFTs and mint away!</p>
      {collections.length > 0 &&
        collections.map((collection, i) => (
          <Link key={i} href={`/nft/${collection.slug.current}`}>
            <Image
              src={urlFor(collection.mainImage).url()}
              alt={collection.collectionName}
              width={400}
              height={400}
              priority
            />
            <p className="">{collection.title}</p>
          </Link>
        ))}
    </div>
  );
}
