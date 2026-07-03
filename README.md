# Vama Illustrations

A full-stack portfolio and business management web application built for an Indian Wedding Illustration Studio. It features a beautiful, glassmorphic customer-facing portfolio and a comprehensive, secure admin dashboard for managing galleries, enquiries, and orders.

## ✨ Features

### Customer-Facing Portfolio
- **Stunning UI**: Modern glassmorphic design, smooth micro-animations using Framer Motion, and responsive layouts.
- **Dynamic Gallery**: View featured illustration portfolios fetched dynamically from the database.
- **Contact System**: Clients can submit enquiries directly. Supports both direct email dispatch and WhatsApp deep-linking.
- **Theme Toggling**: Full Light/Dark mode support.

### Admin Dashboard (Secure Access)
- **Portfolio Management**: Upload, edit, delete, and feature gallery images (images stored in Supabase).
- **Enquiry Management**: Track client enquiries, add custom notes, update statuses, and convert them to orders.
- **One-Click Communication**: 
  - **Email**: Trigger SMTP emails directly to clients from the dashboard.
  - **WhatsApp**: Auto-compile WhatsApp messages using backend templates and open a direct chat.
- **Analytics & Revenue Tracking**: Interactive pie charts and status summaries for business operations.
- **Studio Planner**: A built-in calendar planner with sticky notes.

## 🛠 Tech Stack

### Frontend
- **React.js** (Vite)
- **Tailwind CSS** (Styling)
- **Framer Motion** (Animations)
- **Supabase JS Client** (For image bucket storage)

### Backend
- **Django** & **Django REST Framework (DRF)**
- **SQLite3** (Database)
- **SMTP** (For automated email sending)

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- A Supabase Project (for the `galleries` storage bucket)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd vama_illustration
```

### 2. Backend (Django) Setup
```bash
cd server

# Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate  # On Windows

# Install dependencies
pip install -r requirements.txt

# Run Migrations
python manage.py migrate

# Create a Superuser (Admin)
python manage.py createsuperuser

# Run the backend server
python manage.py runserver
```

**Backend Environment Variables:**
Create a `.env` file in the `server/` directory:
```env
DJANGO_SECRET_KEY=your_secret_key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=vamaillustrations@gmail.com
EMAIL_HOST_PASSWORD=your_app_password
DEFAULT_FROM_EMAIL=vamaillustrations@gmail.com
```

### 3. Frontend (React/Vite) Setup
```bash
cd client

# Install dependencies
npm install

# Run the development server
npm run dev
```

**Frontend Environment Variables:**
Create a `.env` file in the `client/` directory:
```env
VITE_API_URL=http://localhost:8000/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📂 Project Structure

- `/client` - Contains the React frontend application.
  - `/src/pages` - Page components (Home, Contact, AdminDashboard).
  - `/src/components` - Reusable UI components (Header, Footer).
  - `/src/lib` - API wrappers and Supabase client configuration.
- `/server` - Contains the Django REST API backend.
  - `/api` - Django app containing views, models, and serializers.
  - `/templates` - Backend text/HTML templates (Email and WhatsApp templates).

## 📝 Customizing Templates

- **Email Template**: Modifiable at `server/templates/emails/mailing_template.html`
- **WhatsApp Template**: Modifiable at `server/templates/whatsapp_template.txt`
