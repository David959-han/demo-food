import "./globals.css";
import { LanguageProvider } from "../context/LanguageContext";
import Layout from "../components/layout/Layout";

export const metadata = {
  title: "FoodERP Demo",
  description: "Restaurant ERP Demo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <Layout>
            {children}
          </Layout>
        </LanguageProvider>
      </body>
    </html>
  );
}
