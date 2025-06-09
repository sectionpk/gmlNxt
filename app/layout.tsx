import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Gmail',
  description: 'Gmail application',
  icons: {
    icon: '/images/image.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}