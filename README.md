# KoinX Global

KoinX Global is a server-side application that fetches and stores cryptocurrency data, providing APIs for retrieving statistics and calculating price deviations.

**Live API:** https://koinx-global.onrender.com/

**API Documentation:** https://koinx-global.onrender.com/api-docs

https://github.com/user-attachments/assets/08d86a8c-f424-44f1-9217-23b3d4fddb80

## How It's Made

**Tech Stack:** Node.js, Express, TypeScript, Prisma, MongoDB, Bun

This project uses a modern TypeScript-based backend stack. Express serves as the web framework, while Prisma acts as the ORM for interacting with a MongoDB database. The application is built and run using Bun, a fast all-in-one JavaScript runtime.

Key features include:

- Background job to fetch cryptocurrency data every 2 hours
- RESTful APIs for retrieving latest stats and price deviations
- Swagger documentation for easy API exploration
- Rate limiting for API protection

## Installation and Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/koinx_global.git
   cd koinx_global
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:

   ```
   DATABASE_URL="your_mongodb_connection_string"
   ```

4. Generate Prisma client:

   ```bash
   bun run generate
   ```

5. Run database migrations:

   ```bash
   bun run migrate
   ```

6. Start the development server:
   ```bash
   bun run dev
   ```

## Running the Application

- Development mode: `bun run dev`
- Production build: `bun run build`
- Start production server: `bun run start`

## API Endpoints

1. `api/v1/crypto/stats?coin=bitcoin` - Get latest stats for a cryptocurrency
2. `api/v1/crypto/deviation?coin=bitcoin` - Calculate price deviation for a cryptocurrency

Refer to the [API documentation](https://koinx-global.onrender.com/api-docs) for detailed information on request/response formats.

## Future Imporvements

- Implementing Redis caching for API responses to reduce database queries

## Lessons Learned

Building this project provided valuable insights into:

- Designing and implementing background jobs in Node.js
- Working with external APIs and handling rate limits
- Structuring a scalable Express.js application with TypeScript
- Deploying a Node.js application to a cloud platform (Render)
