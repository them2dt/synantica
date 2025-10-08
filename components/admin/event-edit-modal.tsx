'use client'

import { useState, useEffect } from 'react'
import { Event, EventStatus } from '@/types/event'
import { EVENT_TYPES, EVENT_SUBJECTS } from '@/types/category'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { X, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface EventEditModalProps {
  event: Event | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (eventData: Partial<Event>) => Promise<void>
}

export function EventEditModal({ event, open, onOpenChange, onSave }: EventEditModalProps) {
  const [formData, setFormData] = useState<Partial<Event>>({})
  const [selectedFields, setSelectedFields] = useState<string[]>([])
  const [links, setLinks] = useState<string[]>([])
  const [newLink, setNewLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Initialize form data when event changes
  useEffect(() => {
    if (event) {
      setFormData(event)
      setSelectedFields(event.fields || [])
      setLinks(event.links || [])
    } else {
      // Reset for new event
      setFormData({
        name: '',
        description: '',
        type: 'events',
        status: EventStatus.DRAFT,
        fromDate: new Date().toISOString().split('T')[0],
        toDate: new Date().toISOString().split('T')[0],
        location: '',
        country: '',
        organizer: '',
        fromAge: undefined,
        toAge: undefined,
        youtubeLink: '',
        links: [],
        fields: [],
      })
      setSelectedFields([])
      setLinks([])
    }
    setErrors({})
  }, [event, open])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required'
    }
    if (!formData.fromDate) {
      newErrors.fromDate = 'Start date is required'
    }
    if (!formData.toDate) {
      newErrors.toDate = 'End date is required'
    }
    if (formData.fromDate && formData.toDate && formData.fromDate > formData.toDate) {
      newErrors.toDate = 'End date must be after start date'
    }
    if (!formData.location?.trim()) {
      newErrors.location = 'Location is required'
    }
    if (!formData.country?.trim()) {
      newErrors.country = 'Country is required'
    }
    if (!formData.organizer?.trim()) {
      newErrors.organizer = 'Organizer is required'
    }
    if (formData.fromAge && formData.toAge && formData.fromAge > formData.toAge) {
      newErrors.toAge = 'Max age must be greater than min age'
    }
    if (formData.youtubeLink && !isValidUrl(formData.youtubeLink)) {
      newErrors.youtubeLink = 'Invalid YouTube URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      await onSave({
        ...formData,
        fields: selectedFields,
        links: links.filter(link => link.trim()),
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving event:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddLink = () => {
    if (newLink.trim() && isValidUrl(newLink.trim())) {
      setLinks([...links, newLink.trim()])
      setNewLink('')
    }
  }

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index))
  }

  const toggleField = (field: string) => {
    if (selectedFields.includes(field)) {
      setSelectedFields(selectedFields.filter(f => f !== field))
    } else {
      setSelectedFields([...selectedFields, field])
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{event ? 'Edit Event' : 'Create New Event'}</DialogTitle>
          <DialogDescription>
            {event ? 'Update event details and save changes.' : 'Fill in the event details below.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Event Name *</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div className="col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
              </div>

              <div>
                <Label htmlFor="type">Event Type *</Label>
                <Select
                  value={formData.type || 'events'}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status || EventStatus.DRAFT}
                  onValueChange={(value) => setFormData({ ...formData, status: value as EventStatus })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={EventStatus.DRAFT}>Draft</SelectItem>
                    <SelectItem value={EventStatus.PUBLISHED}>Published</SelectItem>
                    <SelectItem value={EventStatus.CANCELLED}>Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Date & Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Date & Location</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fromDate">Start Date *</Label>
                <Input
                  id="fromDate"
                  type="date"
                  value={formData.fromDate || ''}
                  onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                  className={errors.fromDate ? 'border-red-500' : ''}
                />
                {errors.fromDate && <p className="text-sm text-red-500 mt-1">{errors.fromDate}</p>}
              </div>

              <div>
                <Label htmlFor="toDate">End Date *</Label>
                <Input
                  id="toDate"
                  type="date"
                  value={formData.toDate || ''}
                  onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                  className={errors.toDate ? 'border-red-500' : ''}
                />
                {errors.toDate && <p className="text-sm text-red-500 mt-1">{errors.toDate}</p>}
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className={errors.location ? 'border-red-500' : ''}
                />
                {errors.location && <p className="text-sm text-red-500 mt-1">{errors.location}</p>}
              </div>

              <div>
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={formData.country || ''}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className={errors.country ? 'border-red-500' : ''}
                />
                {errors.country && <p className="text-sm text-red-500 mt-1">{errors.country}</p>}
              </div>

              <div className="col-span-2">
                <Label htmlFor="organizer">Organizer *</Label>
                <Input
                  id="organizer"
                  value={formData.organizer || ''}
                  onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                  className={errors.organizer ? 'border-red-500' : ''}
                />
                {errors.organizer && <p className="text-sm text-red-500 mt-1">{errors.organizer}</p>}
              </div>
            </div>
          </div>

          {/* Age Range */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Age Range (Optional)</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fromAge">Minimum Age</Label>
                <Input
                  id="fromAge"
                  type="number"
                  min="0"
                  max="99"
                  value={formData.fromAge || ''}
                  onChange={(e) => setFormData({ ...formData, fromAge: e.target.value ? parseInt(e.target.value) : undefined })}
                />
              </div>

              <div>
                <Label htmlFor="toAge">Maximum Age</Label>
                <Input
                  id="toAge"
                  type="number"
                  min="0"
                  max="99"
                  value={formData.toAge || ''}
                  onChange={(e) => setFormData({ ...formData, toAge: e.target.value ? parseInt(e.target.value) : undefined })}
                  className={errors.toAge ? 'border-red-500' : ''}
                />
                {errors.toAge && <p className="text-sm text-red-500 mt-1">{errors.toAge}</p>}
              </div>
            </div>
          </div>

          {/* Fields/Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Categories/Fields</h3>
            <div className="flex flex-wrap gap-2">
              {EVENT_SUBJECTS.map((field) => (
                <Badge
                  key={field}
                  variant={selectedFields.includes(field) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleField(field)}
                >
                  {field.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </Badge>
              ))}
            </div>
          </div>

          {/* Media & Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Media & Links</h3>
            
            <div>
              <Label htmlFor="youtubeLink">YouTube Link</Label>
              <Input
                id="youtubeLink"
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                value={formData.youtubeLink || ''}
                onChange={(e) => setFormData({ ...formData, youtubeLink: e.target.value })}
                className={errors.youtubeLink ? 'border-red-500' : ''}
              />
              {errors.youtubeLink && <p className="text-sm text-red-500 mt-1">{errors.youtubeLink}</p>}
            </div>

            <div>
              <Label>Additional Links</Label>
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLink())}
                />
                <Button type="button" size="sm" onClick={handleAddLink}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="mt-2 space-y-1">
                {links.map((link, index) => (
                  <div key={index} className="flex items-center gap-2 bg-muted p-2 rounded">
                    <span className="text-sm flex-1 truncate">{link}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveLink(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Event'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
