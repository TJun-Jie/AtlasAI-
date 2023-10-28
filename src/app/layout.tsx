import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ConvexClientProvider from "./ConvexClientProvider";

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
            <div className="tw-flex tw-justify-between tw-items-center">
              <h1 className="tw-text-2xl tw-font-semibold">My App</h1>
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
