import Link from 'next/link';


export default function Navigation() {
  return (
    <nav id="nav-bar">
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
      </ul>
    </nav>
  );
}