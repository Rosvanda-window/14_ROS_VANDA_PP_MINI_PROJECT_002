export async function loginService(req) {
  const user = {
    email: req.email,
    password: req.password,
  };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auths/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (!res.ok) {
      console.error("Login failed with status:", res.status);
      return null; 
    }

    const loggedUser = await res.json();

    if (loggedUser && (loggedUser.error === "unauthorized" || loggedUser.message === "Wrong password")) {
      return null;
    }

    return loggedUser;
  } catch (error) {
    console.log("Connection error", error);
    return null;
  }
}

//register
export async function registerService(registerData) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auths/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerData),
    });

    const data = await res.json();

    // if (!res.ok) {
    //   throw new Error(data.message || "Registration failed");
    // }

    return data;
  } catch (error) {
    console.error("Register Service Error:", error);
    throw error;
  }
}