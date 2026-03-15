# Shalendra Tiwari — Portfolio Website

This is a custom-designed, cinematic portfolio specifically tailored for **Shalendra Tiwari**, showcasing Unreal Engine development, Game AI, and Systems Engineering.

## 🚀 How to Deploy to GitHub Pages (Free Hosting)

I have already initialized the Git repository and made the first commit locally. To put this website live on the internet, follow these exact steps:

1. **Create a GitHub Repository**:
   - Go to [github.com/new](https://github.com/new) and log into your account (`Shaktiman-cell`).
   - Repository name: `shalendra-portfolio` or `shaktiman-cell.github.io` (Recommended: naming it exactly `shaktiman-cell.github.io` will automatically host it at that exact URL).
   - Keep it **Public**.
   - Do **NOT** check "Add a README file" (leave it totally empty).
   - Click **Create repository**.

2. **Push Your Local Code to GitHub**:
   - Open your VS Code terminal (or PowerShell) in this `D:\POrtfolio web` folder.
   - Run these three commands (replace the URL with your actual repo URL from step 1):
     ```bash
     git remote add origin https://github.com/Shaktiman-cell/shaktiman-cell.github.io.git
     git branch -M main
     git push -u origin main
     ```

3. **Turn on GitHub Pages**:
   - On GitHub, go to your repository's **Settings** tab.
   - On the left sidebar, click **Pages**.
   - Under "Build and deployment", set the **Source** to "Deploy from a branch".
   - Select the `main` branch and `/ (root)` folder, then click **Save**.
   - Wait 1-2 minutes, and your site will be live at `https://shaktiman-cell.github.io`!

---

## 🛠 How to Update Your Portfolio Later

The code is written cleanly so you can easily update text, skills, and projects without breaking the design.

### Modifying Text (About Me, Hero, etc.)
1. Open `index.html`.
2. Scroll to the section you want to change (e.g., `<!-- ═══ ABOUT ═══ -->`).
3. Just change the text inside the `<p>` or `<h2>` tags. Do not delete the HTML tags themselves.

### Updating Projects
1. Open `index.html` and find the `<!-- ═══ WORK ═══ -->` section.
2. Each project is wrapped in an `<article class="proj">` block.
3. **Change the video link**: Replace the `href="..."` on the `<a>` tag.
4. **Change the thumbnail**: Either put a new image in the `img/` folder and change `<img src="img/your-new-image.jpg">`, OR use a YouTube thumbnail directly: `<img src="https://img.youtube.com/vi/YOUR_VIDEO_ID/maxresdefault.jpg">`.
5. **Add a new project**: Copy an entire `<article class="proj">...</article>` block and paste it below the last one. If you want the image on the right, add the class `proj--flip` to the `<article>`.

### Updating the Skill Tree
1. Open `index.html` and find `<!-- ═══ SKILLS ═══ -->`.
2. To add a new skill to a category, simply add a new line inside the `<div class="tree-leaves">`:
   ```html
   <div class="snode snode--leaf" data-tree="leaf">New Skill Here</div>
   ```
3. The JavaScript will automatically draw the connecting lines when you reload the page.

### Adding New Background Images
1. Put the new high-quality image inside the `img/` folder.
2. Open `index.html`.
3. Find the section you want to change, e.g., `<div class="sec-bg" style="background-image:url('img/bg-samurai.jpg')"></div>`.
4. Change the URL to match your new image filename.
5. The CSS will automatically make it Black & White (except for the Hero section).

---
*Built with pure HTML, CSS, and vanilla JS. Designed for high performance and strict cinematic aesthetic.*
