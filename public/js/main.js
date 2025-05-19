document.addEventListener("DOMContentLoaded", function () {
    const images = [
        "../images/image (2).svg",
        "../images/image (3).svg",
        "../images/image (4).svg",
        "../images/image (2).svg",
        "../images/image (3).svg"
    ];

    const heroTexts = [
        "Keeping reliable connections through",
        "Powering the future with",
        "Building trust from",
        "Shaping industries by delivering",
        "Delivering confidence supported by"
    ];

    let currentIndex = 0;
    const bg1 = document.querySelector(".carousel-background");
    const bg2 = document.querySelector(".carousel-background-next");
    const numbers = document.querySelectorAll(".carousel-number ul li");
    const dynamicText = document.querySelector(".hero-section-text h1.dynamic-text");
    const hrLines = document.querySelectorAll(".single-quates-section hr");
    const loader = document.getElementById("loader");
    const mainHeroSection = document.querySelector(".main-hero-section");

    function animateHeroText(text) {
        dynamicText.innerHTML = "";
        text.split("").forEach((char, index) => {
            const span = document.createElement("span");
            span.textContent = char === " " ? "\u00A0" : char;
            dynamicText.appendChild(span);
            setTimeout(() => {
                span.classList.add("show");
            }, index * 50);
        });
    }

    function setActiveHr(index) {
        hrLines.forEach((hr, i) => {
            hr.classList.toggle("active-hr", i === index);
        });
    }

    function changeBackground() {
        const nextIndex = (currentIndex + 1) % images.length;
        bg2.style.backgroundImage = `url('${images[nextIndex]}')`;
        bg2.style.opacity = "1";
        numbers.forEach((num) => num.classList.remove("active"));
        numbers[nextIndex].classList.add("active");

        animateHeroText(heroTexts[nextIndex]);
        setActiveHr(nextIndex);

        setTimeout(() => {
            bg1.style.backgroundImage = bg2.style.backgroundImage;
            bg2.style.opacity = "0";
            currentIndex = nextIndex;
        }, 1500);
    }

    // Start time for loader
    const loaderStart = Date.now();

    const preloadImg = new Image();
    preloadImg.src = images[0];

    preloadImg.onload = () => {
        const timeElapsed = Date.now() - loaderStart;
        const remainingTime = Math.max(0, 2000 - timeElapsed); // 5 sec minimum

        setTimeout(() => {
            // Set first image and prepare carousel
            bg1.style.backgroundImage = `url('${images[0]}')`;
            animateHeroText(heroTexts[0]);
            setActiveHr(0);

            loader.style.display = "none";
            mainHeroSection.classList.add("visible");

            let slideInterval = setInterval(changeBackground, 5000);

            numbers.forEach((dot, index) => {
                dot.addEventListener("click", () => {
                    clearInterval(slideInterval);
                    if (index === currentIndex) return;

                    bg2.style.backgroundImage = `url('${images[index]}')`;
                    bg2.style.opacity = "1";
                    numbers.forEach((num) => num.classList.remove("active"));
                    numbers[index].classList.add("active");

                    animateHeroText(heroTexts[index]);
                    setActiveHr(index);

                    setTimeout(() => {
                        bg1.style.backgroundImage = bg2.style.backgroundImage;
                        bg2.style.opacity = "0";
                        currentIndex = index;
                    }, 1500);

                    slideInterval = setInterval(changeBackground, 200);
                });
            });
        }, remainingTime);
    };
});





function animateCount(el, start, end, duration, showPlus = false) {
  let current = start;
  const range = end - start;
  const increment = range / (duration / 20); // update every 20ms

  const counter = setInterval(() => {
    current += increment;

    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
      current = end;
      clearInterval(counter);
    }

    el.textContent = Math.floor(current) + (showPlus ? '+' : '');
  }, 20);
}

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Count DOWN from 2025 to 2013 (Year)
      animateCount(document.getElementById("year-count"), 2025, 2013, 1500);

      // Count UP with '+' at the end
      animateCount(document.getElementById("customer-count"), 0, 10000, 1500, true);
      animateCount(document.getElementById("project-count"), 0, 5000, 1500, true);
      animateCount(document.getElementById("country-count"), 0, 10, 1500, true); // <-- Added true here

      observer.disconnect();
    }
  });
});

observer.observe(document.querySelector(".company-record"));


