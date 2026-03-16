# Carpet and Upholstery Cleaning Services Marketplace

Full-stack service marketplace for Carpet and Upholstery Cleaning.

The project includes:

- React frontend (marketplace UI, auth flows, dashboards, chatbot widget)
- Django REST backend (JWT auth, seller applications, services, orders, chatbot API)

## Project Structure

- `frontend/` - React application
- `backend/` - Django REST API

Frontend Redux architecture:

- `frontend/src/redux/constants/`
- `frontend/src/redux/actions/`
- `frontend/src/redux/reducers/`
- `frontend/src/redux/store.js`

Backend apps:

- `backend/users/`
- `backend/applications/`
- `backend/services/`
- `backend/orders/`
- `backend/chat/`

## Tech Stack

Frontend:

- React.js
- React Router
- Redux
- React Bootstrap + Bootswatch

Backend:

- Django
- Django REST Framework
- Simple JWT (`djangorestframework-simplejwt`)
- django-cors-headers

## Core Features

Customer:

- Browse and view services
- Book services via PayPal flow
- View profile and order history

Seller:

- Apply as cleaning expert
- Manage own services (add, view, edit, delete)

Admin:

- Manage users
- Review seller applications
- Approve with `merchant_id`
- Decline with `reason_for_decline`

AI Chat:

- In-app chatbot on frontend
- Backend chatbot API endpoint

## Route Protection

Protected frontend pages redirect to `/signin` if not authenticated:

- `/profile`
- `/seller/dashboard`
- `/apply-seller`
- `/admin/users`

Role guards:

- Admin-only: `/admin/users`
- Seller-only: `/seller/dashboard`

## PayPal Behavior

When booking:

- Payment target is seller PayPal account
- Platform stores transaction metadata in orders
- Order description uses service name
- Full description is not used as order description

## Frontend Setup

Run from project root:

1. `cd frontend`
2. `npm install`
3. `npm start`

Build frontend:

1. `cd frontend`
2. `npm run build`

Frontend local URL:

- `http://localhost:3000`

## Backend Setup

Run from project root:

1. `cd backend`
2. `py -m pip install -r requirements.txt`
3. `py manage.py makemigrations`
4. `py manage.py migrate`
5. `py manage.py runserver`

Backend local URL:

- `http://127.0.0.1:8000`

## Backend API Base Routes

- `/api/v1/users/`
- `/api/v1/applications/`
- `/api/v1/services/`
- `/api/v1/orders/`
- `/api/v1/chat/`

## Backend Endpoints

Users:

- `POST /api/v1/users/login/`
- `POST /api/v1/users/register/`
- `GET /api/v1/users/profile/`
- `GET /api/v1/users/admin/users/`

Applications:

- `POST /api/v1/applications/apply/`
- `GET /api/v1/applications/list/`
- `POST /api/v1/applications/<pk>/approve/`
- `POST /api/v1/applications/<pk>/decline/`

Services:

- `GET /api/v1/services/list/`
- `GET /api/v1/services/<pk>/`
- `GET|POST /api/v1/services/manage/`
- `GET|PUT|PATCH|DELETE /api/v1/services/manage/<pk>/`

Orders:

- `POST /api/v1/orders/create/`
- `GET /api/v1/orders/history/`

Chat:

- `POST /api/v1/chat/ask/`

## Quick Chat API Test

Example request:

`curl.exe -X POST "http://127.0.0.1:8000/api/v1/chat/ask/" -H "Content-Type: application/json" -d "{\"message\":\"How do I book a carpet cleaning service?\"}"`

## Common Issues

If backend root shows 404:

- Use `http://127.0.0.1:8000/` after running server
- API endpoints are under `/api/v1/...`

If `ModuleNotFoundError: corsheaders`:

- Install with `py -m pip install django-cors-headers`

If JWT package missing:

- Install with `py -m pip install djangorestframework-simplejwt`

## Demo Admin Account (Frontend)

Auto-seeded in frontend local storage:

- Email: `admin@cleanlink.com`
- Password: `Admin12345`

