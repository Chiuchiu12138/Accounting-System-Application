"use client";

import Link from "next/link";
import { useContext } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/src/app/_components/shadcn/navigation-menu";
import { Separator } from "@/src/app/_components/shadcn/separator";
import { AuthContext, AuthScreen } from "../../_providers/AuthProvider";

export default function RightNavbarSection() {
  const { setAuthScreen, authenticatedUser, setAuthenticatedUser } =
    useContext(AuthContext);

  const username = authenticatedUser?.userInfo.username
    ? authenticatedUser?.userInfo.username.split("@")[0]
    : "Guest User";

  return (
    <div className="hidden items-center md:flex">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="w-36 rounded-full bg-white px-3 text-black">
              <div
                className="flex h-10 w-32 cursor-pointer items-center
                text-black"
              >
                <div>
                  <span className="icon-[iconoir--profile-circle] size-6 align-middle"></span>
                </div>
                <div className="mx-auto font-dmSans text-xs font-normal">
                  {username.length > 10
                    ? username.substring(0, 10) + "..."
                    : username}
                </div>
                {/* <div>
                  <span className="icon-[teenyicons--down-outline] mr-2 size-3 align-middle"></span>
                </div> */}
              </div>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="flex w-[300px] flex-col gap-3 p-4 lg:w-[400px]">
                {authenticatedUser?.userToken ? (
                  // logged in view
                  <>
                    <div className="flex justify-center">
                      <div>
                        <span className="icon-[iconoir--profile-circle] mr-2 size-6 align-middle"></span>
                      </div>
                      <div className="text-center font-bold">{username}</div>
                    </div>
                    <Separator></Separator>
                    <Link href="/dashboard">
                      <NavigationMenuLink asChild>
                        <div className="block w-full cursor-pointer select-none space-y-1 rounded-md border-1.5 border-imageBackground p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">
                            My Dashboard
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            View and create invoices.
                          </p>
                        </div>
                      </NavigationMenuLink>
                    </Link>
                    <Link href="/">
                      <NavigationMenuLink
                        asChild
                        onClick={() => setAuthenticatedUser(undefined)}
                      >
                        <div className="block w-full cursor-pointer select-none space-y-1 rounded-md border-1.5 border-imageBackground p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">
                            Log Out
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Log out of your account.
                          </p>
                        </div>
                      </NavigationMenuLink>
                    </Link>
                  </>
                ) : (
                  // logged out view
                  <>
                    <div className="flex justify-center">
                      <div>
                        <span className="icon-[iconoir--profile-circle] mr-2 size-6 align-middle"></span>
                      </div>
                      <div className="text-center font-bold">{username}</div>
                    </div>
                    <Separator></Separator>
                    <NavigationMenuLink
                      asChild
                      onClick={() => setAuthScreen(AuthScreen.LOGIN)}
                    >
                      <div className="block w-full cursor-pointer select-none space-y-1 rounded-md border-1.5 border-imageBackground p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">
                          Log In
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Log in to your account.
                        </p>
                      </div>
                    </NavigationMenuLink>
                    <NavigationMenuLink
                      asChild
                      onClick={() => setAuthScreen(AuthScreen.SIGNUP)}
                    >
                      <div className="block w-full cursor-pointer select-none space-y-1 rounded-md border-1.5 border-imageBackground p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">
                          Sign Up
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Create a new account.
                        </p>
                      </div>
                    </NavigationMenuLink>
                  </>
                )}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
