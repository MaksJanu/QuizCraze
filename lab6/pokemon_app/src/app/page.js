import Link from "next/link"


export default function Landing() {
  return (
    <div className='home-page'>
        <div className='links'>
            <p className='link'>
                <Link href='/pokemon'>Pokemon list</Link>
            </p>
            <p className='link'>
                <Link href='/favourites'>Favourites</Link>
            </p>
        </div>
    </div>
  );
}


