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
  // window.addEventListener("load", function () {
  //   const video = document.getElementById("bg-video");

  //   if (video) {
  //     video.muted = true;
  //     video.playsInline = true;
  //     video.setAttribute('playsinline', '');
  //     video.setAttribute('muted', '');
  //     video.setAttribute('autoplay', '');
  //     video.load();
  //   }
  //   // try to force play
  //   video
  //     .play()
  //     .then(() => {
  //       console.log("Video playing");
  //     })
  //     .catch((err) => {
  //       console.warn("Autoplay failed, maybe user interaction is required", err);
  //     });
  // });
  window.addEventListener("load", function () {
    const video = document.getElementById("bg-video");
  
    if (video) {
      video.muted = true;
      video.playsInline = true;
      video.loop = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('muted', '');
      video.setAttribute('autoplay', '');
      video.load();
  
      video
        .play()
        .then(() => {
          console.log("Video playing");
        })
        .catch((err) => {
          console.warn("Autoplay failed, maybe user interaction is required", err);
        });
    }
  });
  
  const swiper = new Swiper('.slide-wrapper', {
    loop: true,
    spaceBetween: 25,
    grabCursor:25,
  
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
      clickable:true,
      dynamicBullets: true,
    },
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    //responsive breakpoints
    breakpoints: {
    0: {
      slidesPerView: 1
    },
    768: {
      slidesPerView: 2
    },
    1024: {
      slidesPerView: 3
    }
  }
 });
  
