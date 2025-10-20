export function renderLogin() {
  document.querySelectorAll("input").forEach((input) => {
    input.setAttribute("autocomplete", "off");
  });
}
