// @ts-ignore: import side-effect CSS file
import "./globals.css";
import ConditionalLayoutParts from "./../components/ConditionalLayoutParts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="antialiased bg-black min-h-screen flex flex-col">
        <ConditionalLayoutParts>
          {children}
        </ConditionalLayoutParts>
      </body>
    </html>
  );
}