import "./globals.css";
import { AuthProvider } from './contexts/AuthContext';

export const metadata = {
  title: "PropMatch - Real Estate Intelligence",
  description: "Advanced property analysis and lead ranking platform",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning={true}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
