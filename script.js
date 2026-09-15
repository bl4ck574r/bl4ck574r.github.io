const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const navLinks = [...document.querySelectorAll('.section-nav a[href^="#"]')];
const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
let navigationFrame = null;

function updateNavigation() {
  let activeId = sections[0]?.id;
  const threshold = Math.min(window.innerHeight * 0.3, 210);
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= threshold) activeId = section.id;
  }
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
  if (atBottom && window.scrollY > 0) activeId = sections.at(-1)?.id;
  navLinks.forEach(link => {
    if (link.getAttribute('href') === `#${activeId}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  navigationFrame = null;
}
function queueNavigationUpdate() {
  if (navigationFrame === null) navigationFrame = requestAnimationFrame(updateNavigation);
}
window.addEventListener('scroll', queueNavigationUpdate, { passive: true });
window.addEventListener('resize', queueNavigationUpdate);
window.addEventListener('load', queueNavigationUpdate);
document.querySelector('.additional-training')?.addEventListener('toggle', queueNavigationUpdate);
updateNavigation();

// Blog posts remain visible if JavaScript is unavailable.
const blogFilters = document.querySelector('.blog-filters');
if (blogFilters) {
  const buttons = [...blogFilters.querySelectorAll('button[data-filter]')];
  const posts = [...document.querySelectorAll('.blog-post')];
  const count = document.querySelector('.post-count');
  const heading = document.getElementById('posts-heading');
  blogFilters.hidden = false;
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      let visibleCount = 0;
      posts.forEach(post => {
        post.hidden = filter !== 'all' && post.dataset.platform !== filter;
        if (!post.hidden) visibleCount += 1;
      });
      buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      count.textContent = `${visibleCount} ${visibleCount === 1 ? 'post' : 'posts'}`;
      heading.lastChild.textContent = filter === 'all' ? 'All posts' : button.textContent;
    });
  });
}
