// @ts-ignore: import side-effect CSS file
import "./globals.css";
import Navbar from "./../components/Navbar";
import Footer from "./../components/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="antialiased bg-black min-h-screen flex flex-col">
      <Navbar/>
        <div className="flex-grow">{children}</div>
        <Footer />
      </body>
    </html>
  );
}