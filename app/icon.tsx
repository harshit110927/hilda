// app/icon.tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          background: '#2563EB', // Blue Shield Color
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '4px 4px 16px 16px', // Shield shape
          fontWeight: 'bold',
        }}
      >
        H
      </div>
    ),
    { ...size }
  )
}