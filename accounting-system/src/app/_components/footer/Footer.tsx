import Link from "next/link";

export default async function Navbar() {
  return (
    <div className="mt-40 flex w-full flex-col items-center justify-evenly gap-5 text-center sm:flex-row sm:items-start sm:text-left print:hidden">
      {/* Title/Slogan */}
      <div className="flex max-w-72 flex-col">
        <span className={"mb-4 font-alumniSans text-7xl font-gigabold"}>
          Title
          <span className="icon-[fluent-emoji-flat--copyright] ml-2 mt-3 h-4 w-4 align-top text-black"></span>
        </span>
        <span className="text-sm">Slogan</span>
      </div>
      {/* Column 1 */}
      <div className="flex flex-col">
        <span className="mb-4 font-dmSans text-xl font-semibold">Col 1 Title</span>
        <Link className="mb-2 text-sm" href="">
          Link 1
        </Link>
        <Link className="mb-2 text-sm" href="">
          Link 2
        </Link>
        <Link className="mb-2 text-sm" href="">
          Link 3
        </Link>
      </div>
      {/* Column 2 */}
      <div className="flex flex-col">
        <span className="mb-4 font-dmSans text-xl font-semibold">Col 2 Title</span>
        <Link className="mb-2 text-sm" href="">
          Link 1
        </Link>
        <Link className="mb-2 text-sm" href="">
          Link 2
        </Link>
        <Link className="mb-2 text-sm" href="">
          Link 3
        </Link>
      </div>
      {/* Column 3 */}
      <div className="flex flex-col">
        <span className="mb-4 font-dmSans text-xl font-semibold">Col 3 Title</span>
        <Link className="mb-2 text-sm" href="">
          Link 1
        </Link>
        <Link className="mb-2 text-sm" href="">
          Link 2
        </Link>
        <Link className="mb-2 text-sm" href="">
          Link 3
        </Link>
      </div>
    </div>
  );
}
