# Stripe SaaS Application
### A full-stack SaaS application with authentication, subscription management, and payment processing built with Next.js, NestJS, and Stripe.

## Features
User Authentication: JWT-based auth with Argon2 password hashing
Subscription Management: Monthly/Yearly plans with Stripe integration
Payment Processing: One-time payments and recurring subscriptions
Transaction History: Complete payment tracking and management
Modern Tech Stack: Next.js 14, NestJS, MongoDB, TypeScript
Responsive UI: Built with Tailwind CSS and shadcn/ui components
State Management: Zustand for client state, TanStack Query for server state

## Tech Stack
### Frontend
Next.js 14 - React framework with App Router
TypeScript - Type safety
Tailwind CSS - Utility-first CSS framework
shadcn/ui - Component library
Zustand - State management
TanStack Query - Data fetching and caching
Axios - HTTP client

### Backend
NestJS - Node.js framework
MongoDB - Database
Mongoose - ODM
Stripe - Payment processing
JWT - Authentication
Argon2 - Password hashing
Docker - Containerization

### Prerequisites
Before running this application, make sure you have:
Node.js (v18 or higher)
MongoDB (local or Atlas)
Stripe Account (Sign up here)
Docker (optional, for containerization)

## Installation
### 1 Clone Repository
```bash
git clone https://github.com/Chinweike99/stripe-integration.git
cd stripe-integration
```
### 2 Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### 3 Frontend setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
```
## 4. Stripe Configuration
```bash
Create a Stripe Account at stripe.com

Get API Keys from Stripe Dashboard

Set Up Webhooks:

Go to Stripe Webhooks

Add endpoint: http://localhost:3000/stripe/webhook

Select events:

checkout.session.completed

payment_intent.succeeded

payment_intent.payment_failed

customer.subscription.created

customer.subscription.updated

customer.subscription.deleted

invoice.payment_succeeded

Copy the webhook secret to your backend .env
```

## Docker Setup (Optional)
### Using Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```


## Running the Application
### Development Mode
#### Backend
```bash
cd backend
npm run start:dev
```

### Frontend
```bash
cd frontend
npm run dev
```

```bash
Application URLs
Frontend: http://localhost:3001

Backend API: http://localhost:4000

API Documentation: http://localhost:3000/api

MongoDB: localhost:27017

🧪 Testing
Stripe Test Cards
Use these test card numbers in Stripe Checkout:

Card Number	Description
4242 4242 4242 4242	Visa (successful payment)
4000 0000 0000 0002	Visa (payment declined)
5555 5555 5555 4444	Mastercard
2222 2222 2222 2222	Mastercard (2-series)
Other test details:

Expiry: Any future date

CVC: Any 3 digits

ZIP: Any 5 digits
```

## Payment Flow Demonstration

![Stripe Checkout Interface](/images/checkout.png)

![Stripe Payment Confirmation](/images/stripepaysuccess.png)

![Application Success Notification](/images/stripepaysuccss.png)

![Stripe Dashboard - Transactions View](/images/stripeTransactions.png)

![Stripe Webhook Setup](/images/stripewebhook.png)




