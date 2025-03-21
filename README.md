# In Death Tournament

## Overview
In Death Tournament is a competitive leaderboard system for the VR game *In Death: Unchained*. It allows players to create and join tournaments, submit scores with proof, and track rankings in a leaderboard format.

## Features
- **User Authentication:** Google OAuth 2.0 for secure login
- **Tournament Management:** Admins can create, edit, and delete tournaments
- **Leaderboard System:** Players can submit scores with proof (screenshot or video)
- **Permissions & Roles:** Admins manage tournaments, while players can join and submit scores
- **Live Updates:** Leaderboards update dynamically when scores are submitted

## Tech Stack
- **Frontend:** Next.js (React framework)
- **Backend:** Node.js with Express.js
- **Database:** MongoDB with Mongoose ORM
- **Authentication:** Passport.js with Google OAuth
- **State Management:** React Hooks & Context API
- **Styling:** Tailwind CSS
- **Notifications:** react-hot-toast

## Setup Instructions
### Prerequisites
- Node.js (v18 or later)
- MongoDB Atlas or a local MongoDB instance
- A Google Developer account for OAuth credentials
- Git installed

### Installation
1. Clone the repository:
   ```sh
   git clone git@github.com:loganJones103/in-death-tournament.git
   cd in-death-tournament
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the root with the following:
   ```env
   MONGO_URI=your_mongodb_connection_string
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   SESSION_SECRET=your_secret_key
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```

## Usage
- Visit `http://localhost:3000`
- Log in using Google OAuth
- View, join, and create tournaments
- Submit scores and proof to compete on the leaderboard

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to GitHub (`git push origin feature-name`)
5. Create a pull request

## License
This project is open-source under the MIT License.
