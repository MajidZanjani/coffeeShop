import { login } from "./login";

export function loginFormInit(): void {
  const loginBtn = document.querySelector(".login-btn");
  const userNameEl = document.querySelector(".user-name") as HTMLInputElement;
  const passwordEl = document.querySelector(".password") as HTMLInputElement;
  const loginErrorEl = document.querySelector(".login-error") as HTMLElement;
  if (!userNameEl || !passwordEl || !loginErrorEl) return;

  loginErrorEl.style.display = "none";

  clearErrorOnFocus(userNameEl);
  clearErrorOnFocus(passwordEl);

  loginBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    const userName = userNameEl.value.trim();
    const password = passwordEl.value.trim();
    const user = {
      login: userName,
      password: password,
    };
    const loggedInUser = await login(user);
    if (loggedInUser) {
      console.log("User stored: ", loggedInUser);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      window.location.href = "menu.html";
    } else {
      loginErrorEl.style.display = "flex";
      console.log("login failed.");
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
      loginErrorEl.style.display = "none";
    }
  }

  function checkBtn() {
    const isValid = validateUserName() && validatePassword();

    if (isValid) {
      loginBtn?.classList.remove("disabled-btn");
      (loginBtn as HTMLButtonElement).disabled = false;
    } else {
      loginBtn?.classList.add("disabled-btn");
      (loginBtn as HTMLButtonElement).disabled = true;
    }
  }

  // Helper: clear on focus
  function clearErrorOnFocus(element: HTMLElement): void {
    element.addEventListener("focus", () => setError(element, ""));
  }

  [userNameEl, passwordEl].forEach((el) => {
    el.addEventListener("input", checkBtn);
    el.addEventListener("change", checkBtn);
  });

  function validateUserName() {
    const value = userNameEl.value.trim();
    const pattern = /^[A-Za-z][A-Za-z]{2,}$/;
    if (!pattern.test(value)) {
      setError(
        userNameEl,
        "Login must start with a letter, at least 3 characters, only English letters."
      );
      return false;
    }
    setError(userNameEl, "");
    return true;
  }

  function validatePassword() {
    const value = passwordEl.value.trim();
    const pattern = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
    if (!pattern.test(value)) {
      setError(
        passwordEl,
        "Password must be at least 6 characters and include a special character."
      );
      return false;
    }
    setError(passwordEl, "");
    return true;
  }

  userNameEl.addEventListener("blur", validateUserName);
  passwordEl.addEventListener("blur", validatePassword);
}
