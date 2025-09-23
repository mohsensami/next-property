import "@/assets/styles/globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "PropertyPulse",
  description: "Find The Perfect Rental Property",
  keywords: "rental, property, real estate",
};
const MainLayout = ({ children }) => {
  return (
    <html>
      <body>
        <Navbar />
        <main className="">{children}</main>
        <Footer />
      </body>
    </html>
  );
};

export default MainLayout;
