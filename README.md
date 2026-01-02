# MegaHive – E-Commerce Platform

MegaHive is a modern e-commerce platform designed to provide a seamless online shopping experience, similar to leading marketplaces like Flipkart. The platform connects sellers and buyers on a single digital marketplace, offering a wide range of products across multiple categories. It enables users to browse products, view detailed descriptions and prices, add items to their cart, and complete purchases through a secure checkout process. The platform focuses on ease of use, fast navigation, and reliable performance to enhance customer satisfaction.

## 🚀 Core Functionality

### 👤 User Management
- User registration and login
- Secure authentication and authorization
- User profile management

### 📦 Product Management
- Product listing with images, descriptions, pricing, and categories
- Product search and filtering (by price, category, ratings)
- Product availability display

### 🛍️ Shopping Cart
- Add products to cart
- Update product quantities
- Remove products from cart
- Real-time price calculation

### 📑 Order Management
- Order placement and confirmation
- Order status tracking (Placed, Shipped, Delivered)
- Order history and invoice generation

### 💳 Payment Processing
- Secure payment gateway integration
- Multiple payment options (UPI, Cards, Net Banking, Cash on Delivery)

### 🛠️ Admin Management
- Admin dashboard
- Manage users,  products, and orders
- Platform monitoring and analytics

### ⭐ Reviews & Ratings
- Customers can rate and review products
- Rating-based product visibility

### 🔔 Notifications
- Order confirmation notifications
- Shipping and delivery status updates

---

## 📌 Future Enhancements
- Product recommendation system
- Wishlist functionality
- Advanced analytics dashboard
- Mobile application support

---

## Tech Stack

- **Frontend:** React.js, Redux Toolkit, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JSON Web Tokens (JWT)
- **Hosting:** Hosted on vercel for frontend and render for server.

## How It Works

1. **User Registration / Login**  
   Users create an account or log in to access the MegaHive platform and start shopping.

2. **Admin Adds Products**  
   The admin manages the platform by adding products with details such as images, descriptions, prices, and categories.

3. **Browse Products**  
   Users can view and browse all available products added by the admin, using search and filter options.

4. **Add to Cart**  
   Users select products and add them to their shopping cart for purchase.

5. **Checkout & Payment**  
   Users proceed to checkout and complete their purchase using secure **PayPal payment integration**.

6. **Order Confirmation**  
   After successful payment, the order is confirmed and users can view order details and status.

7. **Admin Order Management**  
   The admin monitors and manages all orders, updates order status, and ensures smooth order fulfillment.


## Installation

Follow these steps to set up the project locally:

### Prerequisites
- Node.js and npm installed
- MongoDB set up locally or a MongoDB Atlas account

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/MegaHive.git
   cd fron
   ```

2.Setup Backend:
   ```bash
   cd backend
   npm install

   ```

3. Set up environment variables:
   Create a `.env` file inside the backend folder and add:
   ```env
   MONGO_URI=your-mongodb-connection-string
   JWT_SECRET=your-secret-key
   PORT=5000
   ```

4. Run Backend Server:
   ```bash
   npm start
   ```

   

5. Setup Frontend:
   ```bash
   cd frontend
   npm install

   ```
6. Run Frontend Application:
   ```bash
   npm run dev
   ```
7. Access MegaHive:
Open your browser and visit:
[text](http://localhost:5173)


## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Create a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

---

## 👨‍💻 Author
- **Vivek Kumar**
- Built with ❤️ using MERN Stack.
