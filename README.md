# 💥 Dynamite App

Dynamite App is a fitness platform designed to help users achieve their health and training goals through personalized workout and nutrition plans.

The application combines artificial intelligence, subscription plans, and e-commerce features to provide a complete fitness experience.

## 🚀 Features

### Authentication & User Management

* User registration and login
* JWT authentication
* User profile management
* Role-based access (User / Admin)

### AI-Powered Fitness Plans

* Personalized workout routines generated according to:

  * Age
  * Weight
  * Height
  * Fitness goals
* AI-generated nutrition plans
* Premium access through subscription plans

### Subscription System

* Multiple membership plans
* Secure checkout integration with Stripe
* Subscription management dashboard

### E-commerce Store

* Sports supplements catalog
* Shopping cart functionality
* Quantity management
* Stripe payment integration

### Admin Dashboard

* View registered subscribers
* Monitor active memberships
* Manage platform users

## 🛠 Tech Stack

### Frontend

* React
* React Router
* Bootstrap 5
* Context API

### Backend

* Flask
* SQLAlchemy
* JWT Authentication
* PostgreSQL

### External Services

* OpenAI API
* Stripe Payments
* Cloudinary


## 💳 Stripe Test Cards

To simulate payments in development mode, use Stripe's official test cards:

https://docs.stripe.com/testing?testing-method=card-numbers#visa


## ⚙️ Installation

### Backend Setup

Requirements:

* Python 3.10+
* Pipenv
* PostgreSQL

Install dependencies:

```bash
pipenv install
```

Create your environment file:

```bash
cp .env.example .env
```

Run migrations:

```bash
pipenv run migrate
pipenv run upgrade
```

Start the server:

```bash
pipenv run start
```


### Frontend Setup

Requirements:

* Node.js 20+

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run start
```

## 📊 Database Configuration

Example DATABASE_URL values:

| Database   | Example                                              |
| ---------- | ---------------------------------------------------- |
| SQLite     | sqlite:////test.db                                   |
| MySQL      | mysql://username:password@localhost:3306/database    |
| PostgreSQL | postgres://username:password@localhost:5432/database |


## 📸 Screenshots

* Landing Page
  
  <img width="1000" height="auto" alt="image" src="https://github.com/user-attachments/assets/90bb52e8-d43d-4f98-b326-b92acf7b9cbe" />
* Authentication
  
  <img width="1000" height="auto" alt="image" src="https://github.com/user-attachments/assets/76f3eb79-603a-4682-9041-2810a118895d" />
* AI Plan Generator
  
  <img width="1000" height="auto" alt="image" src="https://github.com/user-attachments/assets/d123e221-2023-4034-8836-a392e5b6df16" />
  <img width="1000" height="auto" alt="image" src="https://github.com/user-attachments/assets/214518b8-5e27-47c3-9bc1-2164187f1374" />
* Store
  
  <img width="1000" height="auto" alt="image" src="https://github.com/user-attachments/assets/c803d318-5fa7-4149-aa4b-4f217497c99a" />
* Admin Dashboard
  
  <img width="1000" height="auto" alt="image" src="https://github.com/user-attachments/assets/6209e25c-9137-4687-bf9f-56d33ed9cbdf" />
* Stripe Payments
  
  <img width="1000" height="auto" alt="image" src="https://github.com/user-attachments/assets/ff895c72-8f74-4941-baed-5e2afe9023b2" />


## 🔮 Future Improvements

* Password recovery via email
* Progress tracking charts
* Workout history
* Push notifications
* Mobile application
* Social features


## 👨‍💻 Author

Developed by me, Dylan and Mauri


LinkedIn: [Click here](https://www.linkedin.com/in/samuelpiedra/)

* Authentication
* AI Plan Generator
* Store
* Admin Dashboard
