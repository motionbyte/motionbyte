/** [`public/services.png`](../../../public/services.png) — update width/height if you change dimensions */
export const SERVICES_WORDMARK_PNG = {
  url: '/services.png',
  width: 1024,
  height: 240,
  /** File is often JPEG-with-.png; sampling uses luminance, not only alpha */
  treatAsOpaqueBitmap: true,
} as const
