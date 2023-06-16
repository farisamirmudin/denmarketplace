"use client";
import {
  ThirdwebNftMedia,
  useAddress,
  useClaimedNFTs,
  useClaimNFT,
  useContract,
  useMetamask,
  useNFTs,
  useUnclaimedNFTs,
} from "@thirdweb-dev/react";
import toast, { Toaster } from "react-hot-toast";

const Display = ({ collection }: { collection: Collection }) => {
  const connectWithMetamask = useMetamask();
  const address = useAddress();
  const { contract } = useContract(collection.address, "nft-drop");
  const { data: claimedNFTs } = useClaimedNFTs(contract);
  const { data: unclaimedNFTs } = useUnclaimedNFTs(contract);
  const { data: nfts, isLoading: NFTsLoading } = useNFTs(contract);
  const { isLoading: claimLoading } = useClaimNFT(contract);

  const mintNFT = async () => {
    if (!contract || !address) return;
    const notification = toast.loading("Minting...");
    try {
      const tx = await contract.claimTo(address, 1);
      toast.dismiss(notification);
      toast.success("You succesfully minted a nft", {
        duration: 5000,
      });
      const receipt = tx[0].receipt;
      const claimedTokenId = tx[0].id;
      const claimedNFT = await tx[0].data();
      console.log({ receipt, claimedTokenId, claimedNFT });
    } catch (e) {
      toast.dismiss(notification);
      toast.error("Fail to claim a nft, you may have insufficient fund!", {
        duration: 5000,
      });
    }
  };
  return (
    <>
      <Toaster position="bottom-center" />
      <div className="">
        {address ? (
          <p>Connected Wallet: {address}</p>
        ) : (
          <button onClick={() => connectWithMetamask()}>
            Connect Metamask
          </button>
        )}
        {NFTsLoading ? (
          <p>Fetching NFTs...</p>
        ) : (
          <div className="">
            <p>Scroll to the right to see more.</p>
            <div className="flex overflow-scroll gap-8">
              {nfts?.map((nft, i) => (
                <ThirdwebNftMedia key={i} metadata={nft.metadata} />
              ))}
            </div>
            {claimedNFTs && unclaimedNFTs && (
              <p className="">
                {claimedNFTs.length} out of{" "}
                {claimedNFTs.length + unclaimedNFTs.length} NFTs have been
                claimed
              </p>
            )}
            <div className="">
              <button onClick={mintNFT} disabled={claimLoading}>
                {claimLoading ? "Minting..." : "Claim NFT"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Display;
