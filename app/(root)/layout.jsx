import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const RootLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="md:grid md:grid-cols-12 min-h-screen">
        <div className="col-span-12">{children}</div>
      </div>
      <Footer />
    </>
  );
};
export default RootLayout;
