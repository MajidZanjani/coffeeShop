// import { Loader } from "./loader";
import { registerUser } from "./registerUser";

export function registerFormInit(): void {
  interface StreetsMap {
    [city: string]: string[];
  }

  interface User {
    login: string;
    password: string;
    confirmPassword: string;
    city: string;
    street: string;
    houseNumber: number;
    paymentMethod: string;
  }

  const streetsByCity: StreetsMap = {
    City1: [
      "Street1",
      "Street2",
      "Street3",
      "Street4",
      "Street5",
      "Street6",
      "Street7",
      "Street8",
      "Street9",
      "Street10",
    ],
    City2: [
      "Street11",
      "Street12",
      "Street13",
      "Street14",
      "Street15",
      "Street16",
      "Street17",
      "Street18",
      "Street19",
      "Street20",
    ],
    City3: [
      "Street21",
      "Street22",
      "Street23",
      "Street24",
      "Street25",
      "Street26",
      "Street27",
      "Street28",
      "Street29",
      "Street30",
    ],
  };
  // const loader = new Loader(".loader", false);

  const form = document.getElementById("registration-form") as HTMLFormElement;

  const loginInput = document.getElementById("user") as HTMLInputElement;
  loginInput.addEventListener("blur", validateLogin);

  const passwordInput = document.getElementById("password") as HTMLInputElement;
  passwordInput.addEventListener("blur", validatePassword);

  const confirmPasswordInput = document.getElementById(
    "confirm-password"
  ) as HTMLInputElement;
  confirmPasswordInput.addEventListener("blur", validateConfirmPassword);

  const citySelect = document.getElementById("city") as HTMLSelectElement;
  citySelect.addEventListener("blur", validateCity);

  const streetSelect = document.getElementById("street") as HTMLSelectElement;
  HTMLSelectElement;
  streetSelect.addEventListener("blur", validateStreet);

  const houseInput = document.getElementById("house") as HTMLInputElement;
  houseInput.addEventListener("blur", validateHouse);

  const registerBtn = document.querySelector(".register-btn");

  const registerErrorEl = document.querySelector(
    ".register-error"
  ) as HTMLElement;

  clearErrorOnFocus(loginInput);
  clearErrorOnFocus(passwordInput);
  clearErrorOnFocus(confirmPasswordInput);
  clearErrorOnFocus(citySelect);
  clearErrorOnFocus(streetSelect);
  clearErrorOnFocus(houseInput);

  // Update streets dynamically based on city
  citySelect.addEventListener("change", () => {
    const selectedCity = citySelect.value;
    streetSelect.innerHTML = '<option value="">Select Street</option>';
    if (selectedCity && streetsByCity[selectedCity]) {
      streetsByCity[selectedCity].forEach((street) => {
        const option = document.createElement("option");
        option.value = street;
        option.textContent = street;
        streetSelect.appendChild(option);
      });
    }
  });

  // Helper: show or clear error
  function setError(element: HTMLElement, message: string): void {
    const errorEl = document.getElementById(`${element.id}-error`);
    if (errorEl) errorEl.innerText = message;
    if (message) {
      element.classList.add("error");
      errorEl?.classList.remove("hide");
    } else {
      element.classList.remove("error");
      errorEl?.classList.add("hide");
    }
  }

  function checkBtn() {
    const isValid =
      validateLogin() &&
      validatePassword() &&
      validateConfirmPassword() &&
      validateCity() &&
      validateStreet() &&
      validateHouse();

    if (isValid) {
      registerBtn?.classList.remove("disabled-btn");
      (registerBtn as HTMLButtonElement).disabled = false;
    } else {
      registerBtn?.classList.add("disabled-btn");
      (registerBtn as HTMLButtonElement).disabled = true;
    }
  }

  // Helper: clear on focus
  function clearErrorOnFocus(element: HTMLElement): void {
    if (!element) return;
    element.addEventListener("focus", () => {
      setError(element, "");
      registerErrorEl.style.display = "none";
    });
  }

  [
    loginInput,
    passwordInput,
    confirmPasswordInput,
    citySelect,
    streetSelect,
    houseInput,
  ].forEach((el) => {
    el.addEventListener("input", checkBtn);
    el.addEventListener("change", checkBtn);
  });

  // --- Field validation ---
  function validateLogin(): boolean {
    const value = loginInput.value.trim();
    const pattern = /^[A-Za-z][A-Za-z]{2,}$/;
    if (!pattern.test(value)) {
      setError(
        loginInput,
        "Login must start with a letter, at least 3 characters, only English letters."
      );
      return false;
    }
    setError(loginInput, "");
    return true;
  }

  function validatePassword(): boolean {
    const value = passwordInput.value.trim();
    const pattern = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
    if (!pattern.test(value)) {
      setError(
        passwordInput,
        "Password must be at least 6 characters and include a special character."
      );
      return false;
    }
    setError(passwordInput, "");
    return true;
  }

  function validateConfirmPassword(): boolean {
    if (passwordInput.value !== confirmPasswordInput.value) {
      setError(confirmPasswordInput, "Passwords do not match.");
      return false;
    }
    setError(confirmPasswordInput, "");
    return true;
  }

  function validateCity(): boolean {
    if (!citySelect.value) {
      setError(citySelect, "Please select a city.");
      return false;
    }
    setError(citySelect, "");
    return true;
  }

  function validateStreet(): boolean {
    if (!streetSelect.value) {
      setError(streetSelect, "Please select a street.");
      return false;
    }
    setError(streetSelect, "");
    return true;
  }

  function validateHouse(): boolean {
    const value = Number(houseInput.value);
    if (isNaN(value) || value <= 1) {
      setError(houseInput, "House number must be greater than 1.");
      return false;
    }
    setError(houseInput, "");
    return true;
  }

  // Form validation
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const isValid =
      validateLogin() &&
      validatePassword() &&
      validateConfirmPassword() &&
      validateCity() &&
      validateStreet() &&
      validateHouse();

    if (!isValid) {
      alert("Please correct the highlighted errors.");
      return;
    }

    const selectedPayment = (
      document.querySelector(
        'input[name="payment"]:checked'
      ) as HTMLInputElement
    )?.value;

    const user: User = {
      login: loginInput.value,
      password: passwordInput.value,
      confirmPassword: confirmPasswordInput.value,
      city: citySelect.value,
      street: streetSelect.value,
      houseNumber: Number(houseInput.value),
      paymentMethod: selectedPayment,
    };

    registerUser(user).then((result) => {
      if (result.success) {
        console.log("User registered:", result.data);
        registerErrorEl.innerHTML = `✅ Registration successful! Redirecting to login page...`;
        registerErrorEl.style.display = "flex";
        registerErrorEl.style.color = "green";
        form.reset();
        streetSelect.innerHTML = '<option value="">Select Street</option>';
        setTimeout(() => {
          window.location.href = "signIn.html";
        }, 3000);
      } else {
        console.log("Error happened:", result.error);
        registerErrorEl.innerHTML = `⚠️ Registration failed: ${result.error}`;
        registerErrorEl.style.display = "flex";
      }
    });
  });
}
