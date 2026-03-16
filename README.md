# Carpet and Upholstery Cleaning Services Marketplace

A React frontend marketplace where customers can find carpet and upholstery cleaning experts, view services, and book through PayPal. The app supports role-based flows for customers, sellers, and admins.

## Project Structure

- Root folder contains this README and workspace-level files.
- Main frontend app is inside `frontend/`.
- Redux architecture is inside `frontend/src/redux/`:
	- `constants/`
	- `actions/`
	- `reducers/`
	- `store.js`

## Tech Stack

- React.js
- React Router
- Redux
- React Bootstrap + Bootswatch
- Create React App tooling

## Features

### Customer Features

- Browse cleaning services on the home page.
- View service details.
- Book services through PayPal checkout.
- View profile information and booking history.

### Seller Features

- Apply as a cleaning expert (requires admin approval).
- Access seller dashboard after approval.
- Add new cleaning services.
- Manage existing services:
	- View
	- Edit
	- Delete

### Admin Features

- Access admin-only user management page.
- Manage users:
	- Edit
	- Delete
- Review seller applications:
	- Approve (requires `merchant_id`)
	- Decline (requires `reason_for_decline`)

### AI Chatbot

- Basic in-app chatbot for project-related questions only.
- Supports common user questions about:
	- Booking
	- Seller application
	- Payments
	- Service duration

## Route Protection

Protected pages require login and redirect to `/signin` when unauthenticated:

- `/profile`
- `/seller/dashboard`
- `/apply-seller`
- `/admin/users`

Additional role protection:

- Admin-only: `/admin/users`
- Seller-only: `/seller/dashboard`

## PayPal Booking Behavior

When a customer books a service:

- Payment is directed to the seller PayPal account.
- Platform facilitates and tracks transaction metadata.
- PayPal order description uses **service name only**.
- Full service description is not used as order description.

## Getting Started

### 1) Install Dependencies

Run commands from the frontend app folder:

```powershell
cd frontend
npm install
```

### 2) Run Development Server

```powershell
cd frontend
npm start
```

Open http://localhost:3000

### 3) Build for Production

```powershell
cd frontend
npm run build
```

## Demo Admin Account

Auto-seeded on app startup if no admin exists:

- Email: `admin@cleanlink.com`
- Password: `Admin12345`

## Available Scripts (inside `frontend/`)

- `npm start` - Run development server
- `npm run build` - Build production assets
- `npm test` - Run tests

