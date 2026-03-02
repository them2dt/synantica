'use client'

import { useState } from 'react'
import { Event, EventStatus } from '@/types/event'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ThemedText } from '@/components/ui/themed-text'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X, Plus, Send, CheckCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { auth, db } from '@/lib/firebase/client'
import { addDoc, collection } from 'firebase/firestore'

interface SubmitEventModalProps {
  isOpen: boolean
  onClose: () => void
}

const eventTypes = [
  { value: 'olympiads', label: 'Olympiads' },
  { value: 'contests', label: 'Contests' },
  { value: 'events', label: 'Events' },
  { value: 'workshops', label: 'Workshops' },
]

const commonFields = [
  'computer-science', 'business', 'engineering', 'design', 'marketing',
  'data-science', 'artificial-intelligence', 'cybersecurity', 'web-development',
  'blockchain', 'startup', 'entrepreneurship', 'leadership', 'communication',
  'physics', 'mathematics', 'biology', 'chemistry', 'other',
]

export function SubmitEventModal({ isOpen, onClose }: SubmitEventModalProps) {
  const [formData, setFormData] = useState<Partial<Event>>({
    name: '',
    description: '',
    fromDate: new Date().toISOString().split('T')[0],
    toDate: new Date().toISOString().split('T')[0],
    location: '',
    country: '',
    organizer: '',
    fromAge: undefined,
    toAge: undefined,
    youtubeLink: '',
    links: [],
    type: 'events',
    fields: [],
  })

  const [newLink, setNewLink] = useState('')
  const [newField, setNewField] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (field: keyof Event, value: string | number | string[] | EventStatus | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addLink = () => {
    if (newLink.trim() && !formData.links?.includes(newLink.trim())) {
      setFormData((prev) => ({ ...prev, links: [...(prev.links || []), newLink.trim()] }))
      setNewLink('')
    }
  }

  const removeLink = (linkToRemove: string) => {
    setFormData((prev) => ({ ...prev, links: prev.links?.filter((l) => l !== linkToRemove) || [] }))
  }

  const addField = () => {
    if (newField.trim() && !formData.fields?.includes(newField.trim())) {
      setFormData((prev) => ({ ...prev, fields: [...(prev.fields || []), newField.trim()] }))
      setNewField('')
    }
  }

  const removeField = (fieldToRemove: string) => {
    setFormData((prev) => ({ ...prev, fields: prev.fields?.filter((f) => f !== fieldToRemove) || [] }))
  }

  const resetForm = () => {
    setFormData({
      name: '', description: '',
      fromDate: new Date().toISOString().split('T')[0],
      toDate: new Date().toISOString().split('T')[0],
      location: '', country: '', organizer: '',
      fromAge: undefined, toAge: undefined,
      youtubeLink: '', links: [], type: 'events', fields: [],
    })
    setNewLink('')
    setNewField('')
    setError(null)
    setIsSuccess(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const user = auth.currentUser
      if (!user) {
        throw new Error('Please sign in to submit an event')
      }

      const now = new Date().toISOString()
      const payload = {
        name: formData.name || '',
        description: formData.description || '',
        from_date: formData.fromDate || '',
        to_date: formData.toDate || '',
        location: formData.location || '',
        country: formData.country || '',
        organizer: formData.organizer || '',
        from_age: formData.fromAge ?? null,
        to_age: formData.toAge ?? null,
        youtube_link: formData.youtubeLink || null,
        links: formData.links || [],
        type: formData.type || '',
        fields: formData.fields || [],
        status: 'pending_review',
        submitted_by: user.uid,
        submitted_by_email: user.email || undefined,
        created_at: now,
        updated_at: now,
      }

      await addDoc(collection(db, 'events'), payload)

      setIsSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <div className="flex flex-col items-center py-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <ThemedText variant="h3" className="mb-2">Event Submitted!</ThemedText>
            <ThemedText color="muted" className="mb-6 block">
              Your event has been submitted for review. You&apos;ll be notified once it&apos;s approved.
            </ThemedText>
            <Button onClick={handleClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-hide">
        <DialogHeader>
          <ThemedText variant="h3" as="h2">Submit an Event</ThemedText>
          <ThemedText variant="sm" color="muted">
            Fill in the event details below. Your submission will be reviewed before publishing.
          </ThemedText>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <ThemedText variant="sm" color="error" className="p-3 bg-red-50 dark:bg-red-900/20 rounded-none block">{error}</ThemedText>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <ThemedText variant="h5" as="h3">Basic Information</ThemedText>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 col-span-1 md:col-span-2">
                <Label htmlFor="name">Event Name *</Label>
                <Input id="name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="Enter event name" required />
              </div>
              <div className="space-y-2 col-span-1 md:col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} placeholder="Describe the event in detail..." rows={4} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Event Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Date & Location */}
          <div className="space-y-4">
            <ThemedText variant="h5" as="h3">Date & Location</ThemedText>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fromDate">Start Date *</Label>
                <Input id="fromDate" type="date" value={formData.fromDate} onChange={(e) => handleInputChange('fromDate', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="toDate">End Date *</Label>
                <Input id="toDate" type="date" value={formData.toDate} onChange={(e) => handleInputChange('toDate', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input id="location" value={formData.location} onChange={(e) => handleInputChange('location', e.target.value)} placeholder="e.g., Main Auditorium, Room 101" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input id="country" value={formData.country} onChange={(e) => handleInputChange('country', e.target.value)} placeholder="e.g., Switzerland, Germany" required />
              </div>
            </div>
          </div>

          {/* Organizer & Age Range */}
          <div className="space-y-4">
            <ThemedText variant="h5" as="h3">Organizer & Target Audience</ThemedText>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2 col-span-1 sm:col-span-2 md:col-span-3">
                <Label htmlFor="organizer">Organizer *</Label>
                <Input id="organizer" value={formData.organizer} onChange={(e) => handleInputChange('organizer', e.target.value)} placeholder="Organization or person name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fromAge">Minimum Age</Label>
                <Input id="fromAge" type="number" value={formData.fromAge || ''} onChange={(e) => handleInputChange('fromAge', e.target.value ? parseInt(e.target.value) : undefined)} placeholder="e.g., 18" min="0" max="100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="toAge">Maximum Age</Label>
                <Input id="toAge" type="number" value={formData.toAge || ''} onChange={(e) => handleInputChange('toAge', e.target.value ? parseInt(e.target.value) : undefined)} placeholder="e.g., 30" min="0" max="100" />
              </div>
            </div>
          </div>

          {/* Fields/Subjects */}
          <div className="space-y-4">
            <ThemedText variant="h5" as="h3">Fields/Subjects</ThemedText>
            <div className="space-y-2">
              <Label>Quick Add Fields</Label>
              <div className="flex flex-wrap gap-2">
                {commonFields.map((field) => (
                  <Button key={field} type="button" variant="outline" size="sm"
                    onClick={() => { if (!formData.fields?.includes(field)) setFormData((prev) => ({ ...prev, fields: [...(prev.fields || []), field] })) }}
                    disabled={formData.fields?.includes(field)}>
                    {field}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newField">Add Custom Field</Label>
              <div className="flex gap-2">
                <Input id="newField" value={newField} onChange={(e) => setNewField(e.target.value)} placeholder="Enter field name"
                  onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); addField() } }} />
                <Button type="button" onClick={addField} size="icon"><Plus className="h-4 w-4" /></Button>
              </div>
            </div>
            {formData.fields && formData.fields.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Fields</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.fields.map((field) => (
                    <Badge key={field} variant="secondary">
                      {field}
                      <button type="button" onClick={() => removeField(field)} className="ml-2 hover:text-red-600"><X className="h-3 w-3" /></button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Links & Media */}
          <div className="space-y-4">
            <ThemedText variant="h5" as="h3">Links & Media</ThemedText>
            <div className="space-y-2">
              <Label htmlFor="youtubeLink">YouTube Link</Label>
              <Input id="youtubeLink" type="url" value={formData.youtubeLink} onChange={(e) => handleInputChange('youtubeLink', e.target.value)} placeholder="https://youtube.com/watch?v=..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newLink">External Links</Label>
              <div className="flex gap-2">
                <Input id="newLink" type="url" value={newLink} onChange={(e) => setNewLink(e.target.value)} placeholder="https://example.com"
                  onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLink() } }} />
                <Button type="button" onClick={addLink} size="icon"><Plus className="h-4 w-4" /></Button>
              </div>
            </div>
            {formData.links && formData.links.length > 0 && (
              <div className="space-y-2">
                <Label>Added Links</Label>
                <div className="space-y-2">
                  {formData.links.map((link, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900 rounded-none border border-slate-100 dark:border-slate-800">
                      <a href={link} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-950 dark:text-slate-50 hover:underline truncate">{link}</a>
                      <button type="button" onClick={() => removeLink(link)} className="ml-2 text-red-600 dark:text-red-400"><X className="h-4 w-4" /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              <Send className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Submitting...' : 'Submit for Review'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
