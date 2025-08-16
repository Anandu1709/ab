// Dark/Light Mode Toggle
const toggleBtn = document.querySelector(".toggle-theme")
const body = document.body
const THEME_KEY = "theme-mode"

function setTheme(mode) {
  if (mode === "dark") {
    body.classList.add("dark")
  } else {
    body.classList.remove("dark")
  }
  localStorage.setItem(THEME_KEY, mode)
}

// Initial theme
const savedTheme = localStorage.getItem(THEME_KEY)
if (savedTheme) setTheme(savedTheme)
else if (window.matchMedia("(prefers-color-scheme: dark)").matches) setTheme("dark")

// Toggle theme on button click
if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    const isDark = body.classList.toggle("dark")
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light")
  })
}

// Smooth scroll for nav links
const navLinks = document.querySelectorAll(".nav-links a")
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href")
    if (href.startsWith("#")) {
      e.preventDefault()
      document.querySelector(href).scrollIntoView({ behavior: "smooth" })
    }
  })
})

// Scroll animations
const animatedEls = document.querySelectorAll(".fade-in, .fade-in-left, .fade-in-right, .fade-in-up")
const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = "running"
        entry.target.classList.add("animated")
        obs.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.15 },
)

animatedEls.forEach((el) => {
  el.style.animationPlayState = "paused"
  observer.observe(el)
})

// Section fade-in pop animation
const sectionFades = document.querySelectorAll(".section-fade")
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
        // Animate skill bars if in s section
        if (entry.target.classList.contains("skills-section")) {
          const bars = entry.target.querySelectorAll(".-bar")
          bars.forEach((bar) => {
            const barWidth = bar.style.getPropertyValue("--bar-width")
            if (barWidth && !bar.classList.contains("animated")) {
              bar.classList.add("animated")
              bar.style.width = barWidth
            }
          })
        }
        sectionObserver.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.15 },
)
sectionFades.forEach((sec) => sectionObserver.observe(sec))

// Projects Carousel Functionality
class ProjectsCarousel {
  constructor() {
    this.track = document.getElementById("projectsTrack")
    this.slides = document.querySelectorAll(".projects-slide")
    this.prevBtn = document.getElementById("prevBtn")
    this.nextBtn = document.getElementById("nextBtn")
    this.indicators = document.querySelectorAll(".indicator")
    this.currentSlide = 0
    this.totalSlides = this.slides.length

    this.init()
  }

  init() {
    // Add event listeners
    this.prevBtn.addEventListener("click", () => this.prevSlide())
    this.nextBtn.addEventListener("click", () => this.nextSlide())

    // Add indicator click events
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => this.goToSlide(index))
    })

    // Update initial state
    this.updateCarousel()
    this.updateNavButtons()
  }

  nextSlide() {
    if (this.currentSlide < this.totalSlides - 1) {
      this.currentSlide++
    } else {
      this.currentSlide = 0 // Loop back to first slide
    }
    this.updateCarousel()
    this.updateNavButtons()
  }

  prevSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--
    } else {
      this.currentSlide = this.totalSlides - 1 // Loop to last slide
    }
    this.updateCarousel()
    this.updateNavButtons()
  }

  goToSlide(slideIndex) {
    this.currentSlide = slideIndex
    this.updateCarousel()
    this.updateNavButtons()
  }

  updateCarousel() {
    // Move the track to show the current slide
    const translateX = -this.currentSlide * 50// Each slide is 50% wide
    this.track.style.transform = `translateX(${translateX}%)`

    // Update slide active states
    this.slides.forEach((slide, index) => {
      slide.classList.toggle("active", index === this.currentSlide)
    })

    // Update indicators
    this.indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === this.currentSlide)
    })
  }

  updateNavButtons() {
    // Optional: You can disable buttons at start/end if you don't want looping
    // For now, we allow infinite looping so buttons are always enabled
    this.prevBtn.style.opacity = "1"
    this.nextBtn.style.opacity = "1"
  }
}

// Keyboard navigation for carousel
document.addEventListener("keydown", (e) => {
  if (window.projectsCarousel) {
    if (e.key === "ArrowLeft") {
      e.preventDefault()
      window.projectsCarousel.prevSlide()
    } else if (e.key === "ArrowRight") {
      e.preventDefault()
      window.projectsCarousel.nextSlide()
    }
  }
})

// Touch/Swipe support for mobile
let touchStartX = 0
let touchEndX = 0

document.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX
})

document.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX
  handleSwipe()
})

function handleSwipe() {
  const swipeThreshold = 50 // Minimum distance for a swipe
  const swipeDistance = touchEndX - touchStartX

  if (window.projectsCarousel && Math.abs(swipeDistance) > swipeThreshold) {
    if (swipeDistance > 0) {
      // Swipe right - go to previous slide
      window.projectsCarousel.prevSlide()
    } else {
      // Swipe left - go to next slide
      window.projectsCarousel.nextSlide()
    }
  }
}

// Skills Tab Functionality
class SkillsTabs {
  constructor() {
    this.tabs = document.querySelectorAll(".skill-tab")
    this.tabContents = document.querySelectorAll(".skills-tab-content")
    this.init()
  }

  init() {
    this.tabs.forEach((tab) => {
      tab.addEventListener("click", (e) => {
        const targetTab = e.target.getAttribute("data-tab")
        this.switchTab(targetTab)
      })
    })
  }

  switchTab(targetTab) {
    // Remove active class from all tabs and contents
    this.tabs.forEach((tab) => tab.classList.remove("active"))
    this.tabContents.forEach((content) => content.classList.remove("active"))

    // Add active class to clicked tab
    const activeTab = document.querySelector(`[data-tab="${targetTab}"]`)
    const activeContent = document.getElementById(`${targetTab}-skills`)

    if (activeTab && activeContent) {
      activeTab.classList.add("active")

      // Add a small delay for smooth transition
      setTimeout(() => {
        activeContent.classList.add("active")
      }, 100)
    }
  }
}

// Set all skill bars to width 0 initially
window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document.getElementById("loader-bg").classList.add("fade-out")
    setTimeout(() => {
      document.getElementById("loader-bg").style.display = "none"
    }, 700)
  }, 2200) // Adjust duration for full animation

  document.querySelectorAll(".skill-bar").forEach((bar) => {
    bar.style.width = "0%"
  })

  // Initialize projects carousel after DOM is loaded
  setTimeout(() => {
    window.projectsCarousel = new ProjectsCarousel()
    window.skillsTabs = new SkillsTabs()
  }, 100)
})


//message sending

      document.getElementById("contact-form").addEventListener("submit", function(e) {
        e.preventDefault(); // stop normal form redirect
    
        const form = e.target;
        const formData = new FormData(form);
    
        fetch("https://formspree.io/f/mgvzqboa", {
          method: "POST",
          body: formData,
          headers: { "Accept": "application/json" }
        })
        .then(response => {
          if (response.ok) {
            alert("✅ Message sent successfully!");
            form.reset();
          } else {
            alert("❌ Oops! Something went wrong. Please try again.");
          }
        })
        .catch(error => {
          alert("❌ Error sending message. Please check your connection.");
        });
      });
    