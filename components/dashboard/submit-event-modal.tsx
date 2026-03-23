'use client'

import { useState, useEffect } from 'react'
import { Event, EventStatus } from '@/types/event'
import {
  Dialog,
  DialogContent,
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
import { X, Plus, Send, CheckCircle, Pencil } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { auth, db } from '@/lib/firebase/client'
import { addDoc, updateDoc, doc, collection } from 'firebase/firestore'

interface SubmitEventModalProps {
  isOpen: boolean
  onClose: () => void
  editEvent?: Event | null
}

const eventTypes = [
  { value: 'olympiads', label: 'Olympiads' },
  { value: 'contests', label: 'Contests' },
  { value: 'events', label: 'Events' },
  { value: 'workshops', label: 'Workshops' },
]

const commonFields = [
  'computer-science', 'mathematics', 'physics', 'biology', 'chemistry',
  'engineering', 'data-science', 'artificial-intelligence', 'cybersecurity',
  'web-development', 'business', 'entrepreneurship', 'design', 'marketing',
  'blockchain', 'leadership', 'communication', 'other',
]

function blankForm(): Partial<Event> {
  return {
    name: '', description: '',
    fromDate: new Date().toISOString().split('T')[0],
    toDate: new Date().toISOString().split('T')[0],
    location: '', country: '', organizer: '',
    fromAge: undefined, toAge: undefined,
    youtubeLink: '', links: [], type: 'events', fields: [],
  }
}

export function SubmitEventModal({ isOpen, onClose, editEvent }: SubmitEventModalProps) {
  const isEditMode = Boolean(editEvent)

  const [formData, setFormData] = useState<Partial<Event>>(blankForm())
  const [newLink, setNewLink] = useState('')
  const [newField, setNewField] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // Populate form when editing
  useEffect(() => {
    if (editEvent) {
      setFormData({
        name: editEvent.name,
        description: editEvent.description,
        fromDate: editEvent.fromDate,
        toDate: editEvent.toDate,
        location: editEvent.location,
        country: editEvent.country,
        organizer: editEvent.organizer,
        fromAge: editEvent.fromAge,
        toAge: editEvent.toAge,
        youtubeLink: editEvent.youtubeLink || '',
        links: editEvent.links || [],
        type: editEvent.type,
        fields: editEvent.fields || [],
      })
    } else {
      setFormData(blankForm())
    }
    setFieldErrors({})
    setError(null)
    setIsSuccess(false)
  }, [editEvent, isOpen])

  const handleInputChange = (field: keyof Event, value: string | number | string[] | EventStatus | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const addLink = () => {
    const trimmed = newLink.trim()
    if (!trimmed) return
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      setFieldErrors((prev) => ({ ...prev, newLink: 'URL must start with https://' }))
      return
    }
    if (!formData.links?.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, links: [...(prev.links || []), trimmed] }))
    }
    setNewLink('')
    setFieldErrors((prev) => ({ ...prev, newLink: '' }))
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

  const validate = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.name?.trim()) errors.name = 'Event name is required'
    if (!formData.description?.trim()) errors.description = 'Description is required'
    if (!formData.type) errors.type = 'Event type is required'
    if (!formData.fromDate) errors.fromDate = 'Start date is required'
    if (!formData.toDate) errors.toDate = 'End date is required'
    if (formData.fromDate && formData.toDate && formData.toDate < formData.fromDate) {
      errors.toDate = 'End date must be on or after start date'
    }
    if (!formData.location?.trim()) errors.location = 'Location is required'
    if (!formData.country?.trim()) errors.country = 'Country is required'
    if (!formData.organizer?.trim()) errors.organizer = 'Organizer is required'

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const resetForm = () => {
    setFormData(blankForm())
    setNewLink('')
    setNewField('')
    setError(null)
    setIsSuccess(false)
    setFieldErrors({})
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    setError(null)

    try {
      const user = auth.currentUser
      if (!user) throw new Error('Please sign in to submit an event')

      const now = new Date().toISOString()

      if (isEditMode && editEvent) {
        // Update existing event
        await updateDoc(doc(db, 'events', editEvent.id), {
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
          updated_at: now,
        })
      } else {
        // Create new event
        await addDoc(collection(db, 'events'), {
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
          status: 'published',
          submitted_by: user.uid,
          submitted_by_email: user.email || undefined,
          created_at: now,
          updated_at: now,
        })
      }

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
            <CheckCircle className="h-16 w-16 text-emerald-500 mb-4" />
            <DialogTitle className="text-2xl font-heading mb-2">
              {isEditMode ? 'Event Updated!' : 'Event Published!'}
            </DialogTitle>
            <ThemedText color="muted" className="mb-6 block">
              {isEditMode
                ? 'Your changes have been saved.'
                : 'Your event is now live and visible to the community.'}
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
          <DialogTitle className="text-3xl font-heading flex items-center gap-2">
            {isEditMode && <Pencil className="w-5 h-5" />}
            {isEditMode ? 'Edit Event' : 'Submit an Event'}
          </DialogTitle>
          <ThemedText variant="sm" color="muted">
            {isEditMode
              ? 'Update the event details below.'
              : 'Fill in the event details below. Your event will be published immediately.'}
          </ThemedText>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <ThemedText variant="sm" color="error" className="p-3 bg-red-50 dark:bg-red-900/20 block">{error}</ThemedText>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <ThemedText variant="h5" as="h3">Basic Information</ThemedText>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 col-span-1 md:col-span-2">
                <Label htmlFor="name">Event Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter event name"
                  className={fieldErrors.name ? 'border-red-500' : ''}
                />
                {fieldErrors.name && <p className="text-xs text-red-500">{fieldErrors.name}</p>}
              </div>
              <div className="space-y-2 col-span-1 md:col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the event in detail..."
                  rows={4}
                  className={fieldErrors.description ? 'border-red-500' : ''}
                />
                {fieldErrors.description && <p className="text-xs text-red-500">{fieldErrors.description}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Event Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger className={fieldErrors.type ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldErrors.type && <p className="text-xs text-red-500">{fieldErrors.type}</p>}
              </div>
            </div>
          </div>

          {/* Date & Location */}
          <div className="space-y-4">
            <ThemedText variant="h5" as="h3">Date & Location</ThemedText>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fromDate">Start Date *</Label>
                <Input
                  id="fromDate"
                  type="date"
                  value={formData.fromDate}
                  onChange={(e) => handleInputChange('fromDate', e.target.value)}
                  className={fieldErrors.fromDate ? 'border-red-500' : ''}
                />
                {fieldErrors.fromDate && <p className="text-xs text-red-500">{fieldErrors.fromDate}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="toDate">End Date *</Label>
                <Input
                  id="toDate"
                  type="date"
                  value={formData.toDate}
                  min={formData.fromDate}
                  onChange={(e) => handleInputChange('toDate', e.target.value)}
                  className={fieldErrors.toDate ? 'border-red-500' : ''}
                />
                {fieldErrors.toDate && <p className="text-xs text-red-500">{fieldErrors.toDate}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., Main Auditorium, Room 101"
                  className={fieldErrors.location ? 'border-red-500' : ''}
                />
                {fieldErrors.location && <p className="text-xs text-red-500">{fieldErrors.location}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="e.g., Switzerland, Germany"
                  className={fieldErrors.country ? 'border-red-500' : ''}
                />
                {fieldErrors.country && <p className="text-xs text-red-500">{fieldErrors.country}</p>}
              </div>
            </div>
          </div>

          {/* Organizer & Age */}
          <div className="space-y-4">
            <ThemedText variant="h5" as="h3">Organizer & Target Audience</ThemedText>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2 col-span-1 sm:col-span-2 md:col-span-3">
                <Label htmlFor="organizer">Organizer *</Label>
                <Input
                  id="organizer"
                  value={formData.organizer}
                  onChange={(e) => handleInputChange('organizer', e.target.value)}
                  placeholder="Organization or person name"
                  className={fieldErrors.organizer ? 'border-red-500' : ''}
                />
                {fieldErrors.organizer && <p className="text-xs text-red-500">{fieldErrors.organizer}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="fromAge">Minimum Age</Label>
                <Input
                  id="fromAge"
                  type="number"
                  value={formData.fromAge || ''}
                  onChange={(e) => handleInputChange('fromAge', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="e.g., 14"
                  min="0" max="100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="toAge">Maximum Age</Label>
                <Input
                  id="toAge"
                  type="number"
                  value={formData.toAge || ''}
                  onChange={(e) => handleInputChange('toAge', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="e.g., 18"
                  min="0" max="100"
                />
              </div>
            </div>
          </div>

          {/* Fields/Subjects */}
          <div className="space-y-4">
            <ThemedText variant="h5" as="h3">Fields / Subjects</ThemedText>
            <div className="space-y-2">
              <Label>Quick Add</Label>
              <div className="flex flex-wrap gap-2">
                {commonFields.map((field) => (
                  <Button
                    key={field}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (!formData.fields?.includes(field)) {
                        setFormData((prev) => ({ ...prev, fields: [...(prev.fields || []), field] }))
                      }
                    }}
                    disabled={formData.fields?.includes(field)}
                    className="text-xs"
                  >
                    {field}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newField">Add Custom Field</Label>
              <div className="flex gap-2">
                <Input
                  id="newField"
                  value={newField}
                  onChange={(e) => setNewField(e.target.value)}
                  placeholder="Enter field name"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addField() } }}
                />
                <Button type="button" onClick={addField} size="icon"><Plus className="h-4 w-4" /></Button>
              </div>
            </div>
            {formData.fields && formData.fields.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.fields.map((field) => (
                  <Badge key={field} variant="secondary">
                    {field}
                    <button type="button" onClick={() => removeField(field)} className="ml-2 hover:text-red-600">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Links & Media */}
          <div className="space-y-4">
            <ThemedText variant="h5" as="h3">Links & Media</ThemedText>
            <div className="space-y-2">
              <Label htmlFor="youtubeLink">YouTube Link</Label>
              <Input
                id="youtubeLink"
                type="url"
                value={formData.youtubeLink}
                onChange={(e) => handleInputChange('youtubeLink', e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newLink">External Links</Label>
              <div className="flex gap-2">
                <Input
                  id="newLink"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  placeholder="https://example.com"
                  className={fieldErrors.newLink ? 'border-red-500' : ''}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLink() } }}
                />
                <Button type="button" onClick={addLink} size="icon"><Plus className="h-4 w-4" /></Button>
              </div>
              {fieldErrors.newLink && <p className="text-xs text-red-500">{fieldErrors.newLink}</p>}
            </div>
            {formData.links && formData.links.length > 0 && (
              <div className="space-y-2">
                {formData.links.map((link, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <a href={link} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-950 dark:text-slate-50 hover:underline truncate">{link}</a>
                    <button type="button" onClick={() => removeLink(link)} className="ml-2 text-red-600 dark:text-red-400 shrink-0">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              <Send className="mr-2 h-4 w-4" />
              {isSubmitting ? (isEditMode ? 'Saving...' : 'Publishing...') : (isEditMode ? 'Save Changes' : 'Publish Event')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
