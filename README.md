# Customer Management Dashboard

A complete full-stack web application for managing customers with comprehensive CRUD operations, real-time validation, and production-ready error handling.

## 📋 Project Overview

This project demonstrates a professional full-stack development approach with a React frontend and Node.js/Express backend. It implements all core requirements plus additional features like edit functionality, comprehensive error handling, and production deployment configuration.

### What We Built

A customer management system that allows users to:
- Add new customers with real-time validation
- View all customers in a responsive table
- View individual customer details
- Edit existing customer information
- Delete customers with confirmation dialogs
- Receive real-time feedback through toast notifications
- Handle errors gracefully with user-friendly messages

### Key Features

- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Real-time form validation (frontend & backend)
- ✅ Responsive design for all devices
- ✅ Error handling with detailed messages
- ✅ Loading states and visual feedback
- ✅ Global state management with Context API
- ✅ Production-ready deployment configuration
- ✅ In-memory data storage with auto-increment IDs

## 🏗️ Project Structure

```
customer-management-app/
├── Backend/                          # Node.js + Express API
│   ├── src/
│   │   ├── controllers/
│   │   │   └── customerController.ts (Business logic for CRUD operations)
│   │   ├── routes/
│   │   │   └── customerRoutes.ts     (API endpoint definitions)
│   │   ├── utils/
│   │   │   └── validation.ts         (Input validation logic)
│   │   └── index.ts                  (Express server setup & middleware)
│   ├── package.json
│   ├── tsconfig.json
│   └── render.yaml
│
├── Customer-Management/              # React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── CustomForm.jsx        (Reusable form component with validation)
│   │   │   ├── CustomTable.jsx       (Data table with actions)
│   │   │   └── Layout.jsx            (Main layout wrapper)
│   │   ├── context/
│   │   │   └── CustomerContext.jsx   (Global state management)
│   │   ├── pages/
│   │   │   ├── AddCustomerPage.jsx   (Add customer form page)
│   │   │   ├── EditCustomerPage.jsx  (Edit customer form page)
│   │   │   ├── ViewCustomerPage.jsx  (View customer details page)
│   │   │   └── CustomersTablePage.jsx (List all customers page)
│   │   ├── utils/
│   │   │   ├── apiEndpoints.js       (API configuration & URLs)
│   │   │   ├── makeApiRequest.js     (HTTP client with error handling)
│   │   │   ├── toast.js              (Toast notification utility)
│   │   │   └── validation.jsx        (Form validation rules)
│   │   ├── App.jsx                   (Main app component with routing)
│   │   └── main.jsx                  (React entry point)
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── .gitignore
└── README.md
```

## �️ Technology Stack

### Backend
- **Node.js** - JavaScript runtime for server-side execution
- **Express.js** - Lightweight web framework for building REST APIs
- **TypeScript** - Adds static typing for better code quality and error detection
- **CORS** - Enables cross-origin requests from frontend
- **In-Memory Storage** - Array-based data storage with auto-increment IDs

### Frontend
- **React 18** - UI library for building interactive components
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing for navigation between pages
- **Axios** - HTTP client for making API requests
- **Bootstrap 5** - CSS framework for responsive design
- **Context API** - React's built-in state management solution

## 🔧 Architecture & Design Patterns

### Backend Architecture

**MVC Pattern (Model-View-Controller)**
- **Controllers** (`customerController.ts`) - Business logic for CRUD operations
- **Routes** (`customerRoutes.ts`) - API endpoint definitions
- **Utilities** (`validation.ts`) - Reusable validation functions

**Error Handling Strategy**
- Global error handler middleware in `index.ts`
- Try-catch blocks in all controller functions
- Consistent error response format with status codes
- Detailed error messages for debugging

**Data Flow**
```
Request → Route → Controller → Validation → Business Logic → Response
```

### Frontend Architecture

**Component-Based Structure**
- **Pages** - Full page components (AddCustomerPage, EditCustomerPage, etc.)
- **Components** - Reusable UI components (CustomForm, CustomTable, Layout)
- **Context** - Global state management (CustomerContext)
- **Utils** - Helper functions (API calls, validation, notifications)

