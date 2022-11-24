import { useAddress, useContract, useDisconnect, useMetamask } from "@thirdweb-dev/react"
import Image from 'next/image'
import { GetServerSideProps } from 'next'
import { sanityClient, urlFor } from "../../sanity"
import { Collection } from "../../typings"
import { useEffect, useState } from "react"
import { BigNumber } from "ethers"
import toast, { Toaster } from 'react-hot-toast'

const DropPage = ({ collection }: { collection: Collection }) => {

  // Connect to metamask
  const connectWithMetamask = useMetamask()
  const disconnect = useDisconnect()
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
    const notification = toast.loading('Minting...', {
      style: {
        color: 'white',
        padding: '10px',
        background: '#16a34a'
      }
    })
    try {
      const tx = await contract?.claimTo(address, 1)
      toast.dismiss(notification)
      toast('You succesfully minted!', {
        duration: 5000,
        style: {
          color: 'white',
          padding: '10px',
          background: '#16a34a'
        }
      })
      const receipt = tx[0].receipt
      const claimedTokenId = tx[0].id
      const claimedNFT = await tx[0].data()
    } catch (error) {
      toast.dismiss(notification)
      toast('Something went wrong!', {
        style: {
          color: 'white',
          padding: '10px',
          background: '#dc2626'
        }
      })
    }
    setIsLoading(false)
    
  }

  return (
    <div className='flex flex-col lg:grid lg:grid-cols-10 min-h-screen'>
      <Toaster position="bottom-left" />
      {/* Left Section */}
      <div className="lg:col-span-4 flex flex-col justify-center items-center py-8 bg-gradient-to-br from-[#7D77FF] to-[#FF9482] lg:min-h-screen">
        <div className="relative bg-gradient-to-br from-yellow-400 to-purple-600 p-2 rounded-xl">
          <Image className='w-44 lg:w-72 lg:h-96' src="https://links.papareact.com/8sg" alt="" width={300} height={300} priority />
        </div>
        <div className="text-center p-2">
          <p className='text-white text-4xl'>{collection.title}</p>
          <p className='text-gray-200 italic'>{collection.description}</p>
        </div>
      </div>

      {/* Right section */}
      <div className="lg:col-span-6 p-8 flex flex-col justify-between">
        {/* header */}
        <div className="">
          <div className="flex items-center justify-between">
            <p className='font-extralight text-xl'>NFT Marketplace</p>
            <button onClick={() => address ? disconnect() : connectWithMetamask()} className='rounded-full bg-[#FF9482] text-white px-4 py-2 '>{address ? "Sign out" : "Sign in"}</button>
          </div>
          <hr className='mt-2 border' />
          {address && <p className='text-green-400 text-sm text-center'>Connected wallet: {address}</p>}
        </div>
        {/* content */}
        <div className="flex flex-col items-center py-6">
          <Image className='w-80 lg:h-40 object-cover' src="https://links.papareact.com/bdy" alt="" width={400} height={400} priority />
          <p className='text-3xl font-bold lg:text-4xl lg:font-extrabold mt-4 mb-2'>{collection.collectionName} | NFT Drop</p>
          <p className='text-green-500 text-sm'>{!claimedSupply ? 'Fetching NFTs...' : `${claimedSupply}/${totalSupply} NFT's claimed`}</p>
        </div>
        {/* mint button */}
        <div>
          <button onClick={mintNFT} disabled={!claimedSupply || !address || claimedSupply.toNumber() === totalSupply} className='w-full bg-[#FF9482] rounded-full p-2 text-white disabled:cursor-not-allowed disabled:opacity-50'>{claimedSupply && !isLoading ? `Mint NFT (${currentPrice} ETH)` : 'Loading...'}</button>
        </div>
      </div>
    </div>
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