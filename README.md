## React App Development with AI

### Project Overview

This movie discovery application was built as part of my FlyRank internship assignment.

I am a beginner React developer learning React, TypeScript, Vite, and Tailwind CSS. I used GitHub Copilot as a development assistant throughout the project while learning how a real React application is structured and developed.

I did not ask Copilot to generate the entire application at once. Instead, I built the application incrementally by giving Copilot prompts for individual features, reviewing the changes, testing them, and making corrections when necessary.

---

## Development Approach

I used the following approach while building the application:

1. Start with a basic React + TypeScript + Vite application.
2. Build the initial movie discovery interface.
3. Break the interface into reusable React components.
4. Add search functionality.
5. Connect the application to the TMDB API.
6. Add movie details.
7. Add a persistent watchlist.
8. Add navigation and responsive behavior.
9. Add pagination and improved UX states.
10. Implement and fix movie trailer functionality.
11. Test each feature as it was added.

---

## Initial Prompt

> I am a beginner React developer working on a FlyRank internship assignment.
>
> I want to build a movie-search React application as a learning project.
>
> Do not build the whole application for me.
>
> Act as both my React tutor and coding assistant. I want to understand what we are building and why.
>
> For every significant change:
>
> 1. Explain what we are about to do and why.
> 2. Tell me which files will be created or changed.
> 3. Explain important React, TypeScript, Vite, or JavaScript concepts involved.
> 4. Give me the code or make the change only after explaining it.
> 5. Keep the implementation beginner-friendly.
> 6. Do not introduce libraries unless they are actually necessary.
> 7. Never hide important logic behind unnecessary abstractions.
> 8. After making a change, explain how I can test it myself.
>
> If you think there are multiple ways to implement something, briefly explain the options and recommend one.
>
> Do not move to the next feature until I understand the current one.

---

## Project Setup Prompt

> Before we create the React application, explain what Vite is, what React is, and why we are using them together.
>
> Then explain what package.json, tsconfig.json, vite.config.ts, src/, and public/ are for.
>
> After explaining them, tell me the command I should run to create the application in this existing repository.
>
> Do not run or modify anything yet.

---

## Initial UI Prompt

> Build the initial UI for a movie discovery app. Create a navbar, a hero section for a featured movie, and a section for popular movies. Use React and Tailwind CSS. Keep the component structure simple because I am learning React.

---

## Component Refactoring Prompt

> Refactor the current movie app into reusable React components. Create separate components for the Navbar, Hero section, and MovieCard. Move the relevant existing code into these components and import them into App.tsx.
>
> Keep the current design and functionality exactly the same. Do not add new features or change the styling.

---

## Search Bar Prompt

> Now add a search bar to the movie app. Place it prominently in the Navbar or directly below the Navbar. The search bar should have a text input and a search button.
>
> For now, make the input functional by storing the user's search text in React state, but do not connect it to an API yet.
>
> Keep the existing design style and make the search bar responsive.

---

## Local Search Prompt

> Make the existing movie search functional. When the user enters a search term, filter the movie results based on the movie title.
>
> Make the search case-insensitive.
>
> Display the filtered results in the existing Popular Movies section, and show a simple "No movies found" message when there are no matches.
>
> Keep the current design and do not connect to an API yet.

---

## Search UX Prompt

> Next step: improve the movie discovery experience without adding any external API yet.
>
> Keep the existing React + TypeScript + Vite + Tailwind setup.
>
> Make the Search button actually submit the search rather than filtering immediately while typing.
>
> Move the search state/submit handling cleanly between Navbar and App.
>
> Make Popular movies update only after the user submits a search.
>
> Add a small "Showing results for: [search term]" message when a search has been submitted.
>
> Add a Clear search action when results are filtered.
>
> Keep the existing visual design and responsive layout.
>
> Do not add any movie API, API key, authentication, routing library, database, or unnecessary dependencies yet.
>
> Keep the code componentized and make sure TypeScript has no errors.
>
> After making the changes, tell me exactly which files were modified and briefly explain what was changed.

