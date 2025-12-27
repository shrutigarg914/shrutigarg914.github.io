// Getting hamburguer menu in small screens
const menu = document.getElementById("menu");
const ulMenu = document.getElementById("ulMenu");

function menuToggle() {
  // Toggle between h-0 (hidden) and auto height (visible) to fit all menu items
  if (menu.classList.contains("h-0")) {
    menu.classList.remove("h-0");
    menu.classList.add("h-auto");
  } else {
    menu.classList.remove("h-auto");
    menu.classList.add("h-0");
  }
}

// Browser resize listener
window.addEventListener("resize", menuResize);

// Resize menu if user changing the width with responsive menu opened
function menuResize() {
  // First get the size from the window
  const window_size = window.innerWidth || document.body.clientWidth;
  if (window_size > 640) {
    menu.classList.remove("h-auto");
    menu.classList.add("h-0");
  }
}
