# Mega Guitar

[https://smartshark27.github.io/mega-guitar/](https://smartshark27.github.io/mega-guitar/)

Website to display my favourite acoutsic guitar tabs without ads or subscriptions.

## Website

Next.js app that displays guitar tabs from `data/tabs` in a neat form so that I can play along to them.

### Running the Website

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deploying to GitHub Pages

This project is configured for static export and can be hosted on GitHub Pages.

1.  **Enable GitHub Actions**: In your GitHub repository, go to `Settings` > `Actions` > `General` and ensure "Allow all actions and reusable workflows" is selected.
2.  **Configure GitHub Pages**: Go to `Settings` > `Pages`. Under "Build and deployment", set the "Source" to "GitHub Actions".
3.  **Push to `main`**: Any push to the `main` branch will automatically trigger the deployment workflow in `.github/workflows/nextjs.yml`.
