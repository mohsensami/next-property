import BookmarkButton from "@/components/BookmarkButton";
import PropertyContactForm from "@/components/PropertyContactForm";
import PropertyDetails from "@/components/PropertyDetails";
import PropertyHeaderImage from "@/components/PropertyHeaderImage";
import PropertyImages from "@/components/PropertyImages";
import ShareButtons from "@/components/ShareButtons";
import connectDB from "@/config/database";
import Property from "@/models/Property";
import { convertToSerializeableObject } from "@/utils/convertToObject";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

const PropertyPage = async ({ params }) => {
  await connectDB();
  const propertyDoc = await Property.findById(params.id).lean();
  const property = convertToSerializeableObject(propertyDoc);

  if (!property) {
    return (
      <h1 className="text-center text-2xl font-bold mt-10">
        Property Not Found
      </h1>
    );
  }
  return (
    <>
      <PropertyHeaderImage image={property.images[0]} />
      <section>
        <div className="container m-auto py-6 px-6">
          <Link
            href="/properties"
            className="text-blue-500 hover:text-blue-600 flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Back to Properties
          </Link>
        </div>
      </section>
      <section className="bg-rose-50">
        <div className="container m-auto py-10 px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 w-full gap-6">
            <div className="col-span-8">
              <PropertyDetails property={property} />
            </div>
            <div className="col-span-4">
              {/* <!-- Sidebar --> */}
              <aside className="space-y-4  h-screen sticky top-12 ">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <BookmarkButton property={property} />
                  <ShareButtons property={property} />

                  <PropertyContactForm property={property} />
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container m-auto py-4 px-6">
          <PropertyImages images={property.images} />
        </div>
      </section>
    </>
  );
};

export default PropertyPage;
