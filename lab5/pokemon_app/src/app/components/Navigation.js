import Link from 'next/link';


export default function Navigation() {
  return (
    <nav id="nav-bar">
      <ul className='nav-links'>
        <li>
          <Link href="/">Home</Link>
          <Link href="/">Home</Link>
          <Link href="/">Home</Link>
        </li>
      </ul>
    </nav>
  );
}