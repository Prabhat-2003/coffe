// // 
// const menuOpenButton = document.querySelector("#menu-open-button");
// const menuCloseButton = document.querySelector("#menu-close-button");
// const body = document.body;

// // Open menu
// menuOpenButton.addEventListener("click", () => {
//     document.body.classList.toggle("show-mobile-menu");
// });

// // // Close menu
// // menuCloseButton.addEventListener("click", () => {
// //     body.classList.remove("show-mobile-menu");
// // });
// // document.addEventListener("DOMContentLoaded", function () {
// //     const menuOpenButton = document.querySelector("#menu-open-button");
// //     const menuCloseButton = document.querySelector("#menu-close-button");
// //     const body = document.body;

// //     if (menuOpenButton && menuCloseButton) {
// //         // Open menu
// //         menuOpenButton.addEventListener("click", () => {
// //             body.classList.add("show-mobile-menu");
// //         });

// //         // Close menu
// //         menuCloseButton.addEventListener("click", () => {
// //             body.classList.remove("show-mobile-menu");
// //         });
// //     }
// // });
document.addEventListener("DOMContentLoaded", function () {
    const menuOpenButton = document.querySelector("#menu-open-button");
    const menuCloseButton = document.querySelector("#menu-close-button");
    const body = document.body;

    if (menuOpenButton && menuCloseButton) {
      menuOpenButton.addEventListener("click", () => {
        body.classList.add("show-mobile-menu");
      });

      menuCloseButton.addEventListener("click", () => {
        body.classList.remove("show-mobile-menu");
      });
    }
  });
  document.getElementById("play-btn").addEventListener("click", function () {
    const video = document.getElementById("banner");
    video.play();
  });