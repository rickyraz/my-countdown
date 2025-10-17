# My Countdown App

A comprehensive countdown application built with TanStack Start, featuring real-time countdown tracking with the Temporal API and beautiful TailwindCSS styling.

## Features

- **Create Countdowns**: Add new countdowns with title, optional description, and target date/time
- **Real-time Updates**: Live countdown timer that updates every second using the Temporal API
- **Edit & Delete**: Easily manage your countdowns with edit and delete functionality
- **Beautiful UI**: Modern, responsive design with TailwindCSS
- **Persistent Storage**: Uses TanStack Store for state management
- **Server Functions**: Built with TanStack Start server functions for data operations

## Tech Stack

- **TanStack Start**: Full-stack React framework
- **TanStack Router**: Type-safe routing
- **TanStack Query**: Data fetching and caching
- **TanStack Store**: State management
- **Temporal API**: Precise date/time calculations
- **TailwindCSS**: Styling
- **TypeScript**: Type safety

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

### Production

```bash
npm run start
```

## Project Structure

```
my-countdown/
├── app/
│   ├── components/          # React components
│   │   ├── CountdownCard.tsx
│   │   └── CountdownForm.tsx
│   ├── db/                  # Database schema and operations
│   │   └── schema.ts
│   ├── routes/              # Route files
│   │   ├── __root.tsx
│   │   └── index.tsx
│   ├── server/              # Server functions
│   │   └── functions/
│   │       └── countdown.ts
│   ├── styles/              # Global styles
│   │   └── globals.css
│   ├── utils/               # Utility functions
│   │   └── temporal.ts
│   ├── client.tsx           # Client entry point
│   ├── router.tsx           # Router configuration
│   └── ssr.tsx              # SSR entry point
├── app.config.ts            # App configuration
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── postcss.config.js
```

## Usage

1. **Create a Countdown**: Click the "Create New Countdown" button
2. **Fill in Details**: Enter title, optional description, and target date/time
3. **View Countdown**: See your countdown update in real-time
4. **Edit**: Click the edit icon to modify a countdown
5. **Delete**: Click the delete icon to remove a countdown

## Temporal API

This app uses the Temporal API polyfill for precise date/time calculations. The Temporal API provides:

- Accurate duration calculations
- Time zone support
- Clear separation of date, time, and duration concepts
- Better handling of edge cases compared to the Date API

## License

MIT
