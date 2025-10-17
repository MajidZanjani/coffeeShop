export class Loader {
  private container: HTMLElement;
  private overlay: HTMLElement;
  private style: HTMLStyleElement;

  constructor(containerSelector: string) {
    const container = document.querySelector<HTMLElement>(containerSelector);
    if (!container)
      throw new Error(`Container "${containerSelector}" not found`);
    this.container = container;

    // Ensure container can position child absolutely
    const computedStyle = getComputedStyle(this.container);
    if (computedStyle.position === "static") {
      this.container.style.position = "relative";
    }

    // Create overlay element
    this.overlay = document.createElement("div");
    this.overlay.classList.add("custom-loader-overlay");
    this.overlay.innerHTML = `
      <div class="custom-loader">
        <p>Loading your favorite coffee...</p>
        <img src="./src/img/coffee-cup.png" alt="coffee-cup">
      </div>
    `;

    // Define loader styles
    this.style = document.createElement("style");
  }

  /** Show loader inside container */
  public show(): void {
    if (!document.head.contains(this.style))
      document.head.appendChild(this.style);
    if (!this.container.contains(this.overlay))
      this.container.appendChild(this.overlay);
  }

  /** Hide loader with fade-out */
  public hide(): void {
    this.overlay.style.opacity = "0";
    this.overlay.style.visibility = "hidden";
    setTimeout(() => {
      if (this.overlay.parentElement) this.overlay.remove();
    }, 800);
  }

  /** Helper to show loader for a duration */
  public async simulate(duration: number): Promise<void> {
    this.show();
    await new Promise((resolve) => setTimeout(resolve, duration));
    this.hide();
  }
}
