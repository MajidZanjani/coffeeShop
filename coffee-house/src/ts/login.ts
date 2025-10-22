export async function login(user: {}) {
  try {
    const response = await fetch(
      "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Login failed: ", errorData);
      // throw new Error(`Error ${response.status}: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    const registeredUser = data.data.user;
    console.log("Login successful: ", registeredUser);
    return registeredUser;
  } catch (error) {
    console.log("Login failed. Server error: ", error);
    return null;
  }
}
