const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

function updateDeviceClass(e) {
  if (e.matches) {
    // Desktop
    document.body.classList.add("desktop");
    document.body.classList.remove("touch-device");
  } else {
    // Touch device
    document.body.classList.add("touch-device");
    document.body.classList.remove("desktop");
  }
}

// Run once on page load
updateDeviceClass(mediaQuery);

// Run again when device capabilities change
mediaQuery.addEventListener("change", updateDeviceClass);
