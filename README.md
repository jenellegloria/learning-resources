# Learning Resources

Interactive teaching tools for ethics and moral philosophy courses. Built with React + Vite, deployed via GitHub Pages.

## Current Tools

- **Kant's Categorical Imperative** — Visual walkthrough of the Universal Law and Humanity formulations, including the false promise contradiction visualization, Kant's four maxim examples, and guided student exercises.

## Project Structure

```
learning-resources/
├── src/
│   ├── main.jsx              ← Router: add new routes here
│   ├── App.jsx               ← Landing page: register tools here
│   └── tools/
│       └── kant-categorical-imperative/
│           └── KantApp.jsx
├── .github/
│   └── workflows/
│       └── deploy.yml         ← Auto-deploys on push to main
├── index.html
├── vite.config.js
└── package.json
```

## Adding a New Tool

1. Create a folder: `src/tools/your-tool-name/`
2. Build your component with a default export
3. Add a route in `src/main.jsx`:
   ```jsx
   import YourTool from "./tools/your-tool-name/YourTool";
   // inside <Routes>:
   <Route path="/your-tool-name" element={<YourTool />} />
   ```
4. Register it in the `tools` array in `src/App.jsx` so it appears on the landing page
5. Push to `main` — it deploys automatically

---

## Setup & Deployment Instructions

### Prerequisites

- A [GitHub](https://github.com) account
- [Git](https://git-scm.com/downloads) installed on your computer
- [Node.js](https://nodejs.org/) (version 18 or higher) installed

You can verify these by running:
```bash
git --version
node --version
npm --version
```

### Step 1: Create the GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Set the repository name to **`learning-resources`**
3. Leave it as **Public** (required for free GitHub Pages hosting)
4. Do **not** check "Add a README" (we already have one)
5. Click **Create repository**
6. Keep the page open — you'll need the URL it shows you

### Step 2: Download & Push the Project

Unzip the project files you downloaded, then open a terminal in that folder and run:

```bash
cd learning-resources

# Initialize git and make the first commit
git init
git add .
git commit -m "Initial commit: Kant's Categorical Imperative tool"

# Connect to your GitHub repo (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/learning-resources.git
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repo on GitHub: `github.com/YOUR_USERNAME/learning-resources`
2. Click **Settings** (tab along the top)
3. In the left sidebar, click **Pages**
4. Under **Source**, select **GitHub Actions**
5. That's it — the workflow we included will handle the rest

### Step 4: Wait for Deployment

1. Click the **Actions** tab in your repo
2. You should see a workflow run called "Deploy to GitHub Pages"
3. Wait for it to finish (usually 1–2 minutes)
4. Your site will be live at:

```
https://YOUR_USERNAME.github.io/learning-resources/
```

### Local Development

To run the site locally while making changes:

```bash
npm install
npm run dev
```

This starts a dev server (usually at `http://localhost:5173`). Changes you save will appear instantly.

When you're happy with changes, push to deploy:

```bash
git add .
git commit -m "Describe your changes"
git push
```

The GitHub Action will rebuild and redeploy automatically.

---

## Troubleshooting

**"Page not found" after deployment:**
Make sure you selected **GitHub Actions** (not "Deploy from a branch") in Settings → Pages → Source.

**Blank page:**
Check the browser console for errors. The `base` in `vite.config.js` must match your repo name (`/learning-resources/`).

**Workflow failed:**
Click into the failed run in the Actions tab to see the error log. Usually it's a missing dependency — run `npm install` locally, commit the updated `package-lock.json`, and push again.
