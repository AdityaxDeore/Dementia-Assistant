# GitHub Pages Deployment Guide

## Issue: GitHub Pages Showing README Instead of Application

If GitHub Pages is currently showing your README.md file instead of your React application, it's because GitHub Pages is not properly configured to serve your built application.

## Solution

### Option 1: GitHub Actions Deployment (Recommended)

This repository already includes a GitHub Actions workflow that automatically builds and deploys your application to GitHub Pages:

1. Ensure your GitHub Pages settings are configured to deploy from GitHub Actions:
   - Go to your repository Settings
   - Click on "Pages" in the left sidebar
   - Under "Source", select "GitHub Actions"

2. The workflow will automatically run on every push to the `main` branch and deploy your application.

### Option 2: Manual Deployment

If you prefer to deploy manually:

1. Build the client application:
   ```bash
   npm run build:client
   ```

2. Deploy to GitHub Pages:
   ```bash
   npm run deploy
   ```

### Option 3: Deploy from Branch

If you want to deploy from a specific branch:

1. Build the client application:
   ```bash
   npm run build:client
   ```

2. Commit and push the built files to a branch (e.g., `gh-pages`):
   ```bash
   git add dist/public -f
   git commit -m "Deploy to GitHub Pages"
   git subtree push --prefix dist/public origin gh-pages
   ```

3. Configure GitHub Pages to serve from the `gh-pages` branch:
   - Go to your repository Settings
   - Click on "Pages" in the left sidebar
   - Under "Source", select "Deploy from a branch"
   - Choose "gh-pages" branch and "/ (root)" folder

## Troubleshooting

### 404 Errors or Blank Page

If you encounter 404 errors or a blank page after deployment:

1. Ensure the [404.html](client/404.html) file is copied to your build directory
2. Check that your [vite.config.ts](vite.config.ts) has the correct `base` setting
3. Verify that your routing library (wouter) is configured for GitHub Pages

### Still Seeing README.md

If you're still seeing the README.md file:

1. Check your GitHub Pages source settings
2. Ensure the workflow has run successfully
3. Verify that the build artifacts are being generated in the correct directory