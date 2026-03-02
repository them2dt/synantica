import { Trophy, Calendar, Users, BookOpen } from 'lucide-react'
import { CategoryWithIcon } from '@/types/category'

interface CategoryDB {
    id: string
    name: string
    is_active: boolean
}

/**
 * Maps database event types to categories with associated icons
 */
export function mapEventTypesToCategories(dbCategories: CategoryDB[] | undefined): CategoryWithIcon[] {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
        'olympiads': Trophy,
        'contests': Calendar,
        'events': Users,
        'workshops': BookOpen
    }

    const categories: CategoryWithIcon[] = [
        { value: 'all', label: 'All Events', icon: Calendar }
    ]

    if (dbCategories) {
        dbCategories.forEach(eventType => {
            const slug = eventType.name.toLowerCase().replace(/\s+/g, '-')
            categories.push({
                value: slug,
                label: eventType.name,
                icon: iconMap[slug] || Calendar
            })
        })
    }

    return categories
}
