'use client'

import { useState } from 'react'
import { AuthForm } from './auth-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Users, MapPin, Heart } from 'lucide-react'
import Image from 'next/image'

/**
 * Props for the login layout component
 */
interface LoginLayoutProps {
  mode: 'signin' | 'signup'
  onModeChange: (mode: 'signin' | 'signup') => void
}

/**
 * Login layout component with HelloFresh-style design
 * Features a two-column layout with login form on left and promotional content on right
 */
export function LoginLayout({ mode, onModeChange }: LoginLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 bg-background">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-header-bold text-primary mb-2">
              Campus Events
            </h1>
            <p className="text-muted-foreground font-content">
              {mode === 'signin' 
                ? 'Welcome back! Sign in to discover amazing events' 
                : 'Join the community! Create your account to get started'
              }
            </p>
          </div>

          {/* Login Form */}
          <AuthForm mode={mode} onModeChange={onModeChange} />
        </div>
      </div>

      {/* Right Side - Promotional Content */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary rounded-full"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-accent rounded-full"></div>
          <div className="absolute bottom-32 left-16 w-20 h-20 bg-primary rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-accent rounded-full"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 py-16">
          <div className="max-w-md">
            {/* Main Headline */}
            <h2 className="text-4xl font-header-bold text-foreground mb-6 leading-tight">
              Events at your fingertips
            </h2>
            
            {/* Description */}
            <p className="text-lg text-muted-foreground font-content mb-8 leading-relaxed">
              Discover, join, and manage campus events all in one place. Connect with fellow students and make the most of your university experience.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-header-medium text-foreground">Discover Events</h3>
                  <p className="text-sm text-muted-foreground font-content">Find workshops, hackathons, and social events</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-header-medium text-foreground">Connect & Network</h3>
                  <p className="text-sm text-muted-foreground font-content">Meet like-minded students and build connections</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-header-medium text-foreground">Never Miss Out</h3>
                  <p className="text-sm text-muted-foreground font-content">Get notified about events happening on campus</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-border">
              <div className="text-center">
                <div className="text-2xl font-header-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground font-content">Events</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-header-bold text-accent">2.5K+</div>
                <div className="text-sm text-muted-foreground font-content">Students</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-primary/20 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-accent/20 to-transparent rounded-full -translate-y-24 -translate-x-24"></div>
      </div>
    </div>
  )
}
