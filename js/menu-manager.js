"use strict";

(function () {
    window.menuManager = function () { 
        var nav = document.querySelector(".main-nav");
        var hamburger = nav.querySelector(".main-nav__hamburger");

        hamburger.addEventListener("click", function () {
            if (hamburger.classList.contains("main-nav__hamburger--closed")) {
                hamburger.classList.remove("main-nav__hamburger--closed");
                hamburger.classList.add("main-nav__hamburger--opened");
            } else {
                hamburger.classList.remove("main-nav__hamburger--opened");
                hamburger.classList.add("main-nav__hamburger--closed");
            }
        })
    };
})();
