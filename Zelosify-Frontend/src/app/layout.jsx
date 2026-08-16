import "@/styles/globals.css";
import AllProvider from "@/redux/core/AllProvider";
import { AuthProvider } from "@/contexts/AuthContext";

// Metadata (App Router style)
export const metadata = {
  title: "Zelosify",
  description: "Zelosify",
  icons: {
    icon: "/favicon1.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>
        <AuthProvider>
          <AllProvider>{children}</AllProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
