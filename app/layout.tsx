import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PuneJal | PMC Water Management & SCADA Command Center',
  description:
    'Enterprise Municipal Water Management and SCADA Decision-Support Platform for Pune Municipal Corporation. Real-time telemetry, ward equity optimization, and AI-driven hydraulic analytics.',
  keywords: ['water management', 'SCADA', 'Pune', 'PMC', 'telemetry', 'hydraulics'],
  authors: [{ name: 'Pune Municipal Corporation' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body style={{ height: '100vh', overflow: 'hidden', background: '#0B0F19' }} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
