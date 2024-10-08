# E-Commerce Application

Welcome to the **E-Commerce Application** project! This project is a full-stack web application built with React, Redux Toolkit, TypeScript, Node.js, and Express.js. It provides a shopping platform for users, and it includes role-based access for admins and sellers to manage products and users efficiently.

## Features

### 1. Shop Page
- **Product Listing**: Users can browse a list of available products, which are organized by categories.
- **Search & Filter**: The shop page includes a search bar and category filter, allowing users to search products by name and filter based on categories.
- **Add to Cart & Wishlist**: Users can add products to their cart or wishlist. The wishlist can be easily toggled on and off with a button.
- **Dynamic Quantity Management**: Users can add products to their cart while ensuring the quantity doesn't exceed the available stock.
- **Checkout**: Users can proceed to checkout, completing their purchase in a streamlined way.
- **No Results Animation**: When no products match the search criteria, an animated graphic is shown to improve the user experience.

### 2. Admin Dashboard
- **User Management**: The admin dashboard allows admins to create, edit, and delete users.
- **Role-Based Access Control**: Only users with the admin role can access the admin page, and they can manage users with other roles like sellers or shoppers.
- **Security**: Admin actions are protected by verifying tokens to ensure only authorized users perform such operations.

### 3. Seller Dashboard
- **Product Management**: Sellers can manage their own products, including adding, updating, and deleting products from their inventory.
- **Role-Based Access Control**: Only sellers can access this page to manage their product listings.

### 4. Authentication
- **User Authentication**: The application has a complete authentication system including login, registration, and token verification.
- **Protected Routes**: The routes for admin and seller pages are protected to ensure that only authorized users can access them.

### 5. Responsive UI
- The user interface is responsive, ensuring that the application works smoothly across different devices, including desktops and mobile phones.
- **Sticky Footer**: A sticky footer is implemented so that it remains at the bottom of the page without overlapping the content.

## Tech Stack

### Frontend
- **React** (with hooks)
- **Redux Toolkit** for state management
- **TypeScript** for type safety
- **React Router** for page navigation
- **Tailwind CSS** for styling
- **Lottie** for animations

### Backend
- **Node.js** and **Express.js**
- **JWT** for authentication
- **dotenv** for configuration management
- **Axios** for handling HTTP requests
- **JSON-based database** (mock database for simplicity)

## Installation & Setup

To run this project locally, follow these steps:

1. **Clone the repository**
   ```sh
   git clone https://github.com/yourusername/ecommerce-application.git
   cd ecommerce-application
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory and add the necessary environment variables:
   ```env
   TOKEN=your_jwt_secret
   PORT=4040
   ```

4. **Run the backend server**
   ```sh
   npm run server
   ```

5. **Run the frontend client**
   ```sh
   npm start
   ```

6. **Access the Application**
   Open your browser and navigate to `http://localhost:3000` to see the application in action.

## Demo Video

Check out the video walkthrough of the project showcasing the features implemented:
[Video Link](https://youtu.be/example-video-link)

## Future Improvements
- **Payment Gateway Integration**: To handle online payments directly in the application.
- **More Role Types**: Adding different user roles like super admin or moderators.
- **Enhanced UI/UX**: Further enhance the styling and animations for a more immersive shopping experience.
- **Product Reviews**: Allow users to add reviews and ratings to products.

## Conclusion
This E-Commerce Application is a comprehensive project designed for a seamless shopping experience with dynamic product management by both admins and sellers. The role-based access ensures the security of sensitive operations, and the responsive design ensures accessibility across devices.

Feel free to contribute or report issues! Happy shopping!

