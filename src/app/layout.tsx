import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gestión del gimnasio",
  description: "Gestión de planes y miembros del gimnasio.",
  icons: { icon: "/gym-192.png", apple: "/gym-192.png" },
};

export const viewport: Viewport = { themeColor: "#050505", viewportFit: "cover" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="es"><body><div className="phone-shell">{children}</div></body></html>;
}
