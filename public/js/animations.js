// Intersection Observer to trigger animations when elements come into view
document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('.fade-in, .slide-in-right, .slide-in-left');
  
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, options);
  
  elements.forEach(element => {
    observer.observe(element);
  });
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // --- ACCESSIBILITÉ : aria-current dynamique sur la navbar ---
  const navLinks = document.querySelectorAll('.nav-link');
  const sectionIds = Array.from(navLinks).map(link => link.getAttribute('href')).filter(href => href.startsWith('#'));
  const sections = sectionIds.map(id => document.querySelector(id));

  function updateAriaCurrent() {
    let currentSection = sections[0];
    let scrollY = window.scrollY + 140; // Décalage pour header sticky
    // Parcours à l'envers pour prendre la dernière section visible
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      if (section && scrollY >= section.offsetTop) {
        currentSection = section;
        break;
      }
    }
    // Cas spécial : tout en bas de la page, on force la dernière section
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 2)) {
      currentSection = sections[sections.length - 1];
    }
    navLinks.forEach(link => link.removeAttribute('aria-current'));
    const activeLink = Array.from(navLinks).find(link => link.getAttribute('href') === '#' + currentSection.id);
    if (activeLink) {
      activeLink.setAttribute('aria-current', 'page');
    }
  }

  window.addEventListener('scroll', updateAriaCurrent);
  window.addEventListener('resize', updateAriaCurrent);
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      updateAriaCurrent();
      link.blur();
    });
  });
  updateAriaCurrent();
});