"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
// import { toast } from "react-toastify";
import deleteProperty from "@/app/actions/deleteProperty";
import Swal from "sweetalert2";

const ProfileProperties = ({ properties: initialProperties }) => {
  const [properties, setProperties] = useState(initialProperties);

  const handleDeleteProperty = async (propertyId) => {
    // const confirmed = window.confirm(
    //   "Are you sure you want to delete this property?",
    // );

    Swal.fire({
      title: "Are you sure you want to delete this property?",
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to delete this property?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const deletePropertyById = deleteProperty.bind(null, propertyId);
        await deletePropertyById();
        const updatedProperties = properties.filter(
          (property) => property._id !== propertyId,
        );
        setProperties(updatedProperties);
        Swal.fire({
          title: "Deleted!",
          text: "Property Deleted.",
          icon: "success",
        });
      }
    });
    // if (!confirmed) return;
  };

  return properties.map((property) => (
    <div key={property._id} className="mb-10">
      <Link href={`/properties/${property._id}`}>
        <Image
          className="h-32 w-full rounded-md object-cover"
          src={property.images[0]}
          alt=""
          width={500}
          height={100}
          priority={true}
        />
      </Link>
      <div className="mt-2">
        <p className="text-lg font-semibold">{property.name}</p>
        <p className="text-gray-600">
          Address: {property.location.street} {property.location.city}{" "}
          {property.location.state}
        </p>
      </div>
      <div className="mt-2">
        <Link
          href={`/properties/${property._id}/edit`}
          className="bg-rose-500 text-white px-3 py-3 rounded-md mr-2 hover:bg-rose-600"
        >
          Edit
        </Link>
        <button
          onClick={() => handleDeleteProperty(property._id)}
          className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
          type="button"
        >
          Delete
        </button>
      </div>
    </div>
  ));
};

export default ProfileProperties;
