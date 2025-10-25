"use client";

import { getProviders, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";

const Providers = () => {
  const [providers, setProviders] = useState(null);
  useEffect(() => {
    const fetchProviders = async () => {
      const providers = await getProviders();
      setProviders(providers);
    };
    fetchProviders();
  }, []);
  return (
    <div>
      {providers && (
        <div className="flex gap-4">
          {Object.values(providers)
            .filter((provider) => provider.id !== "credentials")
            .map((provider) => (
              <button
                key={provider.name}
                onClick={() => signIn(provider.id)}
                className="flex items-center text-white bg-gray-700 hover:bg-gray-900 hover:text-white rounded-md px-3 py-2 my-3 "
              >
                {provider.id == "google" ? (
                  <FaGoogle className="text-white mr-2" />
                ) : provider.id == "github" ? (
                  <FaGithub className="text-white mr-2" />
                ) : null}{" "}
                {provider.name}
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

export default Providers;
