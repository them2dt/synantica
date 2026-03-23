/**
 * Country flag utilities
 * Single source of truth: key, flag emoji, and display name per country.
 */

const COUNTRIES: Array<{ key: string; flag: string; display: string }> = [
  { key: 'afghanistan', flag: '🇦🇫', display: 'Afghanistan' },
  { key: 'albania', flag: '🇦🇱', display: 'Albania' },
  { key: 'algeria', flag: '🇩🇿', display: 'Algeria' },
  { key: 'argentina', flag: '🇦🇷', display: 'Argentina' },
  { key: 'armenia', flag: '🇦🇲', display: 'Armenia' },
  { key: 'australia', flag: '🇦🇺', display: 'Australia' },
  { key: 'austria', flag: '🇦🇹', display: 'Austria' },
  { key: 'azerbaijan', flag: '🇦🇿', display: 'Azerbaijan' },
  { key: 'bangladesh', flag: '🇧🇩', display: 'Bangladesh' },
  { key: 'belarus', flag: '🇧🇾', display: 'Belarus' },
  { key: 'belgium', flag: '🇧🇪', display: 'Belgium' },
  { key: 'brazil', flag: '🇧🇷', display: 'Brazil' },
  { key: 'bulgaria', flag: '🇧🇬', display: 'Bulgaria' },
  { key: 'cambodia', flag: '🇰🇭', display: 'Cambodia' },
  { key: 'canada', flag: '🇨🇦', display: 'Canada' },
  { key: 'chile', flag: '🇨🇱', display: 'Chile' },
  { key: 'china', flag: '🇨🇳', display: 'China' },
  { key: 'colombia', flag: '🇨🇴', display: 'Colombia' },
  { key: 'croatia', flag: '🇭🇷', display: 'Croatia' },
  { key: 'czech-republic', flag: '🇨🇿', display: 'Czech Republic' },
  { key: 'denmark', flag: '🇩🇰', display: 'Denmark' },
  { key: 'egypt', flag: '🇪🇬', display: 'Egypt' },
  { key: 'estonia', flag: '🇪🇪', display: 'Estonia' },
  { key: 'finland', flag: '🇫🇮', display: 'Finland' },
  { key: 'france', flag: '🇫🇷', display: 'France' },
  { key: 'georgia', flag: '🇬🇪', display: 'Georgia' },
  { key: 'germany', flag: '🇩🇪', display: 'Germany' },
  { key: 'ghana', flag: '🇬🇭', display: 'Ghana' },
  { key: 'greece', flag: '🇬🇷', display: 'Greece' },
  { key: 'hungary', flag: '🇭🇺', display: 'Hungary' },
  { key: 'iceland', flag: '🇮🇸', display: 'Iceland' },
  { key: 'india', flag: '🇮🇳', display: 'India' },
  { key: 'indonesia', flag: '🇮🇩', display: 'Indonesia' },
  { key: 'iran', flag: '🇮🇷', display: 'Iran' },
  { key: 'iraq', flag: '🇮🇶', display: 'Iraq' },
  { key: 'ireland', flag: '🇮🇪', display: 'Ireland' },
  { key: 'israel', flag: '🇮🇱', display: 'Israel' },
  { key: 'italy', flag: '🇮🇹', display: 'Italy' },
  { key: 'japan', flag: '🇯🇵', display: 'Japan' },
  { key: 'jordan', flag: '🇯🇴', display: 'Jordan' },
  { key: 'kazakhstan', flag: '🇰🇿', display: 'Kazakhstan' },
  { key: 'kenya', flag: '🇰🇪', display: 'Kenya' },
  { key: 'south-korea', flag: '🇰🇷', display: 'South Korea' },
  { key: 'kuwait', flag: '🇰🇼', display: 'Kuwait' },
  { key: 'latvia', flag: '🇱🇻', display: 'Latvia' },
  { key: 'lebanon', flag: '🇱🇧', display: 'Lebanon' },
  { key: 'lithuania', flag: '🇱🇹', display: 'Lithuania' },
  { key: 'luxembourg', flag: '🇱🇺', display: 'Luxembourg' },
  { key: 'malaysia', flag: '🇲🇾', display: 'Malaysia' },
  { key: 'mexico', flag: '🇲🇽', display: 'Mexico' },
  { key: 'moldova', flag: '🇲🇩', display: 'Moldova' },
  { key: 'mongolia', flag: '🇲🇳', display: 'Mongolia' },
  { key: 'morocco', flag: '🇲🇦', display: 'Morocco' },
  { key: 'myanmar', flag: '🇲🇲', display: 'Myanmar' },
  { key: 'nepal', flag: '🇳🇵', display: 'Nepal' },
  { key: 'netherlands', flag: '🇳🇱', display: 'Netherlands' },
  { key: 'new-zealand', flag: '🇳🇿', display: 'New Zealand' },
  { key: 'nigeria', flag: '🇳🇬', display: 'Nigeria' },
  { key: 'north-korea', flag: '🇰🇵', display: 'North Korea' },
  { key: 'norway', flag: '🇳🇴', display: 'Norway' },
  { key: 'pakistan', flag: '🇵🇰', display: 'Pakistan' },
  { key: 'peru', flag: '🇵🇪', display: 'Peru' },
  { key: 'philippines', flag: '🇵🇭', display: 'Philippines' },
  { key: 'poland', flag: '🇵🇱', display: 'Poland' },
  { key: 'portugal', flag: '🇵🇹', display: 'Portugal' },
  { key: 'qatar', flag: '🇶🇦', display: 'Qatar' },
  { key: 'romania', flag: '🇷🇴', display: 'Romania' },
  { key: 'russia', flag: '🇷🇺', display: 'Russia' },
  { key: 'saudi-arabia', flag: '🇸🇦', display: 'Saudi Arabia' },
  { key: 'singapore', flag: '🇸🇬', display: 'Singapore' },
  { key: 'slovakia', flag: '🇸🇰', display: 'Slovakia' },
  { key: 'slovenia', flag: '🇸🇮', display: 'Slovenia' },
  { key: 'south-africa', flag: '🇿🇦', display: 'South Africa' },
  { key: 'spain', flag: '🇪🇸', display: 'Spain' },
  { key: 'sri-lanka', flag: '🇱🇰', display: 'Sri Lanka' },
  { key: 'sudan', flag: '🇸🇩', display: 'Sudan' },
  { key: 'sweden', flag: '🇸🇪', display: 'Sweden' },
  { key: 'switzerland', flag: '🇨🇭', display: 'Switzerland' },
  { key: 'syria', flag: '🇸🇾', display: 'Syria' },
  { key: 'taiwan', flag: '🇹🇼', display: 'Taiwan' },
  { key: 'thailand', flag: '🇹🇭', display: 'Thailand' },
  { key: 'tunisia', flag: '🇹🇳', display: 'Tunisia' },
  { key: 'turkey', flag: '🇹🇷', display: 'Turkey' },
  { key: 'ukraine', flag: '🇺🇦', display: 'Ukraine' },
  { key: 'united-arab-emirates', flag: '🇦🇪', display: 'United Arab Emirates' },
  { key: 'united-kingdom', flag: '🇬🇧', display: 'United Kingdom' },
  { key: 'united-states', flag: '🇺🇸', display: 'United States' },
  { key: 'uzbekistan', flag: '🇺🇿', display: 'Uzbekistan' },
  { key: 'venezuela', flag: '🇻🇪', display: 'Venezuela' },
  { key: 'vietnam', flag: '🇻🇳', display: 'Vietnam' },
  { key: 'yemen', flag: '🇾🇪', display: 'Yemen' },
  { key: 'zimbabwe', flag: '🇿🇼', display: 'Zimbabwe' },
  { key: 'other', flag: '🌍', display: 'Other' },
]

function normalize(country: string): string {
  return country.toLowerCase().replace(/\s+/g, '-')
}

/**
 * Get flag emoji for a country
 */
export function getCountryFlag(country: string): string {
  return COUNTRIES.find(c => c.key === normalize(country))?.flag ?? '🌍'
}

/**
 * Get country display name
 */
export function getCountryDisplayName(country: string): string {
  return COUNTRIES.find(c => c.key === normalize(country))?.display ?? country
}

/**
 * Get all countries for filter dropdown
 * Returns array of { value, label, flag } objects
 */
export function getAllCountries() {
  return COUNTRIES
    .filter(c => c.key !== 'other')
    .map(c => ({ value: c.key, label: c.display, flag: c.flag }))
    .sort((a, b) => a.label.localeCompare(b.label))
}
