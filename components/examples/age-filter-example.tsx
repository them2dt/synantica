"use client"

import { useState } from "react"
import { AgeFilterDropdown, CompactAgeFilterDropdown } from "@/components/ui/age-filter-dropdown"

/**
 * Example component showing how to use the age filter dropdowns
 * This demonstrates both the full and compact versions
 */
export function AgeFilterExample() {
  const [fullAgeRange, setFullAgeRange] = useState<[number, number]>([18, 65])
  const [compactAgeRange, setCompactAgeRange] = useState<[number, number]>([21, 30])

  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Age Filter Dropdown Examples</h2>
        
        {/* Full Version Example */}
        <div className="space-y-4">
          <h3 className="text-md font-medium">Full Version (for forms/modals)</h3>
          <div className="w-80">
            <AgeFilterDropdown
              value={fullAgeRange}
              onChange={setFullAgeRange}
              min={0}
              max={99}
              placeholder="Select Age Range"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Selected: {fullAgeRange[0]} - {fullAgeRange[1]} years
          </p>
        </div>

        {/* Compact Version Example */}
        <div className="space-y-4">
          <h3 className="text-md font-medium">Compact Version (for filter bars)</h3>
          <div className="flex items-center gap-4">
            <CompactAgeFilterDropdown
              value={compactAgeRange}
              onChange={setCompactAgeRange}
              min={0}
              max={99}
              placeholder="Age"
            />
            <span className="text-sm text-muted-foreground">
              Selected: {compactAgeRange[0]} - {compactAgeRange[1]} years
            </span>
          </div>
        </div>

        {/* Multiple Compact Filters Example */}
        <div className="space-y-4">
          <h3 className="text-md font-medium">Multiple Filters (like in dashboard)</h3>
          <div className="flex items-center gap-3">
            <CompactAgeFilterDropdown
              value={compactAgeRange}
              onChange={setCompactAgeRange}
              min={0}
              max={99}
              placeholder="Age"
            />
            <select className="px-3 py-2 border rounded-md text-sm">
              <option>All Regions</option>
              <option>Zurich</option>
              <option>Bern</option>
            </select>
            <select className="px-3 py-2 border rounded-md text-sm">
              <option>All Fields</option>
              <option>Computer Science</option>
              <option>Business</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
