# Future Enhancements

This project is intentionally kept simple for academic demonstration. Below are realistic next steps if this were to be extended into a production-grade application.

## 1. Backend API

Replace the `src/services/` localStorage functions with real HTTP calls to a backend, for example:
- **Node.js + Express.js** REST API
- Routes like `GET /api/projects`, `POST /api/tasks`, `PUT /api/tasks/:id`, `DELETE /api/tasks/:id`

Because the UI already goes through a service layer, this change would not require touching any page or component — only the files inside `src/services/`.

## 2. Real Database

Store data in a persistent database instead of the browser:
- **MongoDB** (document-based, maps closely to the current JSON shapes), or
- **MySQL/PostgreSQL** (relational, using foreign keys as described in `database-design.md`)

## 3. Authentication

- Real login/signup with hashed passwords
- **JWT (JSON Web Tokens)** for session management
- Protecting API routes so only logged-in users can modify data

## 4. Role-Based Access Control (RBAC)

- Different permissions for **Admin**, **Project Manager**, and **Team Member** roles
- For example, only managers can delete projects; team members can only update their own tasks

## 5. Notifications & Email Alerts

- Real email notifications (e.g. using Nodemailer or a service like SendGrid) for task assignments and approaching deadlines
- Scheduled jobs (e.g. using `node-cron`) to check for overdue tasks daily

## 6. Real-Time Collaboration

- WebSockets (e.g. Socket.IO) so that when one user updates a task, other users see the change live without refreshing

## 7. File Attachments

- Allow uploading files/screenshots to tasks (e.g. using cloud storage like AWS S3 or Cloudinary)

## 8. Cloud Deployment

- Deploy the frontend to **Vercel** or **Netlify**
- Deploy the backend to a cloud VM, **Render**, or **Railway**
- Use environment variables (see `.env.example`) to configure the API URL per environment

## 9. Testing

- Add unit tests for service functions (e.g. using Vitest)
- Add component tests (e.g. using React Testing Library)

## 10. Accessibility & Internationalization

- Full keyboard navigation and screen-reader support audit
- Support for multiple languages using a library like `react-i18next`
