export async function registerUser(user: {}) {
  try {
    const response = await fetch(
      "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/auth/register",
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
      console.error("Registration failed: ", errorData);
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Registration successful: ", data);
    return data;
  } catch (error) {
    console.log("Registration failed. Server error: ", error);
    return null;
  }
}