---

## TMDB Integration Prompt

> Next feature: implement real movie search using the existing TMDB service.
>
> We don't have a TMDB API key yet, so build the integration but make sure the app handles the missing key gracefully.
>
> Add a searchMovies function to src/services/tmdb.ts using TMDB's movie search endpoint.
>
> Keep fetchPopularMovies() for the default Popular Movies view.
>
> Change the Navbar search so submitting the form triggers a TMDB search.
>
> Do not search on every keystroke.
>
> Show loading and error states during a search.
>
> If the search returns no results, show an appropriate message.
>
> Add a clear/reset search action that returns to the popular movies.
>
> Keep the current component structure and visual design.
>
> Do not add unnecessary dependencies.
>
> Do not require a real API key for the app to compile.
>
> Make sure TypeScript has no errors.
>
> After making the changes, tell me which files were modified and how to test the feature.

---

## Major Feature Batch Prompt

> Build the next major batch of features for the movie discovery app.
>
> The TMDB API integration is working. Keep the existing React + TypeScript + Vite + Tailwind architecture and current visual design.
>
> ### 1. Movie details
>
> Make each MovieCard clickable.
>
> When a movie is selected, show a movie details view.
>
> Fetch the selected movie's full details from TMDB.
>
> Display poster/backdrop, title, release date, rating, genres, overview, and runtime where available.
>
> Add a clear Back action to return to the previous movie list.
>
> ### 2. Search improvements
>
> Search TMDB when the search form is submitted.
>
> Show a loading state while searching.
>
> Show a "No movies found" state when appropriate.
>
> Allow the user to clear the search and return to Popular Movies.
>
> Keep the search input value synchronized with the current search.
>
> ### 3. Watchlist
>
> Add an "Add to watchlist" button to the movie details view.
>
> Allow the user to remove a movie from the watchlist.
>
> Store the watchlist in localStorage so it survives page refreshes.
>
> Make the "My watchlist" navigation link display the user's saved movies.
>
> Prevent duplicate movies from being added.
>
> ### 4. Navigation
>
> Make Discover return to the main movie discovery section.
>
> Make Popular return to the popular movies section.
>
> Make My Watchlist display the saved movies.
>
> Do not add React Router unless it is genuinely necessary; prefer the existing project structure for now.
>
> ### 5. UX states
>
> Add sensible loading states.
>
> Add user-friendly error states.
>
> Handle missing posters/backdrops gracefully.
>
> Make the UI responsive on mobile, tablet, and desktop.
>
> ### Important constraints
>
> Do not change the existing overall visual identity.
>
> Keep components separated logically.
>
> Keep TMDB API functions inside src/services/tmdb.ts.
>
> Keep the API key in .env.
>
> Do not expose the API key in the UI.
>
> Do not add unnecessary dependencies.
>
> Do not rewrite working code unnecessarily.
>
> Make sure TypeScript has no errors.
>
> Before finishing, test the main flows:
>
> - Popular movies load.
> - Search works.
> - Clicking a movie opens its details.
> - A movie can be added to and removed from the watchlist.
> - The watchlist survives a page refresh.
> - Navigation between Discover, Popular, and Watchlist works.
>
> After implementation, give me a concise summary of the files changed and any issues that still need attention.

---

## UX and Production Polish Prompt

