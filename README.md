# 🛒 Checkout Cart System

A modern, mobile-first checkout cart application built for kiosk systems with a seamless payment flow and receipt generation.

## ✨ Features

- 📱 **Mobile-First Design** - Optimized for touch interfaces and mobile devices
- 🛍️ **Interactive Checkout Page** - Clean product listing with real-time total calculation
- 🧾 **Digital Receipt** - Professional receipt generation after payment
- 📥 **Download Options** - Save receipts as PNG images or PDF documents
- 🎨 **Modern UI** - Built with Tailwind CSS for a sleek, responsive design
- 🔄 **Smooth Navigation** - React Router for seamless page transitions
- ✅ **Payment Confirmation** - Visual feedback for successful transactions
- 🎯 **Demo Mode** - Perfect for testing and demonstration purposes

## 🚀 Technologies Used

- **[Vite](https://vitejs.dev/)** - Fast build tool and development server
- **[React 18](https://react.dev/)** - Modern UI library with hooks
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[React Router DOM](https://reactrouter.com/)** - Client-side routing
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library
- **[html2canvas](https://html2canvas.hertzen.com/)** - Screenshot generation
- **[jsPDF](https://github.com/parallax/jsPDF)** - PDF document creation
- **[Apollo](https://www.apollographql.com/)** - For querying backend for information and status updates

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** - Version 16.x or higher ([Download here](https://nodejs.org/))
- **npm** - Comes bundled with Node.js

## 🔧 Installation

1. **Clone or download this repository:**

```bash
git clone <repository-url>
cd checkout-cart
```

2. **Install dependencies:**

```bash
npm install
```

This will install all required packages including React, Vite, Tailwind CSS, and other dependencies.

## 🎮 Running the Application

### Development Mode

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use). The terminal will display the exact URL.

### Production Build

Create an optimized production build:

```bash
npm run build
```

The built files will be output to the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## 📁 Project Structure

```
checkout-cart/
├── src/
│   ├── pages/
│   │   ├── Checkout.jsx      # Main checkout page with cart items
│   │   └── Receipt.jsx        # Receipt page with download options
│   ├── App.jsx                # Main app component with routing
│   ├── main.jsx               # Application entry point
│   └── index.css              # Global styles and Tailwind directives
├── index.html                 # HTML template
├── package.json               # Project dependencies and scripts
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
└── README.md                  # This file
```

## 🎯 Key Features Explained

### 📱 Checkout Flow

1. **Product Display** - Shows cart items with emoji icons, names, prices, and quantities
2. **Real-time Calculation** - Automatically calculates subtotal, tax (8%), and total
3. **Sticky Summary** - Order summary and payment button remain visible while scrolling
4. **Touch-Optimized** - Large buttons and clear spacing for easy interaction

### 🧾 Receipt Generation

1. **Order Confirmation** - Success animation and confirmation message
2. **Detailed Receipt** - Includes order number, timestamp, and itemized list
3. **Download as Image** - Converts receipt to PNG using html2canvas
4. **Download as PDF** - Generates PDF document using jsPDF
5. **Session Storage** - Order data persists during the session

### 📥 Download Functionality

The receipt can be downloaded in two formats:

- **PNG Image** - High-quality screenshot of the receipt
- **PDF Document** - Formatted A4 document for printing

Both options use the same receipt design and include all order details.

## 🎨 Mobile-First Design

The application is built with mobile devices as the primary target:

- **Responsive Layout** - Adapts to different screen sizes
- **Touch-Friendly** - Large tap targets (minimum 44px)
- **Optimized Viewport** - Proper meta tags for mobile browsers
- **Sticky Elements** - Important UI elements remain accessible
- **Fast Loading** - Optimized bundle size for quick page loads

## 💡 Demo Usage Instructions

1. **View Cart** - The app loads with 3 sample items (Wireless Headphones, Phone Case, USB-C Cable)
2. **Review Order** - Check item details and calculated totals
3. **Pay Now** - Tap the blue "Pay Now" button at the bottom
4. **View Receipt** - See the success message and order confirmation
5. **Download Receipt** - Choose to download as PNG or PDF
6. **Return to Shop** - Tap "Back to Shop" to start a new order

## 🔒 Security Notes

- This is a **demo application** - no real payment processing occurs
- Session storage is used for temporary data (cleared when session ends)
- In production, implement proper backend integration and security measures

## 🛠️ Customization

### Changing Products

Edit the `cartItems` state in `src/pages/Checkout.jsx`:

```javascript
const [cartItems] = useState([
  {
    id: 1,
    name: "Your Product",
    price: 99.99,
    quantity: 1,
    image: "🎁",
  },
  // Add more items...
]);
```

### Adjusting Tax Rate

Modify the `taxRate` constant in `src/pages/Checkout.jsx`:

```javascript
const taxRate = 0.08; // Change to your desired rate (e.g., 0.10 for 10%)
```

### Styling Changes

All styles use Tailwind CSS utility classes. Customize colors and spacing by modifying the class names in the component files.

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is open source and available for educational and commercial use.

## 🙏 Acknowledgments

- Icons provided by [Lucide](https://lucide.dev/)
- Built with [Vite](https://vitejs.dev/) for optimal development experience
- Styled with [Tailwind CSS](https://tailwindcss.com/) for rapid UI development

---

**Made with ❤️ for modern kiosk systems**
