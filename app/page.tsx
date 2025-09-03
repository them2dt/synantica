"use client"

import { useState } from "react"
import Image from "next/image"
import { AuthGuard, UserMenu } from "@/components/features/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  Filter,
  FileText,
  Download,
} from "lucide-react"
import { useEvents } from "@/lib/hooks"
import { MOCK_EVENTS, EVENT_CATEGORIES } from "@/lib/constants"



function StudentEventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<typeof MOCK_EVENTS[0] | null>(null)
  const {
    events,
    filteredEvents,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    clearFilters,
    getTotalAttendees,
    getThisWeekEvents,
    categories,
  } = useEvents()



  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
                                    <div>
                          <h1 className="text-2xl font-header-bold text-primary">{"Campus Events"}</h1>
                          <p className="text-muted-foreground font-content">{"Discover amazing events happening on campus"}</p>
                        </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="hidden sm:flex">
                <Users className="w-3 h-3 mr-1" />
                {getTotalAttendees()} students attending
              </Badge>
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-mono flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium font-mono mb-2 block">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => {
                        const Icon = category.icon
                        return (
                          <SelectItem key={category.value} value={category.value}>
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              {category.label}
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-mono">{"Quick Stats"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-mono">Total Events</span>
                  <span className="font-semibold font-mono">{events.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-mono">This Week</span>
                  <span className="font-semibold font-mono">{getThisWeekEvents()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-mono">Total Attendees</span>
                  <span className="font-semibold font-mono">{getTotalAttendees()}</span>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="mb-6">
              <h2 className="text-xl font-semibold font-mono mb-2">
                {selectedCategory === "all"
                  ? "All Events"
                  : categories.find((c) => c.value === selectedCategory)?.label}
              </h2>
              <p className="text-muted-foreground font-mono">
                {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {/* Events Grid */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative overflow-hidden">
                    <Image
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                    <Badge
                      className="absolute top-3 left-3 capitalize"
                      variant={event.category === "hackathon" ? "default" : "secondary"}
                    >
                      {event.category}
                    </Badge>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-lg text-balance">{event.title}</CardTitle>
                    <CardDescription className="text-pretty">{event.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {formatDate(event.date)}
                      <Clock className="w-4 h-4 ml-2" />
                      {event.time}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {event.attendees}/{event.maxAttendees} attending
                      </span>
                      <div className="flex-1 bg-muted rounded-full h-2 ml-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {event.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full" size="sm" onClick={() => setSelectedEvent(event)}>
                          Learn More
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-xl">{event.title}</DialogTitle>
                          <DialogDescription className="text-base">
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(event.date)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {event.time}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {event.location}
                              </div>
                            </div>
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6">
                          {/* Event Image */}
                          <div className="aspect-video relative overflow-hidden rounded-lg">
                            <Image
                              src={event.image || "/placeholder.svg"}
                              alt={event.title}
                              fill
                              className="object-cover"
                            />
                          </div>

                          {/* Full Description */}
                          <div>
                            <h3 className="font-semibold mb-2">About This Event</h3>
                            <p className="text-muted-foreground leading-relaxed">{event.fullDescription}</p>
                          </div>

                          {/* Event Details */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-1">Attendance</h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Users className="w-4 h-4" />
                                {event.attendees}/{event.maxAttendees} registered
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-1">Category</h4>
                              <Badge variant="secondary" className="capitalize">
                                {event.category}
                              </Badge>
                            </div>
                          </div>

                          {/* Tags */}
                          <div>
                            <h4 className="font-medium mb-2">Tags</h4>
                            <div className="flex flex-wrap gap-1">
                              {event.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Files Section */}
                          {event.files && event.files.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-3 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Event Materials
                              </h4>
                              <div className="space-y-2">
                                {event.files.map((file, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                                        <FileText className="w-4 h-4 text-red-600" />
                                      </div>
                                      <div>
                                        <p className="font-medium text-sm">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">{file.type}</p>
                                      </div>
                                    </div>
                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                      <Download className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex gap-3 pt-4 border-t">
                            <Button className="flex-1">RSVP Now</Button>
                            <Button variant="outline" className="flex-1 bg-transparent">
                              Add to Calendar
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No events found</p>
                  <p>Try adjusting your search or filter criteria</p>
                </div>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

/**
 * Main page component with authentication protection
 * Wraps the student events page with authentication guard
 */
export default function Page() {
  return (
    <AuthGuard>
      <StudentEventsPage />
    </AuthGuard>
  )
}
