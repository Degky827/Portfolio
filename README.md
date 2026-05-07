# Modernize-Portifolio

A modern personal portfolio built with React, Vite and Tailwind CSS that showcases projects, skills, certificates and CV for Desalegn Kasaye.

## Contents

- **Overview** — What this project is and its purpose.
- **Prerequisites** — Tools you need installed.
- **Setup** — Install dependencies and run locally.
- **Available scripts** — Common npm commands.
- **Project structure** — Short description of important files and folders.
- **Features** — Key features and components overview.
- **How to update certificates & projects** — Step-by-step for common edits.
- **Deploying** — Quick deploy notes (Vercel / GitHub Pages).

## Overview

This repo contains a single-page portfolio site built with React (JSX) and Tailwind CSS, using Vite as the dev server/bundler. It includes components for the navbar, hero, projects, skills, contact, and a CV modal which links PDF certificates in the `public/` folder.

The site features an **Advanced Features** page with interactive elements including:
- Live system metrics dashboard with real-time updates and circular progress indicators
- Animated counters for statistics (triggered on scroll)
- Fully functional interactive terminal with 16+ commands including argument support
- Enhanced Engineering Challenges & Solutions with progress bars, status badges, and expandable milestones
- Expandable feature cards with additional details

## Prerequisites

- Node.js >= 16 (recommended) and npm or pnpm
- Git (for cloning and deployments)

## Setup (local)

1. Clone the repository:

```bash
git clone https://github.com/your-repo/modernize-portifo.git
cd modernize-portifo
```

2. Install dependencies:

```bash
npm install
# or
pnpm install
```

3. Start the dev server:

```bash
npm run dev
```

The site will be available at `http://localhost:5173/` (default Vite port).

## Available scripts

- `npm run dev` — Start Vite dev server.
- `npm run build` — Build production bundle to `dist/`.
- `npm run preview` — Preview the production build locally.

If you use `pnpm` or `yarn`, replace `npm run` accordingly.

## Project structure

- `index.html` — App entry HTML.
- `src/main.jsx` — React entry, mounts the app.
- `src/App.jsx` — Main app wrapper.
- `src/components/` — UI components used across the site:
  - `Navbar.jsx` — Top navigation and mobile menu with smooth scroll to sections.
  - `Hero.jsx` — Landing hero section.
  - `AdvancedFeatures.jsx` — Interactive advanced features page with live metrics, animated counters, and functional terminal.
  - `Projects.jsx` — Featured projects grid (live + repo links).
  - `CVModal.jsx` — Resume modal and certificates list (loads PDFs from `public/`).
  - Other components: `About.jsx`, `Skills.jsx`, `Contact.jsx`, `Footer.jsx`, etc.
- `public/` — Static assets served as-is (images, PDFs, .pkt file). Any PDF placed here is available at `/<filename>`.
- `vite.config.js`, `postcss.config.js`, `package.json` — build tooling and scripts.

## Features

### Advanced Features Page (`/advanced`)
- **Live System Metrics Dashboard**: Real-time CPU, memory, network, and active user metrics with circular progress indicators that update every 2 seconds
- **Animated Counters**: Statistics animate when scrolled into view using Framer Motion's `useInView`
- **Interactive Terminal**: Fully functional terminal emulator with 16+ commands:
  - `help` - List available commands
  - `status` - Show system status
  - `deploy` - Simulate deployment
  - `scan` - Run security scan
  - `monitor` - Display live metrics
  - `uptime` - Show system uptime
  - `version` - Display version info
  - `clear` - Clear terminal history
  - `ls` - List directory contents
  - `pwd` - Print working directory
  - `whoami` - Display current user
  - `date` - Show current date/time
  - `echo [text]` - Echo text (accepts arguments)
  - `history` - Show command history
  - `neofetch` - Display system info with ASCII art style
  - `systeminfo` - Detailed system information
  - `ps` - List running processes
  - `df` - Show disk space usage
  - `free` - Display memory usage
  - `top` - Show running tasks
  - `ifconfig` - Network interface configuration
  - `ping [host]` - Ping a host (accepts arguments)
  - Also supports `npm`, `git`, and `docker` commands
  - Quick command buttons for easy access
- **Engineering Challenges & Solutions**: Enhanced with:
  - Progress bars showing completion percentage (animated)
  - Status badges (In Progress, Active, Near Complete, Almost Done)
  - Expandable milestones for each challenge
  - Color-coded progress indicators
- **Feature Details**: Expandable cards showing additional feature information when clicked

### Other Features
- **Dark Mode Toggle**: Switch between light and dark themes (persisted in localStorage)
- **Smooth Scrolling**: Navigation links smoothly scroll to corresponding sections
- **Responsive Design**: Mobile-friendly with hamburger menu
- **CV Modal**: View and download resume with certificate links
- **Contact Form**: Functional contact section with social media links

## How to update certificates (step-by-step)

1. Add or replace certificate PDF files in the `public/` folder. Example filenames in this repo:
   - `learner_transcript.pdf`
   - `Networking_Academy_Learn-A-Thon_2026_certificate_desalegnkasayemuluyekasaye-gmail-com_d61d7bd1-93a4-418b-af56-08b473aa9b6d.pdf`

2. Open `src/components/CVModal.jsx` and update the `certificates` array to add/remove entries. Each item should contain:

```js
{ name: 'Certificate Title', issuer: 'Issuer Name', file: '/filename.pdf' }
```

3. Save the file and the dev server will hot-reload. Verify the certificate link opens the PDF in a new tab.

## How to update projects (step-by-step)

1. Edit `src/components/Projects.jsx` and locate the `projectsData` array.
2. To change a project's live URL, update the `liveUrl` value for that project object.
3. To change the repo link, update `repoUrl`.
4. Save and verify the links in the Projects section.

Notes: ensure `liveUrl` values are valid URLs. The components expect each project item to include `title`, `description`, `tags`, `icon`, `color`, `liveUrl`, and `repoUrl`.

## Deploying

- Vercel: Connect the GitHub repo to Vercel and deploy. Vercel will run the Vite build automatically.
- GitHub Pages: Build (`npm run build`) then deploy the `dist/` contents to GitHub Pages using a static hosting action or gh-pages.

## Environment & secrets

This project uses no server-side secrets by default. If you add environment variables for builds, place them in a `.env` file (do not commit secrets to the repo).

## Troubleshooting

- If you see a JSX syntax error in `src/components/Projects.jsx`, open that file and remove any stray JavaScript expressions inside JSX elements (for example an accidental `liveUrl: '...'` inside an `<a>` tag). See commit history for a recent fix.
- If assets from `public/` do not load, ensure filenames match exactly and do not contain leading spaces.

## Maintenance notes

- Keep certificate filenames short and consistent for easier linking (recommended: `issuer-name_title_year.pdf`). If you rename files in `public/`, update `CVModal.jsx` accordingly.
- Use commits with descriptive messages when updating certificates or projects.

---

If you'd like, I can:

- shorten/normalize the long networking certificate filename and update references,
- commit these README changes for you, or
- add a small CONTRIBUTING.md with instructions for future edits.

File: [README.md](README.md)
