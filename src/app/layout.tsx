import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ConvexClientProvider from "./ConvexClientProvider";
import Image from "next/image";

import "overlayscrollbars/overlayscrollbars.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="tw-flex tw-flex-col tw-min-h-screen tw-bg-gray-900 tw-text-gray-100">
          <header className="tw-p-4 tw-bg-gray-800">
            <div className="tw-flex tw-justify-left tw-items-center">
              <Image src="/newnewlogo.jpg" alt="logo" width={70} height={70} />
              <a href="/" className="tw-text-2xl tw-font-semibold">
                AtlasAI
              </a>
              <a href="/stats" className="tw-text-xl tw-ml-8">
                Stats
              </a>
            </div>
          </header>
          <main className="tw-flex-grow tw-p-4">
            <ConvexClientProvider>{children}</ConvexClientProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
