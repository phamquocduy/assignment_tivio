📝 Context
This is a technical assignment I received from Tivio as part of their interview process.
I was given approximately 4 hours to complete it (including reading the requirements, implementing the solution, and submitting it).


# 🎬 Movie Discovery App – Interview Assignment

Welcome to the **Movie Discovery App** assignment!  
Your task is to build a simple but thoughtful application that allows users to discover movies using data from [The Movie Database (TMDB)](https://developer.themoviedb.org/reference) API.

This is your opportunity to demonstrate how you approach architecture, UX, API integration, and clean code.

---

## 🧩 Objective

Create a responsive web application that allows users to:

- Explore and filter movies from TMDB
- View detailed information about each movie
- Experience a dynamic "discovery" mode using a timed movie rotation

---

## ✅ Core Features

### 🎛 Movie Filtering

- Filter by **genres** (checkboxes or multiselect)
- Filter by **release year** (range selector)
- Filter by **minimum rating** (e.g. slider from 0 to 10)

### 📄 Movie List & Pagination

- Display a paginated list of movies
- Each movie should include:
  - Poster
  - Title
  - Release year
  - Average rating

### 🎬 Movie Detail Modal

- On click, open a modal with extended movie info (e.g. overview, genres, release date)
- Show **similar movies** within the detail view

### ⏱ "Discovery Timer"

- Add an optional mode that automatically shows **new filtered movies every 20 seconds** (the logic behind the filters is up to you - just make sure you filter out NSFW content 🔞)
- Include a **visual countdown indicator**
- The timer should **pause** when the user opens the movie modal
- When the modal is closed, the timer should **resume**

---

## 🧪 Technical Requirements

- Use the official **TMDB API** (you can find the API key in the code)
- Keep the UI clean and the UX intuitive
- Write **clean and readable code**

---

## 🌟 Bonus Points

- Responsive design for mobile and tablet
- Graceful handling of loading states and errors
- API caching (e.g. memoization or local caching)
- Unit tests for core components or logic
- Shareable links for movie details or filtered views

---

## 🚀 Submission Instructions

- Create a branch with your **name and date** (e.g. `john-doe-2025-04-07`)
- Push your code to a **public GitHub repository**
- Include a `SUMMARY.md` file with:
  - Notes on your process and decision making
  - What you would add or improve with more time
  - Anything you didn’t manage to implement
  - Justification for any libraries or approaches you chose

---

We’re excited to see what you come up with!  
Have fun with it — creativity and clean thinking are always appreciated.
