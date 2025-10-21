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

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // Return the error message from server if available, or fallback to status
      const errorMessage =
        data.message || `Error ${response.status}: ${response.statusText}`;
      console.error("Registration failed: ", errorMessage);
      return { success: false, error: errorMessage };
    }

    console.log("Registration successful: ", data);
    return { success: true, data };
  } catch (error: any) {
    console.error("Registration failed. Server error: ", error);
    return { success: false, error: error?.message || "Unknown server error" };
  }
}
