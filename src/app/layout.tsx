import type { Metadata } from "next";
import "@/src/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { Flowbite, ThemeModeScript } from "flowbite-react";
import theme from "@/src/lib/flowbite-theme";
import { ToastContainer } from "react-toastify";
import { Instrument_Sans } from "next/font/google";
import ReduxProvider from "./provider";

export const metadata: Metadata = {
  title: "Skyfire Dashboard",
  description: "",
};

const instrument = Instrument_Sans({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin-ext"],
  variable: "--font-instrument",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  return (
    <html lang="en" className="bg-html">
      <head>
        <ThemeModeScript />
      </head>
      <body className={`${instrument.variable} bg-body font-instrument`}>
        <Flowbite theme={{ theme }}>
          <ReduxProvider>
            {children}
            <ToastContainer position="bottom-right" autoClose={6000} />
          </ReduxProvider>
        </Flowbite>
      </body>
    </html>
  );
}
