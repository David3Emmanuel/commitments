# Commitment Manager

A web application designed to help users track and manage open-ended commitments—projects, goals, or responsibilities that require regular check-ins but cannot simply be marked "done."

## Overview

Unlike one-off tasks or habits with fixed schedules, commitments often involve multiple sub-items (tasks, habits, notes) and flexible review rhythms. This application helps you stay on top of your long-term commitments by providing structured management and review processes.

## Key Features

- **Commitments Dashboard**: View all active commitments, upcoming reviews, and recent activity
- **Commitment Detail View**:
  - Title & Description
  - Review Frequency (weekly, monthly, custom)
  - Sub-items tracking (tasks, habits)
  - Notes section for progress logs
- **Review Workflow**: Guided flow to review commitments, update sub-items, and log progress
- **Reminders & Notifications**: Alerts for approaching review dates or overdue items
- **Analytics & Progress**: Charts showing review completion, tasks closed, and habit streaks

## Technical Stack

- **Frontend**: React with React Router v7, TypeScript, Tailwind CSS
- **Storage**: Local storage (MVP), MongoDB (future)
- **Backend**: NestJS (planned for post-MVP)
- **Auth**: Auth0 or custom JWT (planned)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t commitment-manager .

# Run the container
docker run -p 3000:3000 commitment-manager
```

---

Built with React Router and designed to help you keep your commitments.
