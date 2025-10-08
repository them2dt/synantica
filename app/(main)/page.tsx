"use client"
import { Store, Trophy, Users, Network } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/lib/contexts/auth-context";

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthContext();

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const handleRegister = () => {
    router.push('/auth/sign-up');
  };

  const handleDashboard = () => {
    router.push('/dashboard');
  };

  // If user is authenticated, show welcome screen
  if (isAuthenticated && user) {
    return (
      <main className="w-screen h-screen flex flex-col items-center">
        {/* Add spacing for floating navbar */}
        <div className="h-20" />
        <div className="flex-1 w-full h-full flex flex-col px-60 py-16 items-center">
          <div className="relative flex flex-row items-center justify-center w-full h-full border-[1px] border-gray-200 rounded-3xl overflow-hidden">
            <div className="flex flex-col items-center justify-center gap-16 w-full h-full border-r-[1px] border-r-gray-200 bg-gray-100 rounded-l-3xl">
              <div className="flex flex-col items-center justify-center gap-2 px-20">
                <div className="font-heading font-semibold text-3xl">
                  Welcome back, {user.email?.split('@')[0]}!
                </div>
                <div className="font-sans font-regular text-center text-lg text-gray-500">
                  Ready to discover your next career opportunity?
                </div>
              </div>
              <div className="w-4/5 h-[1px] bg-gray-200"></div>
              <div className="flex flex-row items-center justify-center gap-16">
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="flex flex-row items-center justify-center h-20 w-20 p-2 border-2 border-gray-100 border-b-teal-100 border-t-teal-100 rounded-full">
                    <div className="flex flex-row items-center justify-center h-full w-full bg-teal-500 rounded-full">
                      <Trophy className="text-white" />
                    </div>
                  </div>
                  <div className="font-sans font-semibold text-xl text-foreground">
                    Contests
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="flex flex-row items-center justify-center h-20 w-20 p-2 border-2 border-gray-100 border-b-amber-100 border-t-amber-100 rounded-full">
                    <div className="flex flex-row items-center justify-center h-full w-full bg-amber-500 rounded-full">
                      <Users className="text-white" />
                    </div>
                  </div>
                  <div className="font-sans font-semibold text-xl text-foreground">
                    Events
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="flex flex-row items-center justify-center h-20 w-20 p-2 border-2 border-gray-100 border-b-pink-100 border-t-pink-100 rounded-full">
                    <div className="flex flex-row items-center justify-center h-full w-full bg-pink-500 rounded-full">
                      <Network className="text-white" />
                    </div>
                  </div>
                  <div className="font-sans font-semibold text-xl text-foreground">
                    Hackathons
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="flex flex-row items-center justify-center h-20 w-20 p-2 border-2 border-gray-100 border-b-purple-100 border-t-purple-100 rounded-full">
                    <div className="flex flex-row items-center justify-center h-full w-full bg-purple-500 rounded-full">
                      <Store className="text-white" />
                    </div>
                  </div>
                  <div className="font-sans font-semibold text-xl text-foreground">
                    Workshops
                  </div>
                </div>
              </div>
            </div>
            <div className="relative flex flex-col w-full h-full bg-pink-500 rounded-0">
              <img
                src="/cover.png"
                alt="Synantica Cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-row justify-center items-end p-0">
                <div className="h-24 w-full flex flex-row justify-center items-center p-4 gap-2 backdrop-blur-sm bg-white/10 border-t-[1px] border-white/20">
                  <button 
                    className="flex flex-row items-center justify-center w-full h-full cursor-pointer bg-pink-500 border-[2px] border-black/20 rounded-lg hover:bg-pink-600 transition-colors" 
                    onClick={handleDashboard}
                  >
                    <div className="whitespace-nowrap font-sans font-bold text-white">
                      Go to Dashboard
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

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
              <div className="h-24 w-full flex flex-row justify-center items-center p-4 gap-2 backdrop-blur-sm bg-white/10 border-t-[1px] border-white/20">
                <button 
                  className="flex flex-row items-center justify-center w-full h-full cursor-pointer bg-pink-500 border-[2px] border-black/20 rounded-lg hover:bg-pink-600 transition-colors" 
                  onClick={handleLogin}
                >
                  <div className="whitespace-nowrap font-sans font-bold text-white">
                    Log in
                  </div>
                </button>
                <button 
                  className="flex flex-row items-center justify-center w-full h-full cursor-pointer bg-white border-[2px] border-black/20 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={handleRegister}
                >
                  <div className="whitespace-nowrap font-sans font-bold text-black">
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
