import "./globals.css";
import NextAuthProvider from "./provider/SessionProvider";


export const metadata = {
  title: "FamilyVerse",
  description: "A secure family app with Google authentication",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
