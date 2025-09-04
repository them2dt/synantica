import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

/**
 * Dynamic Open Graph image generation API route
 * Generates social preview images for different pages and content types
 */
export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract parameters from URL
    const title = searchParams.get('title') || 'Synantica';
    const description = searchParams.get('description') || 'Find Your Next Career Event';
    const type = searchParams.get('type') || 'default';
    const eventDate = searchParams.get('eventDate');
    const location = searchParams.get('location');
    const category = searchParams.get('category');

    // Generate different layouts based on type
    if (type === 'event') {
      return new ImageResponse(
        (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#0f172a',
              backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {/* Header with logo area */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '40px',
              }}
            >
              <div
                style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: '#3b82f6',
                  letterSpacing: '-0.02em',
                }}
              >
                Synantica
              </div>
            </div>

            {/* Event card */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#1e293b',
                borderRadius: '16px',
                padding: '40px',
                maxWidth: '800px',
                border: '1px solid #334155',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              }}
            >
              {/* Category badge */}
              {category && (
                <div
                  style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '20px',
                  }}
                >
                  {category}
                </div>
              )}

              {/* Event title */}
              <div
                style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: 'white',
                  textAlign: 'center',
                  marginBottom: '20px',
                  lineHeight: '1.2',
                }}
              >
                {title}
              </div>

              {/* Event description */}
              <div
                style={{
                  fontSize: '20px',
                  color: '#cbd5e1',
                  textAlign: 'center',
                  marginBottom: '30px',
                  lineHeight: '1.4',
                }}
              >
                {description}
              </div>

              {/* Event details */}
              <div
                style={{
                  display: 'flex',
                  gap: '30px',
                  alignItems: 'center',
                }}
              >
                {eventDate && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      color: '#94a3b8',
                      fontSize: '18px',
                    }}
                  >
                    📅 {eventDate}
                  </div>
                )}
                {location && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      color: '#94a3b8',
                      fontSize: '18px',
                    }}
                  >
                    📍 {location}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                position: 'absolute',
                bottom: '30px',
                right: '30px',
                color: '#64748b',
                fontSize: '16px',
              }}
            >
              synantica.com
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    }

    // Default layout for general pages
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f172a',
            backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {/* Main content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '900px',
              textAlign: 'center',
            }}
          >
            {/* Logo/Brand */}
            <div
              style={{
                fontSize: '64px',
                fontWeight: 'bold',
                color: '#3b82f6',
                letterSpacing: '-0.02em',
                marginBottom: '30px',
              }}
            >
              Synantica
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '20px',
                lineHeight: '1.1',
              }}
            >
              {title}
            </div>

            {/* Description */}
            <div
              style={{
                fontSize: '24px',
                color: '#cbd5e1',
                lineHeight: '1.4',
                marginBottom: '40px',
              }}
            >
              {description}
            </div>

            {/* Feature highlights */}
            <div
              style={{
                display: 'flex',
                gap: '40px',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#94a3b8',
                  fontSize: '18px',
                }}
              >
                🎯 Career Events
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#94a3b8',
                  fontSize: '18px',
                }}
              >
                🤝 Networking
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#94a3b8',
                  fontSize: '18px',
                }}
              >
                🚀 Growth
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: '30px',
              right: '30px',
              color: '#64748b',
              fontSize: '16px',
            }}
          >
            synantica.com
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
