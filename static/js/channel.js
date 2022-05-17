

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// const navbarToggle = navbar.querySelector("#navbar-toggle");
// const navbarMenu = document.querySelector("#navbar-menu");
// const navbarLinksContainer = navbarMenu.querySelector(".navbar-links");
// let isNavbarExpanded = navbarToggle.getAttribute("aria-expanded") === "true";

// const toggleNavbarVisibility = () => {
//   isNavbarExpanded = !isNavbarExpanded;
//   navbarToggle.setAttribute("aria-expanded", isNavbarExpanded);
// };

// navbarToggle.addEventListener("click", toggleNavbarVisibility);

// navbarLinksContainer.addEventListener("click", (e) => e.stopPropagation());
// navbarMenu.addEventListener("click", toggleNavbarVisibility);