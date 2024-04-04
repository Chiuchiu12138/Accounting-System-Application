import Link from "next/link";
import RightNavbarSection from "@/src/app/_components/navbar/RightNavbarSection";
import clsx from "clsx";

export default async function Navbar() {
  return (
    <div className="w-full print:hidden">
      <div
        className="mb-5 flex h-14 items-center justify-between rounded-full bg-customBlack
          px-2 align-middle text-white"
      >
        <Link href={"/"}>
          <div className="w-fit pl-2 font-alumniSans text-3xl font-bold md:w-44">BookBreeze</div>
        </Link>
        <div className="hidden font-dmSans text-sm font-normal md:inline-block [&>a]:mx-2">
          <Link className={clsx("text-nowrap")} href="/dashboard">
            Dashboard
          </Link>
          <Link className={clsx("text-nowrap")} href="/">
            Home
          </Link>
          <Link className={clsx("text-nowrap")} href="/dashboard">
            Reports
          </Link>
        </div>

        <RightNavbarSection></RightNavbarSection>

        {/* Hamburger and Mobile Nav */}
        <div className="icon-[charm--menu-hamburger] mr-3 h-10 min-h-10 w-10 min-w-10 cursor-pointer text-white md:hidden"></div>
      </div>
    </div>
  );
}
