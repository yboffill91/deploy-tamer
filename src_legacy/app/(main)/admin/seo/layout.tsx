import type { Metadata } from "next";
import { Header } from "./_components/Header";

export const metadata: Metadata = {
  title: "Keyword Research Tool",
  description: "Enterprise-grade keyword research automation powered by advanced AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
