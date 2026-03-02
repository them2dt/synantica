/**
 * Extracts the video ID from a YouTube URL
 * Supports standard watch URLs, shortened youtu.be URLs, and embed URLs
 */
export function getYouTubeVideoId(url: string): string | null {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
    return match ? match[1] : null
}
