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

    function initHero(index) {
        bg1.style.backgroundImage = `url('${images[index]}')`;
        animateHeroText(heroTexts[index]);
        setActiveHr(index);

        loader.style.display = "none";
        mainHeroSection.classList.add("visible");

        let slideInterval = setInterval(changeBackground, 5000);

        numbers.forEach((dot, idx) => {
            dot.addEventListener("click", () => {
                clearInterval(slideInterval);
                if (idx === currentIndex) return;

                bg2.style.backgroundImage = `url('${images[idx]}')`;
                bg2.style.opacity = "1";
                numbers.forEach((num) => num.classList.remove("active"));
                numbers[idx].classList.add("active");

                animateHeroText(heroTexts[idx]);
                setActiveHr(idx);

                setTimeout(() => {
                    bg1.style.backgroundImage = bg2.style.backgroundImage;
                    bg2.style.opacity = "0";
                    currentIndex = idx;
                }, 1500);

                slideInterval = setInterval(changeBackground, 5000);
            });
        });
    }

    // Start loading timer
    const loaderStart = Date.now();
    const preloadImg = new Image();
    preloadImg.src = images[0];

    // Fallback: hide loader after 5 seconds even if image doesn't load
    const maxWait = setTimeout(() => {
        initHero(0); // Proceed even without image load
    }, 5000);

    preloadImg.onload = () => {
        clearTimeout(maxWait); // Cancel fallback if loaded in time
        const timeElapsed = Date.now() - loaderStart;
        const remainingTime = Math.max(0, 1000 - timeElapsed);

        setTimeout(() => {
            initHero(0); // Initialize carousel after remaining wait
        }, remainingTime);
    };
});





function animateCount(el, start, end, duration, showPlus = false) {
  let current = start;
  const range = end - start;
  const stepTime = 30; // slower updates (every 30ms instead of 20ms)
  const increment = range / (duration / stepTime);

  const counter = setInterval(() => {
    current += increment;

    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
      current = end;
      clearInterval(counter);
    }

    el.textContent = Math.floor(current) + (showPlus ? '+' : '');
  }, stepTime);
}

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Slower durations (in milliseconds)
      animateCount(document.getElementById("year-count"), 2025, 2013, 4000); // slow count down
      animateCount(document.getElementById("customer-count"), 0, 10000, 6000, true); // slower count up
      animateCount(document.getElementById("project-count"), 0, 5000, 5000, true);
      animateCount(document.getElementById("country-count"), 0, 10, 5000, true);

      observer.disconnect();
    }
  });
});

observer.observe(document.querySelector(".company-record"));



