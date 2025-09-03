import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  Filter,
  Code,
  Coffee,
  Gamepad2,
  Briefcase,
  GraduationCap,
  Heart,
  FileText,
  Download,
} from 'lucide-react'
import type { Event, Category } from '@/lib/types'

/**
 * Mock event data for the application
 * In a real app, this would come from a database
 */
export const MOCK_EVENTS: Event[] = [
  {
    id: 1,
    title: "HackTech 2024",
    description: "Join us for 48 hours of coding, innovation, and prizes! Build the next big thing.",
    fullDescription:
      "HackTech 2024 is our biggest hackathon yet! Over 48 hours, you'll work in teams to create innovative solutions to real-world problems. We'll provide mentorship, workshops, and all the caffeine you need. Prizes include $5000 for first place, internship opportunities, and exclusive swag.",
    date: "2024-03-15",
    time: "18:00",
    location: "Computer Science Building",
    category: "hackathon",
    attendees: 150,
    maxAttendees: 200,
    image: "/hackathon-coding-laptops-students.jpg",
    tags: ["Tech", "Coding", "Innovation"],
    files: [
      { name: "Event Rules & Guidelines", type: "PDF", url: "#" },
      { name: "Sponsor Information", type: "PDF", url: "#" },
      { name: "Workshop Schedule", type: "PDF", url: "#" },
    ],
  },
  {
    id: 2,
    title: "Coffee & Code Meetup",
    description: "Casual networking event for CS students. Bring your projects and meet fellow developers!",
    fullDescription:
      "A relaxed atmosphere where computer science students can network, share projects, and collaborate. Whether you're a beginner or experienced developer, this is the perfect place to make connections and learn from peers. Free coffee and snacks provided!",
    date: "2024-03-08",
    time: "15:00",
    location: "Student Union Café",
    category: "social",
    attendees: 45,
    maxAttendees: 60,
    image: "/coffee-meeting-students-laptops-casual.jpg",
    tags: ["Networking", "Casual", "Coffee"],
    files: [
      { name: "Networking Tips", type: "PDF", url: "#" },
      { name: "Project Showcase Guidelines", type: "PDF", url: "#" },
    ],
  },
  {
    id: 3,
    title: "Game Dev Workshop",
    description: "Learn Unity basics and create your first 2D game in this hands-on workshop.",
    fullDescription:
      "This comprehensive workshop will take you from Unity beginner to creating your first playable 2D game. We'll cover game objects, scripting basics, physics, and publishing. All skill levels welcome - laptops will be provided if needed.",
    date: "2024-03-12",
    time: "14:00",
    location: "Media Lab Room 101",
    category: "workshop",
    attendees: 28,
    maxAttendees: 30,
    image: "/game-development-unity-workshop-students.jpg",
    tags: ["Gaming", "Unity", "Workshop"],
    files: [
      { name: "Unity Installation Guide", type: "PDF", url: "#" },
      { name: "Workshop Materials", type: "PDF", url: "#" },
      { name: "Game Assets Pack", type: "PDF", url: "#" },
    ],
  },
  {
    id: 4,
    title: "Startup Pitch Night",
    description: "Present your startup ideas to local entrepreneurs and investors. Win funding!",
    fullDescription:
      "Pitch your startup idea to a panel of successful entrepreneurs and angel investors. Winners receive seed funding, mentorship opportunities, and access to our startup incubator program. Open to all students with innovative business ideas.",
    date: "2024-03-20",
    time: "19:00",
    location: "Business School Auditorium",
    category: "competition",
    attendees: 85,
    maxAttendees: 120,
    image: "/startup-pitch-presentation-business-students.jpg",
    tags: ["Startup", "Pitch", "Business"],
    files: [
      { name: "Pitch Deck Template", type: "PDF", url: "#" },
      { name: "Judging Criteria", type: "PDF", url: "#" },
      { name: "Business Plan Guide", type: "PDF", url: "#" },
    ],
  },
  {
    id: 5,
    title: "Study Group: Algorithms",
    description: "Weekly study session for Data Structures & Algorithms. All levels welcome!",
    fullDescription:
      "Join fellow students for collaborative learning in our weekly algorithms study group. We cover everything from basic data structures to advanced algorithmic concepts. Perfect preparation for technical interviews and coursework.",
    date: "2024-03-10",
    time: "16:00",
    location: "Library Study Room 3B",
    category: "study",
    attendees: 12,
    maxAttendees: 15,
    image: "/study-group-algorithms-books-students-library.jpg",
    tags: ["Study", "Algorithms", "Academic"],
    files: [
      { name: "Algorithm Cheat Sheet", type: "PDF", url: "#" },
      { name: "Practice Problems", type: "PDF", url: "#" },
    ],
  },
  {
    id: 6,
    title: "Mental Health & Wellness Fair",
    description: "Resources, activities, and support for student mental health and wellbeing.",
    fullDescription:
      "A comprehensive wellness event featuring mental health resources, stress management workshops, mindfulness sessions, and support group information. Free health screenings, therapy dog visits, and wellness goodie bags for all attendees.",
    date: "2024-03-18",
    time: "11:00",
    location: "Campus Quad",
    category: "wellness",
    attendees: 200,
    maxAttendees: 300,
    image: "/wellness-fair-mental-health-students-outdoor.jpg",
    tags: ["Wellness", "Mental Health", "Support"],
    files: [
      { name: "Mental Health Resources", type: "PDF", url: "#" },
      { name: "Stress Management Guide", type: "PDF", url: "#" },
      { name: "Campus Support Services", type: "PDF", url: "#" },
    ],
  },
]

/**
 * Event categories with icons
 */
export const EVENT_CATEGORIES: Category[] = [
  { value: "all", label: "All Events", icon: Calendar },
  { value: "hackathon", label: "Hackathons", icon: Code },
  { value: "social", label: "Social Events", icon: Coffee },
  { value: "workshop", label: "Workshops", icon: Gamepad2 },
  { value: "competition", label: "Competitions", icon: Briefcase },
  { value: "study", label: "Study Groups", icon: GraduationCap },
  { value: "wellness", label: "Wellness", icon: Heart },
]
