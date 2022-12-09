import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react"
import Link from "next/link"

const Nav = () => {
  const connectWithMetamask = useMetamask()
  const disconnect = useDisconnect()
  const address = useAddress()
  return (
    <div className="flex sm:flex-row flex-col justify-between items-center gap-2">
      <Link href={'/'} className='text-3xl'>DEN Market Place</Link>
      <div className="flex gap-2 items-center">
        {address && <p className="text-sm">{address.slice(0, 4) + '...' + address.slice(-4)}</p>}
        <button onClick={() => address ? disconnect() : connectWithMetamask()} className='rounded-lg bg-gray-100 text-zinc-900 px-4 py-2 '>{address ? 'Sign Out' : "Sign In"}</button>
      </div>
    </div>
  )
}

export default Nav