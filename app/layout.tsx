import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gmail',
  description: 'Gmail application',
  icons: {
    icon: '/images/image.png',
  },
  viewport: 'width=device-width, initial-scale=1',
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