# Chat Application - README

This is a comprehensive chat application built with Next.js, TypeScript, Prisma, PostgreSQL, and Socket.IO.

## Features

- Real-time messaging with WebSocket
- User authentication (login/signup)
- Group chats and direct messaging
- Image/file sharing capabilities
- Emoji picker and reactions
- Message status indicators (read/delivered)
- Message search and filtering
- User profiles and settings
- Responsive design for mobile and desktop

## Tech Stack

- **Frontend**: Next.js 14 with App Router, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Real-time**: Socket.IO
- **State Management**: Zustand
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Configure your database connection in `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/chat_app?schema=public"
JWT_SECRET="your_jwt_secret_key"
```

4. Run database migrations:

```bash
npx prisma migrate dev
```

5. Generate Prisma client:

```bash
npx prisma generate
```

6. Start the development server:

```bash
npm run dev
```

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT token generation

## Project Structure

```
chat-app/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/             # API routes
│   │   │   ├── auth/        # Authentication routes
│   │   │   ├── upload/      # File upload routes
│   │   │   └── socket/      # Socket.IO routes
│   │   ├── dashboard/       # Main chat interface
│   │   ├── login/           # Login page
│   │   ├── register/        # Registration page
│   │   ├── profile/         # User profile page
│   │   ├── settings/        # Settings page
│   │   └── layout.tsx       # Root layout
│   ├── context/             # React contexts (Auth, Socket)
│   ├── stores/              # Zustand stores
│   ├── utils/               # Utility functions
│   └── generated/           # Prisma-generated client
├── prisma/
│   └── schema.prisma        # Database schema
├── public/                  # Static assets
├── .env                     # Environment variables
├── next.config.js           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── package.json
```

## Testing

To run the application:

1. Ensure PostgreSQL is running locally
2. Run the development server: `npm run dev`
3. Access the application at `http://localhost:3000`

## Deployment

### Vercel (Recommended)

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Configure your database connection for production

### Docker (Alternative)

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000
CMD ["npm", "run", "start"]
```

## API Routes

- `POST /api/auth?type=login` - User login
- `POST /api/auth?type=register` - User registration
- `POST /api/upload` - File upload
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `DELETE /api/profile` - Delete user account

## Database Schema

The application uses the following models:

- **User**: User account information
- **Chat**: Individual or group chat rooms
- **Message**: Chat messages
- **ChatMembership**: User-chat relationships
- **UserStatus**: User online status

## Socket Events

- `join`: User joins the system
- `privateMessage`: Send a private message
- `groupMessage`: Send a group message
- `typingStart` / `typingStop`: Typing indicators
- `messageRead`: Mark message as read
