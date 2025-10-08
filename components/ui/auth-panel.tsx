import { X } from "lucide-react";
import React from "react";

export default function AuthPanel({
  mode = "signup",
  onClose
}: {
  mode?: "signin" | "signup";
  onClose: ()=>void;
}) {
  return (
    <div onClick={(e)=>{e.stopPropagation();}} className="relative flex flex-col justify-center items-center p-8 gap-8 bg-background/80 border-[1px] border-background/20 rounded-xl ">

      <div className="text-sans font-semibold text-foreground text-3xl">
        {mode == "signin" ? "Welcome back!" : "Sign up now!"}
      </div>
      <div className="flex flex-col justify-center items-center gap-3 w-72">
        <input
          className="w-full h-12 p-4 border-[1px] border-foreground/20 rounded-lg text-lg"
          placeholder="E-Mail"
        />
        <input
          className="w-full h-12 p-4 border-[1px] border-foreground/20 rounded-lg text-lg"
          placeholder="Password"
        />
        {mode == "signup" && (
          <input
            className="w-full h-12 p-4 border-[1px] border-foreground/20 rounded-lg text-lg"
            placeholder="Confirm password"
          />
        )}
        {mode == "signup" ? (
          <input
            className="flex flex-col justify-center items-center w-full h-12 bg-foreground border-[1px] border-foreground/20 rounded-lg font-heading tracking-wide font-semibold text-background text-lg"
            type="submit"
            placeholder="Password"
            value="Sign up"
          />
        ) : (
          <input
            className="flex flex-col justify-center items-center w-full h-12 bg-foreground border-[1px] border-foreground/20 rounded-lg font-heading tracking-wide font-semibold text-background text-lg"
            type="submit"
            placeholder="Password"
            value="Log in"
          />
        )}
        <div className="flex flex-row justify-center items-center gap-2">
          <input className="" type="checkbox" placeholder="Password" />
          <div className="font-sans font-regular text-sm text-foreground">
            Remember me
          </div>
        </div>
      </div>
      <button className="absolute top-2 right-2 flex flex-row justify-center items-center" onClick={onClose}><X/></button>
    </div>
  );
}
