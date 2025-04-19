# repo-viewe
A modern React app that explores GitHub user and repository data using the GitHub REST API. Built with **Vite**, **TanStack Query**, and **Axios**, the app delivers fast, modular, and user-friendly access to profile and repo data.

---

## 🔍 Features

- **User Overview**  
  Fetches data:
  - Displays name, avatar, bio, followers, location, company, blog, and total public repos

- **Repository List**  
  Lists repos:
  - Shows repo name, description, language (with color badge), stars, forks, and watchers

- **Repository Detail Page**  
  Route: `/repo/:name`
  - Displays repo name & description
  - Shows the 5 latest commits 
  - Includes commit message, author, timestamp, and link to GitHub

---

## ⚙️ Stack

- **React + Vite**
- **@tanstack/react-query**
- **Axios**
- **React Router**
- **Font Awesome**
- **Jest**
- **CSS Modules**

---
## 🧪 Testing

- Unit tests written using **Jest**
- To run tests:
npm test

## 🚀 Getting Started

```bash
git clone https://github.com/sanazzarei/repo-viewe.git
cd repo-viewer
npm install
npm run dev


