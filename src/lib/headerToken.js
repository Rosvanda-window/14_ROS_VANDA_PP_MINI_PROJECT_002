"use server";
import { auth } from "../auth";

export default async function headerToken() {
  const session = await auth();

  const token = session?.accessToken || session?.user?.token || session?.user?.payload?.token;

  const header = {
    "Accept": "application/json",
    "Content-Type": "application/json",
  };

  if (token) {
    header["Authorization"] = `Bearer ${token}`;
  } else {
    console.warn("No token found in session! Session:", session);
  }

  return header;
}