import Link from 'next/link'
const Footer = () => {
  const style = 'hover:underline decoration-orange-400 decoration-2'
  return (
    <footer className="text-sm text-center">
      <div className="space-x-4">
        <Link className={style} target={'_blank'} href={'mailto: farisamirmudin@gmail.com'}>Email</Link>
        <Link className={style} target={'_blank'} href={'https://www.linkedin.com/in/farisamirmudin'}>Linkedin</Link>
        <Link className={style} target={'_blank'} href={'https://github.com/farisamirmudin'}>Github</Link>
        <Link className={style} target={'_blank'} href={'https://twitter.com/DenTokenFaucet'}>Twitter</Link>
      </div>
      <p className='pb-4 pt-2'>© 2022 Den Market Place</p>
    </footer>
  )
}

export default Footer