**State Management**
- **Global State** - Customer list managed in CustomerContext
- **Local State** - Form data and UI state in individual components
- **API State** - Loading, error states handled in pages

**Data Flow**
```
User Action → Page Component → API Call → Context Update → Re-render
```

## 📡 API Design

### RESTful Endpoints

| Method | Endpoint | Purpose | Status Code |
|--------|----------|---------|-------------|
| POST | `/customers` | Create new customer | 201 |
| GET | `/customers` | Fetch all customers | 200 |
| GET | `/customers/:id` | Fetch single customer | 200 |
| PUT | `/customers/:id` | Update customer | 200 |
| DELETE | `/customers/:id` | Delete customer | 200 |

### Response Format (Standardized)
```json
{
  "success": true/false,
  "message": "Descriptive message",
  "errors": ["error1", "error2"],
  "data": { /* actual data */ }
}
```

## 🔍 Validation Logic

### Frontend Validation (Real-time)
- **Name**: Required, minimum 2 characters, non-empty string
- **Email**: Required, valid email format using regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- **Phone**: Required, exactly 10 digits using regex `/^\d{10}$/`
- Validation happens on form submission and field blur
- Error messages displayed inline below each field

### Backend Validation (Server-side)
- Same validation rules as frontend (defense in depth)
- Additional null/undefined checks
- Type validation for all inputs
- Prevents invalid data from being stored
- Returns 400 status with detailed error messages

### Validation Flow
```
User Input → Frontend Validation → API Request → Backend Validation → Storage
```

## � Data Storage Logic

### In-Memory Array Storage
```typescript
let customers: any[] = [];
let nextId = 1;

// Auto-increment ID generation
const newCustomer = {
  id: String(nextId++),
  name: payload.name.trim(),
  email: payload.email.trim(),
  phone: payload.phone.trim(),
  createdAt: new Date(),
  updatedAt?: new Date()
};
```

### CRUD Operations

**Create (POST /customers)**
- Validate input data
- Generate unique ID
- Add timestamp
- Push to array
- Return created customer

**Read (GET /customers)**
- Return entire array
- No filtering or pagination (simple implementation)

**Read Single (GET /customers/:id)**
- Find customer by ID using `array.find()`
- Return 404 if not found
- Return customer data if found

**Update (PUT /customers/:id)**
- Find customer by ID
- Validate new data
- Merge old and new data
- Update timestamp
- Return updated customer

**Delete (DELETE /customers/:id)**
- Find customer index using `array.findIndex()`
- Remove from array using `array.splice()`
- Return deleted customer
- Return 404 if not found

## 🎯 Key Implementation Details

### Form Handling
- Controlled components with React state
- Real-time validation feedback
- Error state management
- Loading state during submission
- Success/error notifications

### API Communication
- Axios instance with default headers
- 10-second request timeout
- Network error handling
- Automatic error response parsing
- Retry logic for failed requests

### State Management
- Context API for global customer state
- Local component state for forms
- Error state tracking
- Loading state for async operations
- Automatic state updates after API calls

### Error Handling Strategy
- **Frontend**: Try-catch blocks, error state, user notifications
- **Backend**: Global error handler, validation errors, HTTP status codes
- **Network**: Timeout handling, connection error detection
- **User Feedback**: Toast notifications, inline error messages, loading spinners

### Responsive Design
- Bootstrap grid system for layout
- Mobile-first approach
- Flexible form fields
- Responsive table with horizontal scroll
- Touch-friendly buttons and inputs

## � How It Works

### Adding a Customer
1. User fills form (Name, Email, Phone)
2. Frontend validates input
3. User clicks Submit
4. Frontend sends POST request to `/customers`
5. Backend validates data again
6. Backend generates ID and stores customer
7. Backend returns created customer
8. Frontend updates global state
9. Frontend shows success notification
10. User redirected to customer list

### Viewing Customers
1. Page loads and fetches all customers via GET `/customers`
2. Backend returns array of customers
3. Frontend stores in global state
4. Table renders with customer data
5. Each row has View, Edit, Delete buttons

