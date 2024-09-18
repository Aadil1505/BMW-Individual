import type { Metadata } from "next";
import { Roboto_Mono } from 'next/font/google'
import "./globals.css";

const inter = Roboto_Mono({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "BMW Individual",
  description: "Visualize BMW individual colors on available models",
  openGraph: {
    title: "BMW Individual",
    description: "Visualize BMW individual colors on available models",
    url: 'https://bmw-individual.vercel.app/',
    siteName: 'BMW Individual',
    images: [
      {
        url: 'https://renderings.evecp.bmw.cloud/trunks/1997ae31c1be030b904cae14a4dfc9b2c24db7d8a8ddb68ec4fe180c/G82_de_MTown_day_cam_01.jpg?d=1920x1080', // Must be an absolute URL
        width: 800,
        height: 600,
      },
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className={"antialiased h-screen"}>
          {children}
      </body>
    </html>
  );
}
