# Vibe Backend

A Node.js backend for the Vibe digital album application, built with Express, TypeScript, Prisma, and PostgreSQL.

## Features

- User authentication with JWT
- Vibe (digital album) management
- Media upload and management with AWS S3
- Collaboration features with contributors
- Notifications system
- Favorites system
- Content moderation with flagged media

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- AWS S3 bucket and credentials

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# App
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/vibe?schema=public"

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# AWS
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
AWS_S3_BUCKET=your_bucket_name
```

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd vibe-backend
```

2. Install dependencies:

```bash
npm install
```

3. Generate Prisma client:

```bash
npm run prisma:generate
```

4. Run database migrations:

```bash
npm run prisma:migrate
```

## Development

Start the development server:

```bash
npm run dev
```

## Production

1. Build the application:

```bash
npm run build
```

2. Start the production server:

```bash
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Vibes

- `POST /api/vibes` - Create vibe
- `GET /api/vibes` - Get all vibes
- `GET /api/vibes/:id` - Get vibe by ID
- `PUT /api/vibes/:id` - Update vibe
- `DELETE /api/vibes/:id` - Delete vibe

### Media

- `POST /api/media` - Upload single media
- `POST /api/media/batch` - Upload multiple media
- `GET /api/media` - Get all media
- `GET /api/media/:id` - Get media by ID
- `PUT /api/media/:id` - Update media
- `DELETE /api/media/:id` - Delete media

### Vibe Contributors

- `POST /api/vibe-contributors` - Add contributor
- `GET /api/vibe-contributors/vibe/:vibeId` - Get vibe contributors
- `PUT /api/vibe-contributors/:id` - Update contributor role
- `DELETE /api/vibe-contributors/:id` - Remove contributor

### Notifications

- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read
- `DELETE /api/notifications/:id` - Delete notification
- `DELETE /api/notifications` - Delete all notifications

### Favorites

- `POST /api/favorites` - Add to favorites
- `GET /api/favorites` - Get user favorites
- `DELETE /api/favorites/:mediaId` - Remove from favorites

### Flagged Media

- `POST /api/flagged-media` - Flag media
- `GET /api/flagged-media` - Get all flagged media (admin)
- `PUT /api/flagged-media/:id/resolve` - Resolve flagged media (admin)

## License

MIT
