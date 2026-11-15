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

## New GitHub projects appear automatically

Every public repository on github.com/cyrineakrout that isn't already on the page is added by itself (visitors see updates within about an hour):

- **Group:** add the topic `finance` (or `quant`) to the repo on GitHub to place it under *Quantitative Finance*; otherwise it goes under *Data Science & Machine Learning*.
- **Title / text:** the repo name (dashes become spaces) and the repo's *About* description.
- **Image:** put a file called `project-image.svg` (or `.png` / `.jpg`) at the root of the repo; otherwise a default picture is used.
- **Report button:** appears if there's a PDF at the root of the repo (preferably with "report" in its name).

To hide a repo, add its name to `EXCLUDE_REPOS` in `script.js`.

## Editing

- **Add a project:** copy one `<article class="project">` block in `index.html`, change the title, text, link, image and the `--bg` colour.
- **Project images:** SVGs in `images/projects/` — swap in your own screenshots (PNG/JPG) if you prefer.

## Deploy

Any static host works (GitHub Pages, Netlify, Vercel). Upload the whole folder; `index.html` is the entry point.

Skill icons from [Devicon](https://devicon.dev) (MIT).
