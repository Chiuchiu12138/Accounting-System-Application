import Link from "next/link";

export default async function Navbar() {
  return (
    <div className="flex justify-evenly items-center sm:items-start text-center gap-5 mt-40 flex-col sm:flex-row sm:text-left w-full">
      {/* Title/Slogan */}
      <div className="flex max-w-72 flex-col">
        <span className={"font-alumniSans font-gigabold mb-4 text-7xl"}>
          Title
          <span className="align-top ml-2 mt-3 icon-[fluent-emoji-flat--copyright] h-4 w-4 text-black"></span>
        </span>
        <span className="text-sm">Slogan</span>
      </div>
      {/* Column 1 */}
      <div className="flex flex-col">
        <span className="font-dmSans font-semibold mb-4 text-xl">
          Col 1 Title
        </span>
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
        <span className="font-dmSans font-semibold mb-4 text-xl">
          Col 2 Title
        </span>
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
        <span className="font-dmSans font-semibold mb-4 text-xl">
          Col 3 Title
        </span>
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
