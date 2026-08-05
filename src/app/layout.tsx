import type { Metadata } from 'next';
import { Inter, DM_Sans } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' });

export const metadata: Metadata = {
  title: 'VotingForMe | Secure Online Voting Platform',
  description: 'Create and manage secure online elections in under 5 minutes.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSans.variable} antialiased`}>
      <body className="min-h-screen flex flex-col bg-background text-content">
        {children}
      </body>
    </html>
  );
}
