const allHeroImages = ["1rv2.jpg","2rv2.jpg","4rv2.jpg","5rv2.jpg","6rv2.jpg","7rv2.jpg","8rv2.jpg","9rv2.jpg","10rv2.jpg","11rv2.jpg"];
const allDisplayThumbnails = ["1a.png","2a.png","4a.png","5a.png","6a.png","7a.png","8a.png","9a.png","10a.png","11a.png"];

const heroImages = allHeroImages.slice(0, 11);
const displayThumbnails = allDisplayThumbnails.slice(0, 11);

const hero = document.getElementById('hero');
const visibleTrack = document.getElementById('visibleTrack');
const thumbContainer = document.getElementById('thumbContainer');

let currentIndex = 0;
hero.style.backgroundImage = `url(${heroImages[currentIndex]})`;

// Create thumbnails - duplicate them for seamless looping
function createThumbnails() {
  visibleTrack.innerHTML = '';
  
  // Create multiple duplicates to ensure seamless loop
  for (let i = 0; i < 3; i++) {
    displayThumbnails.forEach((src, idx) => {
      const div = document.createElement('div');
      div.className = 'thumbnail';
      const img = document.createElement('img');
      img.src = src;
      img.addEventListener('click', () => {
        currentIndex = idx;
        hero.style.backgroundImage = `url(${heroImages[currentIndex]})`;
      });
      div.appendChild(img);
      visibleTrack.appendChild(div);
    });
  }
}

// Initialize thumbnails
createThumbnails();

// Seamless loop animation
let animationId;
let scrollPosition = 0;
const scrollSpeed = 0.3; // Adjust this value to change speed

function animate() {
  scrollPosition -= scrollSpeed;
  
  // Get the width of the original content (one set of thumbnails)
  const originalContentWidth = visibleTrack.scrollWidth / 3;
  
  // When we've scrolled past one full set, jump back to the beginning
  // This happens seamlessly because we have duplicates
  if (Math.abs(scrollPosition) >= originalContentWidth) {
    scrollPosition += originalContentWidth;
  }
  
  visibleTrack.style.transform = `translateX(${scrollPosition}px)`;
  animationId = requestAnimationFrame(animate);
}

// Start animation immediately
animationId = requestAnimationFrame(animate);

// Resize thumbnails to hero width
function resizeThumbsToHero() {
  const heroW = hero.clientWidth;
  const heroH = hero.clientHeight;

  const img = new Image();
  img.onload = () => {
    let scaledW;
    if (window.matchMedia("(max-width: 600px)").matches) {
      const targetImgH = Math.round(heroH * 0.88);
      const scale = targetImgH / img.naturalHeight;
      scaledW = Math.round(img.naturalWidth * scale);
    } else {
      const scale = Math.min(heroW / img.naturalWidth, heroH / img.naturalHeight);
      scaledW = Math.round(img.naturalWidth * scale);
    }

    const leftOffset = Math.max(0, Math.round((heroW - scaledW) / 2));

    thumbContainer.style.width = `${scaledW}px`;
    thumbContainer.style.maxWidth = `${scaledW}px`;
    thumbContainer.style.marginLeft = `${leftOffset}px`;
    thumbContainer.style.marginRight = `0px`;

    const isMobile = window.matchMedia("(max-width:600px)").matches;
    const topGap = isMobile ? 5 : 2;
    thumbContainer.style.marginTop = `${topGap}px`;
  };
  img.src = heroImages[currentIndex];
}

let resizeTO;
window.addEventListener('resize', () => {
  clearTimeout(resizeTO);
  resizeTO = setTimeout(resizeThumbsToHero, 120);
});

// Initialize everything
resizeThumbsToHero();