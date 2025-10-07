"use client"
import React from 'react'
type BackdropProps = {
    children: React.ReactNode;
    onClick?: () => void;
    isVisible?: boolean;
    className?: string;
  };

export default function Backdrop({ children, onClick, isVisible = true, className = "" }: BackdropProps) {
  return (
    <div onClick={onClick} className='fixed top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center bg-foreground/50 backdrop-blur-xl'>
      {children}
    </div>
  )
}
