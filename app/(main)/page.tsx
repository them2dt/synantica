"use client"
import { Hero } from "@/components/hero";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/layout";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Store, Calendar,Trophy, Users, Network } from "lucide-react";
import Backdrop from "@/components/ui/backdrop";
import { useState } from "react";

import AuthPanel from "@/components/ui/auth-panel";

export default function Home() {
  const [authPanel,setAuthPanel]=useState(false);
  const [authType,setAuthType]=useState(false);// false=> login, true=> register
  const openSignIn=()=>{setAuthType(false);setAuthPanel(true);};
  const openSignUp=()=>{setAuthType(true);setAuthPanel(true);};
  const closeAuth=()=>{setAuthPanel(false);};
  return (
    <main className="w-screen h-screen flex flex-col items-center bg-background">
      {/* Theme Button - Absolute positioned */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeSwitcher />
      </div>
      
      <div className="flex-1 w-full h-full flex flex-col px-60 py-32 items-center">
        <div className="relative flex flex-row items-center justify-center w-full h-full border-[1px] border-foreground/10 rounded-3xl overflow-hidden">
          <div className="flex flex-col items-center justify-center gap-16 w-full h-full bg-foreground/5 border-r-[1px] border-r-foreground/10 rounded-l-3xl">
            <div className="flex flex-col items-center justify-center gap-2 px-20">
              <div className="font-heading font-semibold text-foreground text-3xl">
                Synantica, the database for STEM.
              </div>
              <div className="font-sans font-regular text-center text-lg text-gray-500">
                Discover contests, hackathons, events and workshops to discover
                your potential and grow your network.
              </div>
            </div>
            <div className="w-4/5 h-[1px] bg-foreground/10"></div>
            <div className="flex flex-row items-center justify-center gap-16">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="flex flex-row items-center justify-center h-20 w-20 p-2 border-2 border-foreground/5 border-b-teal-500/40 border-t-teal-500/40 rounded-full">
                  <div className="flex flex-row items-center justify-center h-full w-full bg-teal-500 rounded-full">
                    <Trophy className="text-background" />
                  </div>
                </div>
                <div className="font-sans font-semibold text-xl text-foreground">
                  Contests
                </div>
              </div>
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="flex flex-row items-center justify-center h-20 w-20 p-2 border-2 border-foreground/5 border-b-amber-500/40 border-t-amber-500/40 rounded-full">
                  <div className="flex flex-row items-center justify-center h-full w-full bg-amber-500 rounded-full">
                    <Users className="text-background" />
                  </div>
                </div>
                <div className="font-sans font-semibold text-xl text-foreground">
                  Events
                </div>
              </div>
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="flex flex-row items-center justify-center h-20 w-20 p-2 border-2 border-foreground/5 border-b-pink-500/40 border-t-pink-500/40 rounded-full">
                  <div className="flex flex-row items-center justify-center h-full w-full bg-pink-500 rounded-full">
                    <Network className="text-background" />
                  </div>
                </div>
                <div className="font-sans font-semibold text-xl text-foreground">
                  Hackathons
                </div>
              </div>
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="flex flex-row items-center justify-center h-20 w-20 p-2 border-2 border-foreground/5 border-b-purple-500/40 border-t-purple-500/40 rounded-full">
                  <div className="flex flex-row items-center justify-center h-full w-full bg-purple-500 rounded-full">
                    <Store className="text-background" />
                  </div>
                </div>
                <div className="font-sans font-semibold text-xl text-foreground">
                  Workshops
                </div>
              </div>
            </div>
          </div>
          <div className="relative flex flex-col w-full h-full rounded-0">
            <img
              src="/cover.png"
              alt="Synantica Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-row justify-center items-end p-0">
              <div className="h-24 w-full flex flex-row justify-center items-center p-4 gap-2 backdrop-blur-sm bg-background/10 border-t-[1px] border-background/20">
                <button className="flex flex-row items-center justify-center w-full h-full cursor-pointer bg-pink-500 border-[2px] border-foreground/20 rounded-lg" onClick={openSignIn}>
                  <div className="backgroundspace-nowrap font-sans font-bold text-background">
                    Log in
                  </div>
                </button>
                <button className="flex flex-row items-center justify-center w-full h-full cursor-pointer bg-background border-[2px] border-foreground/20 rounded-lg" onClick={openSignUp}>
                  <div className="backgroundspace-nowrap font-sans font-bold text-foreground">
                    Register
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {authPanel&&<Backdrop onClick={closeAuth}>
        <AuthPanel mode={authType?"signup":"signin"} onClose={closeAuth}/>
      </Backdrop>}
    </main>
  );
}
