import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mission Control',
  description: 'Kanban mission control for projects, agents, and execution',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
