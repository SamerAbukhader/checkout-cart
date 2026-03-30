import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ChevronRight, Package } from "lucide-react";

const MOCK_CART_ITEMS = [
  {
    id: "prod-1",
    title: "Panadol Soluble 500mg (12 Tablets)",
    image: "https://cdn11.bigcommerce.com/s-vhzbg5/images/stencil/1280x1280/products/1685/4601/apienjn0l__79221.1499347775.jpg?c=2",
    price: 8.5,
    quantity: 2,
    currency: "RM",
  },
  {
    id: "prod-2",
    title: "Vitamin C 1000mg Effervescent (10 Tablets)",
    image: "https://medias.watsons.com.my/publishing/WTCMY-65870-front-zoom.jpg?version=1750798915",
    price: 12.9,
    quantity: 1,
    currency: "RM",
  },
  {
    id: "prod-3",
    title: "Strepsils Honey & Lemon (24 Lozenges)",
    image: "https://media-services.digital-rb.com/s3/live-productcatalogue/sys-master/images/h14/h49/8873603170334/RB_Strepsils_Honey&Lemon_24pk.jpg?width=1280&height=1280",
    price: 14.5,
    quantity: 1,
    currency: "RM",
  }
];

const MOCK_DISCOUNT = 5.0;

const MockCheckout = () => {
  const navigate = useNavigate();
  const [paying, setPaying] = useState(false);

  const subtotal = MOCK_CART_ITEMS.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = MOCK_DISCOUNT;
  const total = subtotal - discount;

  const handlePayNow = async () => {
    setPaying(true);

    // Simulate network delay
    await new Promise((res) => setTimeout(res, 1200));

    const orderData = {
      items: MOCK_CART_ITEMS,
      subtotal: subtotal.toFixed(2),
      total: total.toFixed(2),
      timestamp: new Date().toISOString(),
      orderNumber: `ORD-${Date.now()}`,
    };

    sessionStorage.setItem("orderData", JSON.stringify(orderData));
    navigate("/receipt?session=mock-session");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
            <span className="ml-auto text-xs bg-yellow-100 text-yellow-700 font-semibold px-2 py-1 rounded-full">
              Mock Mode
            </span>
          </div>
        </div>
      </div>

      {/* Cart Items */}
      <div className="px-4 py-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Order Items ({MOCK_CART_ITEMS.length})
          </h2>
        </div>

        {MOCK_CART_ITEMS.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center text-4xl">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-base mb-1">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-600">
                    Qty: {item.quantity}
                  </span>
                  <span className="font-bold text-blue-600 text-lg">
                    {item.currency} {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {item.currency} {item.price.toFixed(2)} each
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sticky Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="px-4 py-4">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span className="font-medium">RM {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Discount</span>
              <span className="font-medium text-green-600">
                -RM {discount.toFixed(2)}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span className="text-blue-600">RM {total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handlePayNow}
            disabled={paying}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-colors duration-200 flex items-center justify-center gap-2 min-h-[56px]"
          >
            {paying ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                <span className="text-lg">Processing...</span>
              </>
            ) : (
              <>
                <span className="text-lg">Pay Now</span>
                <ChevronRight className="w-6 h-6" />
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-500 mt-3">
            Secure checkout • Mock mode
          </p>
        </div>
      </div>
    </div>
  );
};

export default MockCheckout;
