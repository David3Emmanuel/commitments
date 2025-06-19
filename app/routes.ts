import {
  type RouteConfig,
  index,
  prefix,
  route,
} from '@react-router/dev/routes'

export default [
  index('routes/dashboard.tsx'),
  ...prefix('commitments', [
    route('new', './routes/commitments/new.tsx'),
    route(':id', './routes/commitments/detail.tsx'),
    route(':id/edit', './routes/commitments/edit.tsx'),
    route(':id/review', './routes/commitments/review.tsx'),
  ]),
  route('settings', './routes/settings.tsx'),
] satisfies RouteConfig