### Editing a Customer
1. User clicks Edit button
2. Frontend fetches customer details via GET `/customers/:id`
3. Form pre-fills with existing data
4. User modifies data
5. Frontend validates changes
6. User clicks Update
7. Frontend sends PUT request with new data
8. Backend validates and updates
9. Frontend updates global state
10. Success notification shown

### Deleting a Customer
1. User clicks Delete button
2. Confirmation dialog appears
3. User confirms deletion
4. Frontend sends DELETE request to `/customers/:id`
5. Backend removes from array
6. Frontend removes from state
7. Table updates automatically
8. Success notification shown

## 🔐 Security Considerations

- Input validation on both frontend and backend
- Trim whitespace from inputs
- Type checking for all data
- Error messages don't expose sensitive info
- CORS enabled for cross-origin requests
- No sensitive data in localStorage
- No hardcoded credentials

## 📊 Performance Optimizations

- Memoized components to prevent unnecessary re-renders
- Efficient array operations (find, filter, map)
- Lazy loading of pages with React Router
- Optimized bundle with Vite
- CSS-in-JS for minimal CSS files
- Debounced form validation

## 🧪 Testing Approach

### Manual Testing Scenarios
1. Add customer with valid data → Success
2. Add customer with invalid email → Error
3. Add customer with invalid phone → Error
4. View customer list → All customers displayed
5. Edit customer → Changes saved
6. Delete customer → Removed from list
7. Network error → Error message shown
8. Validation error → Inline error displayed

### Edge Cases Handled
- Empty form submission
- Invalid email format
- Phone with non-digits
- Missing required fields
- Network timeout
- Server errors
- Duplicate operations
- Rapid successive requests

## 📈 Scalability Considerations

### Current Limitations
- In-memory storage (data lost on restart)
- No pagination (all data loaded at once)
- No authentication/authorization
- No rate limiting
- Single server instance

### Future Improvements
- Replace with database (MongoDB/PostgreSQL)
- Add pagination and filtering
- Implement user authentication
- Add role-based access control
- Add API rate limiting
- Implement caching
- Add search functionality
- Add data export features

## 🎓 Learning Outcomes

This project demonstrates:
- Full-stack development workflow
- REST API design principles
- React component architecture
- State management patterns
- Form handling and validation
- Error handling best practices
- Responsive web design
- Production deployment configuration
- TypeScript usage
- Async/await patterns
- Array manipulation methods
- HTTP status codes
- CORS concepts

## 📦 Dependencies

### Backend
```json
{
  "express": "^4.x",
  "cors": "^2.x",
  "typescript": "^5.x"
}
```

### Frontend
```json
{
  "react": "^18.x",
  "react-router-dom": "^6.x",
  "axios": "^1.x",
  "bootstrap": "^5.x"
}
```


## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

```bash
cd Backend
npm install
npm start
```

Backend runs on `http://localhost:4000`

### Frontend Setup

```bash
cd Customer-Management
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## 📝 Environment Variables

### Frontend (.env.local)
```
VITE_API_BASE_URL=http://localhost:4000
```

### Backend (.env)
```
NODE_ENV=development
PORT=4000
```

## 🌐 Deployment

Both services can be deployed separately on Render:

**Backend Service:**
- Build: `cd Backend && npm install`
- Start: `cd Backend && npm start`

**Frontend Service:**
- Build: `cd Customer-Management && npm install && npm run build`
- Start: `cd Customer-Management && npm run preview`
- Environment: `VITE_API_BASE_URL=<backend-url>`

## ✅ Requirements Met

- ✅ Frontend form with Name, Email, Phone fields
- ✅ Submit button with validation
- ✅ Customer table with Name, Email, Phone columns
- ✅ Delete button with confirmation
- ✅ Backend API: POST /customers
- ✅ Backend API: GET /customers
- ✅ Backend API: DELETE /customers/:id
- ✅ In-memory storage using array
- ✅ Error handling and validation
- ✅ Responsive design
- ✅ Production-ready deployment

---

**Version**: 1.0.0 | **Status**: Production Ready
