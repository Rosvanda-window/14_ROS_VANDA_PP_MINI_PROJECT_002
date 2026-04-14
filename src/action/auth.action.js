"use server";

import { signIn } from "../auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function loginAction(data) {
  console.log("data in action: ", data);
  const { email, password } = data;
  console.log("this is email :", email);
  try {
    const res = await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
    if (res && res.error) {
      throw new Error("Error");
    }
    console.log("res from server :", res);
    return res;
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
  }
}


//regis
"use server";

import { registerService } from "../service/auth.service";
import { redirect } from "next/navigation";

export async function registerAction(data) {
  try {
    const res = await registerService(data);
    if (res) {
      return { success: true };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}