/* ============================================================
   CONTACT FORM SETUP
   1. Create a free account at https://formspree.io
   2. Create a new form — Formspree forwards each message to your
      inbox, so your email address never appears on the website.
   3. Paste the form ID (the part after /f/ in the endpoint) below.
   ============================================================ */
const FORMSPREE_ID = "mbgogodk";

/* ---------- navbar background on scroll + back-to-top ---------- */
const navbar = document.getElementById("navbar");
const toTop = document.getElementById("backToTop");
const onScroll = () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
  toTop.classList.toggle("show", window.scrollY > 600);
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- side drawer ---------- */
const drawer = document.getElementById("drawer");
const backdrop = document.getElementById("backdrop");
const menuBtn = document.getElementById("menuBtn");
const setDrawer = (open) => {
  drawer.classList.toggle("open", open);
  backdrop.classList.toggle("show", open);
  drawer.setAttribute("aria-hidden", !open);
  menuBtn.setAttribute("aria-expanded", open);
};
menuBtn.addEventListener("click", () => setDrawer(true));
document.getElementById("drawerClose").addEventListener("click", () => setDrawer(false));
backdrop.addEventListener("click", () => setDrawer(false));
drawer.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setDrawer(false)));
document.addEventListener("keydown", (e) => e.key === "Escape" && setDrawer(false));

/* ---------- reveal on scroll ---------- */
const io = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }),
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 3) * 90}ms`;
  io.observe(el);
});

/* ---------- skills marquee: duplicate items for a seamless loop ---------- */
const track = document.getElementById("skillsTrack");
[...track.children].forEach((n) => {
  const c = n.cloneNode(true);
  c.setAttribute("aria-hidden", "true");
  track.appendChild(c);
});

/* ---------- contact form ---------- */
const form = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl.className = "form-status";
  statusEl.textContent = "";

  let ok = true;
  form.querySelectorAll("[required]").forEach((f) => {
    const bad = !f.value.trim() || (f.type === "email" && !/^\S+@\S+\.\S+$/.test(f.value));
    f.classList.toggle("invalid", bad);
    if (bad) ok = false;
  });
  if (!ok) {
    statusEl.classList.add("err");
    statusEl.textContent = "Please fill in your name, a valid email and a message.";
    return;
  }
  if (form._gotcha.value) return; // spam bot

  const btn = form.querySelector(".btn-send");
  const label = btn.querySelector(".label");
  btn.disabled = true;
  label.textContent = "Sending…";
  try {
    if (FORMSPREE_ID === "YOUR_FORM_ID") throw new Error("not-configured");
    const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error("failed");
    form.reset();
    statusEl.classList.add("ok");
    statusEl.textContent = "Thank you! Your message has been sent.";
  } catch (err) {
    statusEl.classList.add("err");
    statusEl.textContent =
      err.message === "not-configured"
        ? "The form isn't connected yet — please reach out on LinkedIn for now."
        : "Something went wrong. Please try again in a moment.";
  } finally {
    btn.disabled = false;
    label.textContent = "Send";
  }
});
form.querySelectorAll("input, textarea").forEach((f) => f.addEventListener("input", () => f.classList.remove("invalid")));
