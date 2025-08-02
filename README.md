# 🚀 AppOrbit - Digital Product Marketplace

[![React](https://img.shields.io/badge/React-18.0.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.0.0-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0.0-yellow.svg)](https://mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **Empowering developers and creators to showcase, discover, and collaborate on innovative products in a vibrant, AI-powered community.**

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

## 🎯 Overview

AppOrbit is a modern, full-stack web platform designed for digital product creators, developers, and tech enthusiasts. It provides a comprehensive marketplace where users can showcase their digital products, discover innovative solutions, and build meaningful connections within the tech community.

### Core Mission
- **Connect**: Bring together creators and consumers in a collaborative ecosystem
- **Innovate**: Leverage AI-powered features for enhanced product discovery
- **Grow**: Provide tools and analytics for creators to scale their reach
- **Quality**: Maintain high standards through verification and moderation systems

## ✨ Key Features

### 🎨 Frontend Excellence
- **Immersive 3D Animations**: Interactive backgrounds and UI elements powered by React Three Fiber
- **Responsive Design**: Seamless experience across all devices and screen sizes
- **Modern UI/UX**: Clean, intuitive interface with smooth animations and transitions
- **Real-time Updates**: Dynamic content updates without page refreshes

### 🔐 Authentication & Security
- **Multi-Provider Auth**: Email/password and Google OAuth integration
- **JWT Token Management**: Secure, stateless authentication
- **Role-Based Access Control**: User, Moderator, and Admin roles
- **Protected Routes**: Secure access to dashboard and admin features

### 🛍️ Marketplace Features
- **Product Discovery**: Advanced search and filtering capabilities
- **Voting System**: Community-driven product ranking
- **Featured Products**: Curated showcase of top-quality products
- **Trending Analytics**: Real-time popularity tracking

### 👑 Verification System
- **Premium Seller Badge**: One-time $50 verification for enhanced credibility
- **Priority Listing**: Verified products appear higher in search results
- **Advanced Analytics**: Detailed insights into product performance
- **Premium Support**: Dedicated customer service for verified sellers
- **Multiple Payment Options**: Stripe (International) and SSL Commerz (Bangladesh) support

### 🎫 Coupon Management
- **Discount Codes**: Flexible coupon system for verification payments
- **Admin Controls**: Comprehensive coupon management for administrators
- **User Benefits**: Easy application of discount codes during checkout

### 🛠️ Admin & Moderation
- **User Management**: Complete user administration tools
- **Content Moderation**: Review queue for reported content
- **Analytics Dashboard**: Comprehensive platform statistics
- **Coupon Administration**: Create and manage discount codes

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.x | Core UI framework |
| **Vite** | 4.x | Build tool and dev server |
| **Tailwind CSS** | 3.x | Utility-first CSS framework |
| **Framer Motion** | 10.x | Animation library |
| **React Three Fiber** | 8.x | 3D graphics and animations |
| **React Router** | 6.x | Client-side routing |
| **Axios** | 1.x | HTTP client |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18.x | Runtime environment |
| **Express.js** | 4.x | Web framework |
| **MongoDB** | 6.x | NoSQL database |
| **JWT** | 9.x | Authentication tokens |
| **Cloudinary** | 1.x | Image upload service |
| **Stripe** | 12.x | Payment processing |
| **SSL Commerz** | 4.x | Payment gateway (Bangladesh) |

### Development Tools
- **ESLint**: Code quality and consistency
- **DaisyUI**: Component library for Tailwind CSS
- **SweetAlert2**: Beautiful alert dialogs
- **Recharts**: Data visualization library

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16.0.0 or higher)
- **npm** (v8.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **MongoDB** (local instance or cloud service)
- **Git** (for version control)

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/Programming-Hero-Web-Course4/b11a12-client-side-tazminur12.git
cd AppOrbit
```

#### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
The frontend will be available at [http://localhost:5173](http://localhost:5173)

#### 3. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

#### 4. Environment Configuration

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:5173

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/apporbit
DB_NAME=apporbit

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Stripe Configuration (for payments)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# SSL Commerz Configuration (for payments)
SSL_COMMERZ_STORE_ID=your_ssl_commerz_store_id
SSL_COMMERZ_STORE_PASSWORD=your_ssl_commerz_store_password
SSL_COMMERZ_IS_SANDBOX=true
SSL_COMMERZ_SUCCESS_URL=http://localhost:5173/payment/success
SSL_COMMERZ_FAIL_URL=http://localhost:5173/payment/fail
SSL_COMMERZ_CANCEL_URL=http://localhost:5173/payment/cancel
```

#### 5. Start Backend Server
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```
The backend API will be available at [http://localhost:5000](http://localhost:5000)

## 📁 Project Structure

```
AppOrbit/
├── 📁 backend/                 # Backend API server
│   ├── 📁 controllers/         # Route controllers
│   ├── 📁 middleware/          # Custom middleware
│   ├── 📁 models/              # Database models
│   ├── 📁 routes/              # API routes
│   ├── 📁 utils/               # Utility functions
│   ├── package.json
│   └── README.md
├── 📁 public/                  # Static assets
│   ├── 📁 fonts/               # Custom fonts
│   └── 📁 images/              # Static images
├── 📁 src/                     # Frontend source code
│   ├── 📁 components/          # Reusable UI components
│   │   ├── 📁 3D/             # 3D animation components
│   │   ├── 📁 UI/             # Basic UI components
│   │   └── 📁 Layout/         # Layout components
│   ├── 📁 context/             # React context providers
│   ├── 📁 hooks/               # Custom React hooks
│   ├── 📁 layouts/             # Page layout components
│   ├── 📁 pages/               # Page components
│   │   ├── 📁 Auth/           # Authentication pages
│   │   ├── 📁 Dashboard/       # Dashboard pages
│   │   ├── 📁 Home/           # Home page components
│   │   └── 📁 Products/       # Product-related pages
│   ├── 📁 routes/              # Route definitions
│   ├── 📁 utils/               # Utility functions
│   └── 📁 firebase/            # Firebase configuration
├── package.json
├── vite.config.js
└── README.md
```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | User registration | No |
| `POST` | `/api/auth/login` | User login | No |
| `POST` | `/api/auth/logout` | User logout | Yes |

### User Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/users/profile/:email` | Get user profile | Yes |
| `PATCH` | `/api/users/profile/:email` | Update user profile | Yes |
| `GET` | `/api/users` | Get all users (Admin) | Yes |
| `DELETE` | `/api/users/:id` | Delete user (Admin) | Yes |

### Product Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/products` | Get all products | No |
| `POST` | `/api/products` | Create new product | Yes |
| `PUT` | `/api/products/:id` | Update product | Yes |
| `DELETE` | `/api/products/:id` | Delete product | Yes |

### Payment & Verification

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/payments/create-payment-intent` | Create payment intent | Yes |
| `POST` | `/api/payments/confirm-payment` | Confirm payment | Yes |
| `POST` | `/api/payments/ssl-commerz/init` | Initialize SSL Commerz payment | Yes |
| `POST` | `/api/payments/ssl-commerz/success` | SSL Commerz success callback | No |
| `POST` | `/api/payments/ssl-commerz/fail` | SSL Commerz failure callback | No |
| `POST` | `/api/payments/ssl-commerz/cancel` | SSL Commerz cancel callback | No |

For detailed API documentation, see [backend/README.md](backend/README.md).

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**:
   ```bash
   npm install -g vercel
   vercel
   ```

3. **Deploy to Netlify**:
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

### Backend Deployment (Railway/Render)

1. **Environment Variables**: Set all required environment variables
2. **Database**: Use MongoDB Atlas for production
3. **Deploy**: Connect your repository and deploy

### Environment Variables for Production

```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
FRONTEND_URL=https://your-frontend-domain.com

# Payment Configuration
STRIPE_SECRET_KEY=your_production_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_production_stripe_publishable_key
SSL_COMMERZ_STORE_ID=your_production_ssl_commerz_store_id
SSL_COMMERZ_STORE_PASSWORD=your_production_ssl_commerz_store_password
SSL_COMMERZ_IS_SANDBOX=false
SSL_COMMERZ_SUCCESS_URL=https://your-domain.com/payment/success
SSL_COMMERZ_FAIL_URL=https://your-domain.com/payment/fail
SSL_COMMERZ_CANCEL_URL=https://your-domain.com/payment/cancel
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Development Process

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes** and commit them:
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**:
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Code Standards

- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

### Reporting Issues

When reporting bugs, please include:
- **Environment**: OS, Node.js version, browser
- **Steps to reproduce**: Clear, step-by-step instructions
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Screenshots**: If applicable

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📬 Contact & Support

### Project Lead
- **Name**: Tazminur Rahman
- **Email**: [tanimkhalifa55@gmail.com](mailto:tanimkhalifa55@gmail.com)
- **GitHub**: [@tazminur12](https://github.com/tazminur12)

### Project Links
- **Repository**: [GitHub](https://github.com/Programming-Hero-Web-Course4/b11a12-client-side-tazminur12)
- **Live Demo**: [AppOrbit](https://apporbit-demo.vercel.app)
- **Backend API**: [API Documentation](backend/README.md)

### Community
- **Discussions**: [GitHub Discussions](https://github.com/Programming-Hero-Web-Course4/b11a12-client-side-tazminur12/discussions)
- **Issues**: [GitHub Issues](https://github.com/Programming-Hero-Web-Course4/b11a12-client-side-tazminur12/issues)

---

<div align="center">

**🌟 Star this repository if you find it helpful!**

*Building the future of web applications with cutting-edge technology and user-centric design.*

</div>
