interface User {
  login: string;
  password: string;
  confirmPassword: string;
  city: string;
  street: string;
  houseNumber: number;
  paymentMethod: string;
}

export async function registerUser(user: User) {
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
      let fetchResult = "";
      if (response.status === 409)
        fetchResult = "Duplicated Username. Please choose another one.";
      if (response.status === 400)
        fetchResult = "Bad request. Please try again.";
      return { success: false, error: fetchResult };
    }

    console.log("Registration successful: ", data);
    return { success: true, data };
  } catch (error) {
    console.error("Registration failed. Server error: ", error);
    return { success: false, error: "server error" };
  }
}
