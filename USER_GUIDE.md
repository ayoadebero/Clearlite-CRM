# Clearlite CRM - User Guide

## Table of Contents

- [Getting Started](#getting-started)
- [How to Use the Clearlite CRM](#how-to-use-the-clearlite-crm)
- [User Roles](#user-roles)
- [Features Guide](#features-guide)

---

## Getting Started

### System Requirements

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Running the Application

#### 1. Start the Backend Server

Open a terminal and navigate to the backend directory:

```bash
cd backend
npm run dev
```

The API server will start on **<http://localhost:3001>**

#### 2. Start the Frontend Server

Open a new terminal in the project root:

```bash
npm run dev
```

The React application will start on **<http://localhost:5173>**

#### 3. Access the Application

Open your browser and go to **<http://localhost:5173>**

### Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | <admin@clearlitesolutionllc.com> | Admin@2024 |
| **User** | <john.doe@clearlitesolutionllc.com> | User@2024 |
| **Inputer** | <inputer@clearlitesolutionllc.com> | Inputer@2024 |
| **Authorizer** | <authorizer@clearlitesolutionllc.com> | Authorizer@2024 |

> **Security Note**: Change these default passwords immediately after first login.

---

## How to Use the Clearlite CRM

### Logging In

1. Navigate to **<http://localhost:5173>**
2. Enter your email and password
3. Click **"Sign In"**
4. You'll be redirected to the dashboard

### Dashboard Overview

The dashboard provides:

- **Quick Stats**: Total customers, active/inactive counts
- **Recent Activity**: Latest customer interactions
- **Navigation Menu**: Access to all Clearlite CRM features

### Managing Customers

#### Viewing Customers

1. Click **"Customers"** in the navigation menu
2. Browse the customer list
3. Use the search bar to find specific customers
4. Filter by status (Active/Inactive/Pending)

#### Adding a New Customer

1. Click **"Add Customer"** button
2. Fill in the customer details:
   - **Name**: Customer's full name
   - **Email**: Contact email address
   - **Phone**: Contact phone number
   - **Company**: Company name (optional)
   - **Status**: Active or Inactive
3. Click **"Save Customer"**

> **Note for Inputers**: Your added customers will enter "Pending Approval" status and require authorization before becoming active.

#### Editing a Customer

1. Click on a customer from the list
2. Click the **"Edit"** button
3. Update the necessary fields
4. Click **"Save Changes"**

#### Logging Calls

1. Open a customer's detail page
2. Click **"Log Call"**
3. Enter call details:
   - **Date & Time**
   - **Duration**
   - **Notes/Summary**
   - **Outcome**
4. Click **"Save Call Log"**

### Managing Users (Admin Only)

#### Adding a New User

1. Navigate to **"Settings"** → **"User Management"**
2. Click **"Add User"**
3. Enter user information:
   - **Full Name**
   - **Email**
   - **Role** (Admin, User, Inputer, Authorizer)
   - **Initial Password**
4. Click **"Create User"**

#### Editing Users

1. Go to **"User Management"**
2. Click on a user to edit
3. Modify details or change role
4. Click **"Update User"**

### Changing Your Password

1. Click your profile icon (top-right)
2. Select **"Change Password"**
3. Enter:
   - Current password
   - New password
   - Confirm new password
4. Click **"Update Password"**

---

## User Roles

### 🔴 Admin

**Full System Access**

- View, add, edit, and delete customers
- Manage all users (create, edit, delete)
- Approve or reject pending customers
- Access all system settings
- View all reports and analytics

### 🟢 User (Standard)

**Read-Only Access**

- View approved customers only
- View call logs
- Cannot add or edit customers
- Cannot manage users
- Limited settings access

### 🟡 Inputer (Maker)

**Data Entry Role**

- Add new customers (enters Pending Approval status)
- View own pending submissions
- View approved customers
- Log calls on approved customers
- **Cannot approve own entries**

### 🔵 Authorizer (Checker)

**Approval Role**

- View all pending customers
- Approve or reject customer additions
- View and edit approved customers
- Cannot add customers directly
- Acts as quality control

---

## Features Guide

### Maker-Checker Workflow

The Clearlite CRM implements a **dual-approval process** for data integrity:

#### Step 1: Inputer Adds Customer

1. **Inputer** logs in
2. Clicks **"Add Customer"**
3. Fills in customer details
4. Saves → Customer status becomes **"Pending Approval"**

#### Step 2: Authorizer Reviews

1. **Authorizer** or **Admin** logs in
2. Navigates to **"Pending Approvals"** tab
3. Reviews customer details
4. Clicks either:
   - **"Approve"** → Customer becomes Active
   - **"Reject"** → Customer is archived/removed

#### Benefits

- ✅ Prevents duplicate entries
- ✅ Ensures data quality
- ✅ Creates audit trail
- ✅ Separates duties for compliance

### Call Logging

Track all customer interactions:

- **Automated Timestamps**: Precise date/time recording
- **Call Duration**: Track conversation length
- **Detailed Notes**: Record discussion points
- **Outcome Tracking**: Mark calls as successful/follow-up needed
- **History View**: See complete interaction timeline

### Search & Filtering

Find customers quickly:

- **Name Search**: Search by customer name
- **Email Search**: Find by email address
- **Company Filter**: Group by company
- **Status Filter**: Active, Inactive, Pending
- **Advanced Filters**: Combine multiple criteria

### Settings & Customization

Personalize your experience:

- **Theme Settings**: Light/Dark mode
- **Notification Preferences**: Email/In-app alerts
- **Display Options**: List/Grid view
- **Export Settings**: CSV/Excel format preferences

### Security Features

- **JWT Authentication**: Secure token-based sessions
- **Password Hashing**: Bcrypt encryption (cannot be reversed)
- **Session Timeout**: Auto-logout after inactivity
- **Role-Based Access**: Permission-based feature access
- **Audit Logs**: Track all user actions (Admin view)

---

## Troubleshooting

### Cannot Login

- Verify credentials are correct
- Check if account is active (contact admin)
- Clear browser cache and cookies
- Ensure backend server is running

### Customer Not Appearing

- Check your role permissions
- Verify customer approval status
- Refresh the page
- Check active filters

### Changes Not Saving

- Check internet connection
- Verify you have edit permissions
- Ensure all required fields are filled
- Check backend server status

### Database Issues

If you encounter database errors, reset the database:

```bash
cd backend
npm run seed
```

> **Warning**: This will delete all data and restore defaults.

---

## Support

For additional help or to report issues:

- **Email**: <support@clearlitesolutionllc.com>
- **Phone**: Contact your system administrator
- **Documentation**: Refer to technical walkthrough for advanced configuration

---

## Appendix: Technical Walkthrough

### Architecture Overview

- **Frontend**: React + TypeScript + Vite (Port 5173)
- **Backend**: Node.js + Express + TypeScript (Port 3001)
- **Database**: PostgreSQL (Port 5432)
- **Authentication**: JWT Tokens + bcrypt password hashing

### Database Management

#### Reset Database

```bash
cd backend
npm run seed
```

#### Build for Production

```bash
# Frontend
npm run build

# Backend
cd backend
npm run build
npm start
```

### Environment Configuration

The application uses environment variables stored in `.env` files:

#### Backend `.env`

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=clearlite_crm
JWT_SECRET=your_secret_key
PORT=3001
```

#### Frontend Configuration

Vite proxy is configured in `vite.config.ts` to route `/api` requests to the backend server.

### Security Notes

- **Environment Variables**: Never commit `.env` files to version control
- **Password Safety**: Passwords are hashed and never returned in API responses
- **Role-Based Access**: Admin-only routes are protected by middleware
- **Token Expiry**: JWT tokens expire after 24 hours (configurable)

---

*Last Updated: December 2025*