> Next feature batch: improve the movie app's UX and production polish.
>
> Keep all existing functionality working: TMDB data, search, movie details, watchlist, genres, trending movies, navigation, and responsive mobile menu.
>
> Implement:
>
> ### 1. Pagination / Load More
>
> Add a "Load more" button to movie listing sections where appropriate.
>
> Fetch the next TMDB page when clicked.
>
> Append the new movies instead of replacing the existing movies.
>
> Prevent duplicate movies.
>
> Show a loading state while loading more.
>
> ### 2. Search UX
>
> When search results are displayed, clearly show the search term and number of results.
>
> Add a clear-search button.
>
> Make pressing Enter submit the search.
>
> Keep the existing search behavior and don't search on every keystroke.
>
> ### 3. Watchlist improvements
>
> Show the number of movies currently in the watchlist.
>
> Show a useful empty-watchlist state.
>
> Allow removing movies directly from the watchlist cards.
>
> Keep the watchlist persisted with localStorage.
>
> ### 4. Movie details improvements
>
> Add a prominent backdrop/hero area.
>
> Display genres, rating, release date, runtime, and overview cleanly.
>
> Add the watchlist button with different states for "Add to Watchlist" and "Remove from Watchlist".
>
> Handle movies with missing backdrop/poster information gracefully.
>
> ### 5. Error handling
>
> Improve API error messages so they are user-friendly.
>
> Add a retry action when an API request fails.
>
> Do not expose technical errors or API keys to users.
>
> ### 6. Accessibility
>
> Make buttons and interactive cards keyboard accessible.
>
> Add appropriate aria-labels where necessary.
>
> Make sure form labels and focus states are accessible.
>
> Make sure color contrast remains readable.
>
> ### Constraints
>
> Keep the current visual identity.
>
> Reuse existing components.
>
> Keep TMDB API logic inside src/services/tmdb.ts.
>
> Do not add unnecessary dependencies.
>
> Do not rewrite working features unnecessarily.
>
> Keep TypeScript error-free.
>
> After implementation, tell me which files changed and briefly summarize what was added.

---

## Trailer Feature Prompt

> Fix and improve the trailer functionality. The current Watch Trailer implementation is not working correctly — it is showing the movie poster instead of an actual playable video.
>
> Please inspect the existing trailer implementation before changing it.
>
> ### 1. Fix the actual trailer
>
> Use TMDB's `/movie/{movie_id}/videos` endpoint.
>
> Make sure each movie has its TMDB id available in our Movie type.
>
> From the returned videos, find a suitable official trailer.
>
> Prefer:
>
> - type === "Trailer"
> - site === "YouTube"
> - official/appropriate trailer results
>
> Use the YouTube key to construct an actual YouTube embed URL.
>
> The modal must contain an `<iframe>` pointing to the YouTube video, not the movie poster or backdrop.
>
> Do not use the poster image as a fallback pretending to be a trailer.
>
> ### 2. Add trailer functionality to each movie
>
> Add a Watch Trailer action to the movie details page.
>
> If our movie cards already open a details page/modal, make the trailer action available there too.
>
> The selected movie must determine which trailer is requested.
>
> Do not hard-code one trailer for every movie.
>
> ### 3. Handle unavailable trailers
>
> If TMDB doesn't return a suitable YouTube trailer:
>
> Don't show a fake video or poster.
>
> Show a clear message such as "Trailer unavailable for this movie."
>
> Keep the rest of the movie details functional.
>
> ### 4. Keep the existing architecture
>
> Keep TMDB API requests in src/services/tmdb.ts.
>
> Keep the API key in .env.
>
> Update the Movie interface/type to include the TMDB movie id.
>
> Reuse existing components where possible.
>
> Don't add unnecessary dependencies.
>
> Don't break search, trending, genres, watchlist, movie details, pagination, or navigation.
>
> ### 5. Test the implementation
>
> Test trailers for several different movies, not just one.
>
> Confirm that:
>
> - The trailer modal opens.
> - An actual YouTube video appears.
> - The correct trailer belongs to the selected movie.
> - The video can play.
> - The modal can be closed.
> - Movies without trailers show the unavailable message.
>
> After making the changes, tell me exactly which files were modified and what was changed.

---

## How I Used AI

I used GitHub Copilot as a development assistant rather than asking it to generate the entire application.

I used ChatGPT to help me plan the development process and create the prompts I gave to GitHub Copilot for each feature. I then used those prompts incrementally while building the application.

Throughout the process, I reviewed Copilot's suggestions, tested the changes, and asked for explanations when I did not understand something. I also manually corrected and refactored generated code when I found issues or better approaches.

The goal was not simply to have AI build the application, but to use AI as a tool while learning how the different parts of a React application work together.