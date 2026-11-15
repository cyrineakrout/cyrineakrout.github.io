# Cyrine Akrout — Personal website

Static site (HTML + CSS + JS, no build step). Open `index.html` in a browser to preview.

```
index.html        page content
styles.css        design
script.js         menu, animations, contact form
images/           illustrations, project images, skill icons
```

## Contact form (your email stays hidden)

The form sends messages through [Formspree](https://formspree.io), which forwards them to your inbox — your address never appears in the site's code.

1. Sign up at formspree.io and create a new form.
2. Copy the form ID (e.g. `xyzabcd` from `https://formspree.io/f/xyzabcd`).
3. In `script.js`, replace `YOUR_FORM_ID` with it.

## Editing

- **Add a project:** copy one `<article class="project">` block in `index.html`, change the title, text, link, image and the `--bg` colour.
- **Project images:** SVGs in `images/projects/` — swap in your own screenshots (PNG/JPG) if you prefer.

## Deploy

Any static host works (GitHub Pages, Netlify, Vercel). Upload the whole folder; `index.html` is the entry point.

Skill icons from [Devicon](https://devicon.dev) (MIT).
