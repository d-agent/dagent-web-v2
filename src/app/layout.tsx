import type { Metadata } from "next";
import { Inter, Roboto_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WalletProvider } from "@/contexts/WalletContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const robotoMono = Roboto_Mono({ subsets: ["latin"], variable: "--font-roboto-mono" });
const pressStart2P = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--font-pixel" });

export const metadata: Metadata = {
    title: "Dagent | Decentralized AI Layer",
    description: "The decentralized layer for autonomous AI agents on Cardano.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${robotoMono.variable} ${pressStart2P.variable} font-sans bg-background text-gray-100 selection:bg-primary/30 selection:text-white flex flex-col min-h-screen`}>
                <WalletProvider>
                    <Header />
                    <main className="flex-1 flex flex-col w-full relative">
                        {children}
                    </main>
                    <Footer />
                </WalletProvider>
            </body>
        </html>
    );
}
