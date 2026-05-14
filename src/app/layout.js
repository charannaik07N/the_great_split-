import "./globals.css";

export const metadata = {
  title: "Cine-Stream | The Great Split",
  description: "Premium, editorial movie discovery for cinema buffs.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
