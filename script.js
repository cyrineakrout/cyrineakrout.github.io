/* ============================================================
   CONTACT FORM SETUP
   1. Create a free account at https://formspree.io
   2. Create a new form. Formspree forwards each message to your
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
        ? "The form isn't connected yet, please reach out on LinkedIn for now."
        : "Something went wrong. Please try again in a moment.";
  } finally {
    btn.disabled = false;
    label.textContent = "Send";
  }
});
form.querySelectorAll("input, textarea").forEach((f) => f.addEventListener("input", () => f.classList.remove("invalid")));

/* ============================================================
   AUTO-ADD NEW GITHUB PROJECTS
   Repositories already shown on the page are skipped. Any other
   public repository is added automatically:
   - It goes in "Quantitative Finance" if it has one of the
     FINANCE_TOPICS as a GitHub topic, otherwise in "Data Science".
   - Title  = repo name (dashes become spaces); description = repo
     description on GitHub.
   - Image  = a file named project-image.(svg|png|jpg|webp) at the
     root of the repo, if there is one; otherwise a default picture.
   - Report = the first .pdf at the root of the repo whose name
     contains "report" (any .pdf if none matches).
   ============================================================ */
const GITHUB_USER = "cyrineakrout";
const EXCLUDE_REPOS = ["cyrineakrout.github.io", "cyrineakrout"]; // the website + profile repos
const FINANCE_TOPICS = ["finance", "quant", "quantitative-finance", "fintech", "trading"];
const CARD_COLOURS = ["#6d7bb2", "#5f9a86", "#b26d7f", "#5f86a8", "#a8925f", "#8a6db2", "#a77b62", "#4e5a8f"];

(async function autoProjects() {
  const shown = new Set(
    [...document.querySelectorAll(".project .btn-code")].map((a) =>
      a.getAttribute("href").replace(/\/+$/, "").split("/").pop().toLowerCase()
    )
  );
  const gh = (path) =>
    fetch(`https://api.github.com/${path}`, { headers: { Accept: "application/vnd.github+json" } }).then((r) => {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    });

  // small cache so each visitor calls GitHub at most once per hour
  const CACHE_KEY = "gh-projects-v1";
  const readCache = () => {
    try {
      const c = JSON.parse(localStorage.getItem(CACHE_KEY));
      return c && Date.now() - c.t < 3600e3 ? c.data : null;
    } catch { return null; }
  };
  const writeCache = (data) => {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), data })); } catch {}
  };

  let projects = readCache();
  if (!projects) {
    try {
      const repos = await gh(`users/${GITHUB_USER}/repos?per_page=100&sort=pushed`);
      const fresh = repos.filter(
        (r) => !r.archived && !shown.has(r.name.toLowerCase()) && !EXCLUDE_REPOS.includes(r.name)
      );
      projects = await Promise.all(
        fresh.map(async (r) => {
          let image = null, report = null;
          try {
            const files = await gh(`repos/${GITHUB_USER}/${r.name}/contents/`);
            const names = files.filter((f) => f.type === "file").map((f) => f.name);
            const img = names.find((n) => /^project-image\.(svg|png|jpe?g|webp)$/i.test(n));
            if (img) image = `https://raw.githubusercontent.com/${GITHUB_USER}/${r.name}/${r.default_branch}/${img}`;
            const pdfs = names.filter((n) => /\.pdf$/i.test(n));
            const pdf = pdfs.find((n) => /report/i.test(n)) || pdfs[0];
            if (pdf) report = `${r.html_url}/blob/${r.default_branch}/${encodeURIComponent(pdf)}`;
          } catch {}
          return {
            name: r.name,
            title: r.name.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim().replace(/\b[a-z]/g, (c) => c.toUpperCase()),
            desc: r.description || (r.language ? `A ${r.language} project.` : "A project on GitHub."),
            url: r.html_url,
            finance: (r.topics || []).some((t) => FINANCE_TOPICS.includes(t.toLowerCase())),
            image, report,
          };
        })
      );
      writeCache(projects);
    } catch {
      return; // GitHub unreachable or rate-limited: keep the projects already on the page
    }
  }

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const codeIcon = document.querySelector(".btn-code svg")?.outerHTML || "";
  const docIcon = document.querySelector(".btn-report svg")?.outerHTML || "";
  const colourFor = (name) => CARD_COLOURS[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % CARD_COLOURS.length];

  projects.forEach((p) => {
    const grid = document.querySelector(p.finance ? "#finance .project-grid" : "#data-science .project-grid");
    if (!grid) return;
    const card = document.createElement("article");
    card.className = "project reveal in";
    card.tabIndex = 0;
    card.style.setProperty("--bg", colourFor(p.name));
    card.innerHTML = `
      <div class="project-content">
        <h3>${esc(p.title)}</h3>
        <img src="${esc(p.image || "images/projects/default.svg")}" alt="" loading="lazy" onerror="this.src='images/projects/default.svg'" />
        <div class="project-btns">
          ${p.report ? `<a class="btn-report" href="${esc(p.report)}" target="_blank" rel="noopener" title="Read the report">${docIcon}<span>Report</span></a>` : ""}
          <a class="btn-code" href="${esc(p.url)}" target="_blank" rel="noopener" title="View the code" aria-label="View the code on GitHub">${codeIcon}</a>
        </div>
      </div>
      <p class="project-desc">${esc(p.desc)}</p>`;
    grid.appendChild(card);
  });
})();
