
import type { GetServerSideProps } from 'next'
import { sanityClient, urlFor } from '../sanity'
import { Collection } from '../typings'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
  collections: Collection[]
}

const Body = ({ collections }: Props) => {

  return (
    <div className='text-center my-16'>
      {/* greet */}
      <div className="mb-8">
        <p className="text-4xl mb-4">Welcome to DEN Market Place!</p>
        <p className="text-2xl">Take a look at the available NFTs and mint away!</p>
      </div>
      {/* collections */}
      <div className="inline-block">
        <Link href={`/nft/${collections[0].slug.current}`}>
        <Image className='w-80 h-auto object-cover rounded-lg' src={urlFor(collections[0].mainImage).url()} alt="" width={400} height={400} priority />
          <p className='text-3xl mt-2'>{collections[0].title}</p>
        </Link>
      </div>
    </div>
  )
}
export default Body

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
