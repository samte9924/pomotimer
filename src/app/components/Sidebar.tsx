import Link from "next/link";

export const Sidebar = () => {
  return (
    <aside className="h-screen w-64 bg-gray-500 p-4">
      <nav>
        <ul>
          <li>
            <Link href="/">
              <span className="block p-2 text-white hover:text-gray-200">
                Home
              </span>
            </Link>
          </li>
          <li>
            <Link href="/report">
              <span className="block p-2 text-white hover:text-gray-200">
                Report
              </span>
            </Link>
          </li>
          <li>
            <Link href="/upload">
              <span className="block p-2 text-white hover:text-gray-200">
                Carica sessioni
              </span>
            </Link>
          </li>
          <li>
            <Link href="/profile">
              <span className="block p-2 text-white hover:text-gray-200">
                Profilo
              </span>
            </Link>
          </li>
          <li>
            <Link href="/settings">
              <span className="block p-2 text-white hover:text-gray-200">
                Impostazioni
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};
