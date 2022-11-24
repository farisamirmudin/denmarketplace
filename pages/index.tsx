import type { GetServerSideProps } from 'next'
import { sanityClient, urlFor } from '../sanity'
import { Collection } from '../typings'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
  collections: Collection[]
}

const Home = ({ collections }: Props) => {
  return (
    <div className="min-h-screen  text-white flex flex-col">
      <p className='text-4xl text-center py-8  text-black'>NFT Market Place</p>
      <main className='flex flex-col items-center justify-center bg-gradient-to-br from-[#7D77FF] to-[#FF9482] flex-1 gap-y-4'>
        <div>
          {collections && collections.map(collection => {
            return (
              <Link href={`/nft/${collection.slug.current}`} key={collection._id}>
                <div className='transition-all duration-200 hover:scale-105 text-center'>
                  <div className="relative bg-white p-2 rounded-xl">
                    <Image className='h-72 w-72 object-cover rounded-lg cursor-pointer' src={urlFor(collection.mainImage).url()} alt="" width={200} height={200} priority />
                  </div>
                  <p className='text-3xl mt-4'>{collection.title}</p>
                  <p className='text-sm italic text-gray-200'>{collection.description}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
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
    }`
  const collections = await sanityClient.fetch(query)
  return {
    props: {
      collections
    }
  }
}
