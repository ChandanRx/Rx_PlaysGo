# PlaysGo

PlaysGo is a web application that helps users find and connect with other players for their favorite games. It now runs entirely with local dummy data, so there is no API, auth provider, Firebase project, or external backend required.

## Features

- Post requests to find players for various games
- Browse public demo game requests
- Search posts by game
- Create and delete demo posts locally
- Fully responsive UI built with Next.js and Tailwind CSS

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Demo data**: Local JavaScript data with browser localStorage

## How It Works

1. Users browse demo game requests from the homepage.
2. Users create a new request with game, date, location, image, and description.
3. Posts are saved in localStorage for the current browser.
