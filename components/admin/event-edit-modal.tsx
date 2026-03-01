'use client'

import { useState, useEffect } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X, Plus, Save } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface EventEditModalProps {
  event: Event | null
  isOpen: boolean
  onClose: () => void
  onSave: (id: string, data: Partial<Event>) => Promise<void>
  mode: 'edit' | 'create'
}

export function EventEditModal({
  event,
  isOpen,
  onClose,
  onSave,
  mode,
}: EventEditModalProps) {
  const [formData, setFormData] = useState<Partial<Event>>({
    name: '',
    description: '',
    fromDate: '',
    toDate: '',
    location: '',
    country: '',
    organizer: '',
    fromAge: undefined,
    toAge: undefined,
    youtubeLink: '',
    links: [],
    type: 'events',
    fields: [],
    status: EventStatus.DRAFT,
  })

  const [newLink, setNewLink] = useState('')
  const [newField, setNewField] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Event types
  const eventTypes = [
    { value: 'olympiads', label: 'Olympiads' },
    { value: 'contests', label: 'Contests' },
    { value: 'events', label: 'Events' },
    { value: 'workshops', label: 'Workshops' },
  ]

  // Common fields/subjects
  const commonFields = [
    'computer-science',
    'business',
    'engineering',
    'design',
    'marketing',
    'data-science',
    'artificial-intelligence',
    'cybersecurity',
    'web-development',
    'blockchain',
    'startup',
    'entrepreneurship',
    'leadership',
    'communication',
    'physics',
    'mathematics',
    'biology',
    'chemistry',
    'other',
  ]

  // Load event data when modal opens
  useEffect(() => {
    if (event && mode === 'edit') {
      setFormData({
        name: event.name,
        description: event.description,
        fromDate: event.fromDate,
        toDate: event.toDate,
        location: event.location,
        country: event.country,
        organizer: event.organizer,
        fromAge: event.fromAge,
        toAge: event.toAge,
        youtubeLink: event.youtubeLink || '',
        links: event.links || [],
        type: event.type,
        fields: event.fields || [],
        status: event.status,
      })
    } else if (mode === 'create') {
      // Reset form for new event
      setFormData({
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
        status: EventStatus.DRAFT,
      })
    }
  }, [event, mode, isOpen])

  const handleInputChange = (field: keyof Event, value: string | number | string[] | EventStatus | undefined) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const addLink = () => {
    if (newLink.trim() && !formData.links?.includes(newLink.trim())) {
      setFormData((prev) => ({
        ...prev,
        links: [...(prev.links || []), newLink.trim()],
      }))
      setNewLink('')
    }
  }

  const removeLink = (linkToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links?.filter((link) => link !== linkToRemove) || [],
    }))
  }

  const addField = () => {
    if (newField.trim() && !formData.fields?.includes(newField.trim())) {
      setFormData((prev) => ({
        ...prev,
        fields: [...(prev.fields || []), newField.trim()],
      }))
      setNewField('')
    }
  }

  const removeField = (fieldToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields?.filter((field) => field !== fieldToRemove) || [],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const id = mode === 'edit' && event ? event.id : 'new'
      await onSave(id, formData)
      onClose()
    } catch (error) {
      console.error('Error saving event:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Edit Event' : 'Create New Event'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'edit'
              ? 'Update the event details below'
              : 'Fill in the event details to create a new event'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg">Basic Information</h3>

            <div className="grid grid-cols-1 grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="name">Event Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter event name"
                  required
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange('description', e.target.value)
                  }
                  placeholder="Describe the event in detail..."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Event Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleInputChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    handleInputChange('status', value as EventStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Date & Location */}
          <div className="space-y-4">
            <h3 className="text-lg">Date & Location</h3>

            <div className="grid grid-cols-1 grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fromDate">Start Date *</Label>
                <Input
                  id="fromDate"
                  type="date"
                  value={formData.fromDate}
                  onChange={(e) =>
                    handleInputChange('fromDate', e.target.value)
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="toDate">End Date *</Label>
                <Input
                  id="toDate"
                  type="date"
                  value={formData.toDate}
                  onChange={(e) => handleInputChange('toDate', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange('location', e.target.value)
                  }
                  placeholder="e.g., Main Auditorium, Room 101"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) =>
                    handleInputChange('country', e.target.value)
                  }
                  placeholder="e.g., Switzerland, Germany"
                  required
                />
              </div>
            </div>
          </div>

          {/* Organizer & Age Range */}
          <div className="space-y-4">
            <h3 className="text-lg">Organizer & Target Audience</h3>

            <div className="grid grid-cols-1 grid-cols-3 gap-4">
              <div className="space-y-2 col-span-3">
                <Label htmlFor="organizer">Organizer *</Label>
                <Input
                  id="organizer"
                  value={formData.organizer}
                  onChange={(e) =>
                    handleInputChange('organizer', e.target.value)
                  }
                  placeholder="Organization or person name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fromAge">Minimum Age</Label>
                <Input
                  id="fromAge"
                  type="number"
                  value={formData.fromAge || ''}
                  onChange={(e) =>
                    handleInputChange(
                      'fromAge',
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  placeholder="e.g., 18"
                  min="0"
                  max="100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="toAge">Maximum Age</Label>
                <Input
                  id="toAge"
                  type="number"
                  value={formData.toAge || ''}
                  onChange={(e) =>
                    handleInputChange(
                      'toAge',
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  placeholder="e.g., 30"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>

          {/* Fields/Subjects */}
          <div className="space-y-4">
            <h3 className="text-lg">Fields/Subjects</h3>

            <div className="space-y-2">
              <Label>Quick Add Fields</Label>
              <div className="flex flex-wrap gap-2">
                {commonFields.map((field) => (
                  <Button
                    key={field}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (!formData.fields?.includes(field)) {
                        setFormData((prev) => ({
                          ...prev,
                          fields: [...(prev.fields || []), field],
                        }))
                      }
                    }}
                    disabled={formData.fields?.includes(field)}
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
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addField()
                    }
                  }}
                />
                <Button type="button" onClick={addField} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {formData.fields && formData.fields.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Fields</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.fields.map((field) => (
                    <Badge key={field} variant="secondary">
                      {field}
                      <button
                        type="button"
                        onClick={() => removeField(field)}
                        className="ml-2 hover:text-error-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Links & Media */}
          <div className="space-y-4">
            <h3 className="text-lg">Links & Media</h3>

            <div className="space-y-2">
              <Label htmlFor="youtubeLink">YouTube Link</Label>
              <Input
                id="youtubeLink"
                type="url"
                value={formData.youtubeLink}
                onChange={(e) =>
                  handleInputChange('youtubeLink', e.target.value)
                }
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newLink">External Links</Label>
              <div className="flex gap-2">
                <Input
                  id="newLink"
                  type="url"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  placeholder="https://example.com"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addLink()
                    }
                  }}
                />
                <Button type="button" onClick={addLink} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {formData.links && formData.links.length > 0 && (
              <div className="space-y-2">
                <Label>Added Links</Label>
                <div className="space-y-2">
                  {formData.links.map((link, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-muted rounded-none"
                    >
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-slate-950 hover:underline truncate"
                      >
                        {link}
                      </a>
                      <button
                        type="button"
                        onClick={() => removeLink(link)}
                        className="ml-2 text-error-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Saving...' : mode === 'edit' ? 'Update Event' : 'Create Event'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
