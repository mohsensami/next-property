import AuthProvider from "@/components/AuthProvider";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "PropertyPulse",
  description: "Find The Perfect Rental Property",
  keywords: "rental, property, real estate",
};
const MainLayout = ({ children }) => {
  return (
    <AuthProvider>
      <html>
        <body>
          <Navbar />
          <main className="">{children}</main>
          <Footer />
          <ToastContainer />
        </body>
      </html>
    </AuthProvider>
  );
};

export default MainLayout;
