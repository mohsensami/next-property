"use server";

async function addProperty(formData) {
  console.log("Add Property:", formData.get("name"));
}

export default addProperty;
