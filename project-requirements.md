**Commitment Manager Web App**

**1. Overview**
A Commitment Manager is a web application designed to help users track and manage open-ended commitments—projects, goals, or responsibilities that require regular check‑ins but cannot simply be marked "done." Unlike one-off tasks or habits with fixed schedules, commitments often involve multiple sub‑items (tasks, habits, notes) and flexible review rhythms.

**2. Key Features**

- **Commitments Dashboard**: A consolidated view listing all active commitments, upcoming reviews, and recent activity.
- **Commitment Detail View**:

  - Title & Description
  - Review Frequency (e.g., weekly, monthly, custom)
  - Last Reviewed Date & Next Review Due
  - Sub‑items:

    - One‑off Tasks (with due dates, statuses)
    - Recurring Tasks / Habits (with tracking history)
    - Task Dependencies (tasks that depend on other tasks)

  - Notes section (free‑form updates, progress logs)

- **Review Workflow**: A guided flow that reminds the user to review a commitment, prompts for updates on sub‑items, and logs the review date.
- **Reminders & Notifications**: Email or in‑app alerts when a review date approaches or sub‑items are overdue.
- **Auto-Scheduler**: Intelligent scheduling system that suggests optimal dates for tasks based on dependencies, due dates, and user availability.
- **Analytics & Progress**: Simple charts showing number of reviews completed, tasks closed, and habit streaks per commitment.
- **Search & Filter**: Find commitments by keywords, filter by status (active/archived), or by next review date.
- **Calendar Integration**: Synchronize commitments, reviews, and tasks with external calendar services (starting with Google Calendar).

**3. User Stories**

1. _As a user, I want to create a new commitment with a description and review frequency so I can track its progress._
2. _As a user, I want to add and manage sub‑tasks and habits under a commitment so I can break it into actionable pieces._
3. _As a user, I want to be notified when it's time to review a commitment so I don't forget to check in._
4. _As a user, I want to log notes during each review so I have a history of my progress._
5. _As a user, I want to view analytics to see how consistently I’m reviewing and progressing on my commitments._
6. _As a user, I want to set up task dependencies so that I can visualize and manage the sequential nature of my work._
7. _As a user, I want an auto-scheduler to suggest optimal times for my tasks based on dependencies, priorities, and estimated durations._
8. _As a user, I want to search and filter my commitments so I can quickly find the ones I need to focus on._
9. _As a user, I want to synchronize my commitments and tasks with my external calendar so I can manage all my time commitments in one place._
10. _As a user, I want to archive completed commitments so I can keep my active list manageable while preserving my history._
11. _As a user, I want to create an account and log in securely so my commitments are saved and accessible from any device._

**4. Data Model**

```json
// Commitment entity
goal: {
  id: string,
  title: string,
  description: string,
  createdAt: Date,
  reviewFrequency: { type: 'interval' | 'custom', intervalDays?: number, customCron?: string },
  lastReviewedAt: Date | null,
  subItems: {
    tasks: Task[],    // one‑off tasks
    habits: Habit[]   // recurring habits
  },
  notes: Note[],
  status: 'active' | 'archived'
}

Task: {
  id: string,
  title: string,
  dueAt: Date,
  completed: boolean,
  dependsOn: string[],  // Array of task IDs this task depends on
  estimatedDuration: number,  // In minutes, used by auto-scheduler
  priority: 'low' | 'medium' | 'high'
}
Habit: { id, title, schedule: 'daily'|'weekly'|..., history: Date[] }
Note: { id, content, timestamp }
```

**5. UI/UX Sketch**

- **Landing Page**: Brief intro, benefits, and CTA to sign up or log in. (not part of MVP)
- **Dashboard**: Card grid or list of commitments showing title, next review date, progress indicator.
- **Add/Edit Commitment Modal**: Form fields for title, description, frequency.
- **Commitment Detail Page**: Tabs or sections for Sub‑items, Notes, Analytics.
  - **Task Dependencies View**: Visual graph showing task relationships and critical paths.
  - **Auto-Scheduler Interface**: Calendar view with suggested task timings and ability to adjust.
- **Review Flow Modal**: Step‑by‑step wizard: Update sub‑items → Add notes → Confirm review.

**6. Tech Stack**

- **Frontend**: React (React Router v7), TypeScript, Tailwind CSS
- **Backend**: NestJS after MVP
- **Database**: Local storage for MVP and MongoDB afterwards
- **Auth**: Auth0 or custom JWT auth
- **Notifications**: Node cron jobs + email service (SendGrid) or Firebase Cloud Functions.
- **Hosting**: Vercel (frontend/API), Render (backend)

**7. Milestones & Roadmap**

- **MVP (2 weeks)**:

  1. Local storage (no auth)
  2. Create/Edit/Delete commitments
  3. Add sub‑items (tasks & habits)
  4. Dashboard & detail pages

- **Phase II (2 weeks)**:

  1. User auth & onboarding
  2. Task dependencies and dependency visualization
  3. Auto-scheduler with intelligent task timing
  4. Review workflow & logging
  5. Reminders/notifications

- **Phase III (2 weeks)**:

  1. Analytics & reports
  2. Search, filters, archiving
  3. External calendar integrations (Google Calendar first)
