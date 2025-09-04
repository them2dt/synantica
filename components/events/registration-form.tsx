'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar, Clock, MapPin, Users, CheckCircle, AlertCircle } from 'lucide-react'

/**
 * Event data interface
 */
interface Event {
  id: string
  title: string
  description: string
  category: string
  date: string
  time: string
  location: string
  attendees: number
  maxAttendees: number
  image?: string
  tags: string[]
  requirements: string[]
  prizes: string[]
  organizer: string
}

/**
 * Props for the registration form component
 */
interface RegistrationFormProps {
  event: Event
}

/**
 * Registration form component
 * Handles event registration with validation and confirmation
 */
export function RegistrationForm({ event }: RegistrationFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    university: '',
    major: '',
    year: '',
    experience: '',
    motivation: '',
    dietaryRestrictions: '',
    emergencyContact: '',
    emergencyPhone: '',
    agreeToTerms: false,
    agreeToPhotos: false
  })

  // Check if event is full
  const isEventFull = event.attendees >= event.maxAttendees
  const spotsRemaining = event.maxAttendees - event.attendees

  /**
   * Handle form input changes
   */
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate required fields
      const requiredFields = ['fullName', 'email', 'university', 'major', 'year', 'motivation']
      const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData])
      
      if (missingFields.length > 0) {
        alert(`Please fill in all required fields: ${missingFields.join(', ')}`)
        return
      }

      if (!formData.agreeToTerms) {
        alert('Please agree to the terms and conditions to continue.')
        return
      }

      // Create registration object
      const registrationData = {
        eventId: event.id,
        ...formData,
        registeredAt: new Date().toISOString(),
        status: 'confirmed'
      }

      // TODO: Replace with actual API call
      console.log('Registering for event:', registrationData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setRegistrationSuccess(true)
      
    } catch (error) {
      console.error('Error registering for event:', error)
      alert('Failed to register for event. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show success message
  if (registrationSuccess) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">Registration Successful!</CardTitle>
          <CardDescription>
            You have successfully registered for {event.title}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            You will receive a confirmation email shortly with event details and next steps.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
            <Button variant="outline" onClick={() => router.push(`/events/${event.id}`)}>
              View Event Details
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Event Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Event Registration</CardTitle>
          <CardDescription>
            Register for {event.title}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {event.date}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              {event.time}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {event.location}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              {event.attendees}/{event.maxAttendees} registered
            </div>
          </div>
          
          {isEventFull && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-medium">This event is full</span>
            </div>
          )}
          
          {!isEventFull && spotsRemaining <= 10 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <span className="text-yellow-800 font-medium">
                Only {spotsRemaining} spots remaining!
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Registration Form */}
      <Card>
        <CardHeader>
          <CardTitle>Registration Information</CardTitle>
          <CardDescription>
            Please fill out the form below to register for this event.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="university">University *</Label>
                  <Input
                    id="university"
                    value={formData.university}
                    onChange={(e) => handleInputChange('university', e.target.value)}
                    placeholder="Enter your university"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="major">Major/Field of Study *</Label>
                  <Input
                    id="major"
                    value={formData.major}
                    onChange={(e) => handleInputChange('major', e.target.value)}
                    placeholder="Enter your major"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="year">Academic Year *</Label>
                  <Input
                    id="year"
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    placeholder="e.g., Freshman, Sophomore, Junior, Senior, Graduate"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Event-Specific Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Event-Specific Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="experience">Relevant Experience</Label>
                <Textarea
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  placeholder="Describe your relevant experience, skills, or background..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="motivation">Motivation for Attending *</Label>
                <Textarea
                  id="motivation"
                  value={formData.motivation}
                  onChange={(e) => handleInputChange('motivation', e.target.value)}
                  placeholder="Why do you want to attend this event? What do you hope to learn or achieve?"
                  rows={3}
                  required
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
                <Input
                  id="dietaryRestrictions"
                  value={formData.dietaryRestrictions}
                  onChange={(e) => handleInputChange('dietaryRestrictions', e.target.value)}
                  placeholder="Any dietary restrictions or allergies?"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    placeholder="Emergency contact name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                    placeholder="Emergency contact phone"
                  />
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Terms and Conditions</h3>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
                    required
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm">
                    I agree to the <a href="#" className="text-primary underline">Terms and Conditions</a> and <a href="#" className="text-primary underline">Privacy Policy</a> *
                  </Label>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreeToPhotos"
                    checked={formData.agreeToPhotos}
                    onCheckedChange={(checked) => handleInputChange('agreeToPhotos', checked as boolean)}
                  />
                  <Label htmlFor="agreeToPhotos" className="text-sm">
                    I consent to being photographed or filmed during the event for promotional purposes
                  </Label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <Button 
                type="submit" 
                disabled={isSubmitting || isEventFull} 
                className="flex-1"
                size="lg"
              >
                {isSubmitting ? 'Registering...' : isEventFull ? 'Event Full' : 'Register for Event'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push(`/events/${event.id}`)}
                className="flex-1"
                size="lg"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
