import { useAddress, useContract } from "@thirdweb-dev/react"
import Image from 'next/image'
import { GetServerSideProps } from 'next'
import { sanityClient } from "../../sanity"
import { Collection } from "../../typings"
import { useEffect, useState } from "react"
import { BigNumber } from "ethers"
import toast, { Toaster } from 'react-hot-toast'

const DropPage = ({ collection }: { collection: Collection }) => {

  const address = useAddress()

  // Get total supply and claimed supply
  const { contract } = useContract(collection.address, "nft-drop")
  const [claimedSupply, setClaimSupply] = useState<BigNumber>()
  const [totalSupply, setTotalSupply] = useState<number>()
  const [currentPrice, setCurrentPrice] = useState<number>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!contract) return

    const getNFTs = async () => {
      const claimCondition = await contract.claimConditions.getAll()
      const price = parseInt(claimCondition[0].price._hex) / (10 ** 18)
      setCurrentPrice(price)

      const claimedNFTCount = await contract?.totalClaimedSupply();
      const nfts = await contract.getAll();
      setClaimSupply(claimedNFTCount)
      setTotalSupply(nfts.length)

    }
    getNFTs()
  }, [contract])

  const mintNFT = async () => {
    if (!contract || !address) return
    setIsLoading(true)
    const notification = toast.loading('Minting...')
    try {
      const tx = await contract?.claimTo(address, 1)
      toast.dismiss(notification)
      toast.success('You succesfully minted!', {
        duration: 5000
      })
      const receipt = tx[0].receipt
      const claimedTokenId = tx[0].id
      const claimedNFT = await tx[0].data()
    } catch (error) {
      toast.dismiss(notification)
      toast.error('Something went wrong!', {
        duration: 5000
      })
    }
    setIsLoading(false)

  }

  return (
    <>
      <Toaster position="bottom-right" />
      <div className='flex flex-col-reverse lg:grid lg:grid-cols-10 items-center lg:mt-36 mt-20'>
        {/* left section */}
        <div className="lg:col-span-6 text-center">
          {/* content */}
          <div className="flex flex-col items-center mb-12">
            <Image className='w-80 lg:h-40 object-cover rounded-lg' src="https://links.papareact.com/bdy" alt="" width={400} height={400} priority />
            <p className='text-3xl lg:text-4xl my-2'>{collection.collectionName} Collection</p>
            <p className='text-green-500 text-sm'>{!claimedSupply ? 'Fetching NFTs...' : `${claimedSupply}/${totalSupply} NFT's claimed`}</p>
          </div>
          {/* mint button */}
          <button onClick={mintNFT} disabled={!claimedSupply || !address || claimedSupply.toNumber() === totalSupply || isLoading} className='w-full bg-gray-100 text-zinc-900 rounded-lg px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50 lg:mb-0 mb-8'>{!claimedSupply || isLoading ? 'Loading...' : `Mint NFT (${currentPrice} ETH)`}</button>
        </div>
        {/* right section */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <Image className='h-auto lg:w-72 w-48' src="https://links.papareact.com/8sg" alt="" width={300} height={300} priority />
          <p className='text-4xl mt-2 mb-8 lg:mb-0'>{collection.title}</p>
        </div>
      </div>
    </>
  )
}

export default DropPage
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
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
    }`
  const collection = await sanityClient.fetch(query, {
    id: params?.id
  })
  if (!collection) {
    return {
      notFound: true
    }
  }
  return {
    props: {
      collection
    }
  }
}