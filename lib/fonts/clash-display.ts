import localFont from 'next/font/local'

/**
 * Clash Display font family configuration
 * Loads all Clash Display font weights and styles for headers
 */
export const clashDisplay = localFont({
  src: [
    {
      path: '../../styles/fonts/Clash-Display/ClashDisplay-Extralight.otf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../styles/fonts/Clash-Display/ClashDisplay-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../styles/fonts/Clash-Display/ClashDisplay-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../styles/fonts/Clash-Display/ClashDisplay-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../styles/fonts/Clash-Display/ClashDisplay-Semibold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../styles/fonts/Clash-Display/ClashDisplay-Bold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-clash-display',
  display: 'swap',
})
