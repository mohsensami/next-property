import connectDB from "@/config/database";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();

    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return new Response("Missing fields", { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response("User already exists", { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: name,
      email,
      password: hashedPassword,
    });

    return Response.json(
      { message: "Account created", userId: user._id },
      { status: 201 },
    );
  } catch (err) {
    console.log("Register Error:", err);
    return new Response("Internal Error", { status: 500 });
  }
}
