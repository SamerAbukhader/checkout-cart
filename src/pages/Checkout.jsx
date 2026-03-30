import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { GET_PAYMENT_SESSION, UPDATE_PAYMENT_STATUS } from "../apollo/client";
import { ShoppingCart, ChevronRight, Package } from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session");

  // Fetch payment session data
  const { data, loading, error } = useQuery(GET_PAYMENT_SESSION, {
    variables: { sessionId },
    skip: !sessionId, // Don't run query if no sessionId
    pollInterval: 3000, // Poll every 3 seconds to check for updates
  });

  // Mutation to update payment status
  const [updatePaymentStatus] = useMutation(UPDATE_PAYMENT_STATUS);

  let cartItems = data?.paymentSession.cartItems || [];

  console.log("Cart Items:", cartItems);
  // Calculate totals from session data or cart items
  const subtotal = data?.paymentSession
    ? parseFloat(data.paymentSession.subtotal)
    : cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = data?.paymentSession
    ? parseFloat(data.paymentSession.discount)
    : 0;
  const total = data?.paymentSession
    ? parseFloat(data.paymentSession.total)
    : subtotal;

  const handlePayNow = async () => {
    try {
      // Update payment status to 'paid' on the server
      const { data: mutationData } = await updatePaymentStatus({
        variables: {
          sessionId: sessionId,
          status: "paid",
        },
      });

      if (mutationData?.updatePaymentStatus?.success) {
        // Store order data in sessionStorage
        const orderData = {
          items: cartItems,
          subtotal: subtotal.toFixed(2),
          //tax: tax.toFixed(2),
          total: total.toFixed(2),
          timestamp: new Date().toISOString(),
          orderNumber: `ORD-${Date.now()}`,
        };

        sessionStorage.setItem("orderData", JSON.stringify(orderData));

        // Navigate to receipt page with parameters sessionId
        navigate(`/receipt?session=${sessionId}`);
      } else {
        console.error(
          "Payment status update failed:",
          mutationData?.updatePaymentStatus?.message || "Unknown error"
        );
        alert("Payment processing failed. Please try again.");
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      alert("An error occurred while processing payment. Please try again.");
    }
  };

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Invalid Session
          </h2>
          <p className="text-gray-600">No payment session found</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">
            Error loading checkout: {error.message}
          </p>
        </div>
      </div>
    );
  }

  if (!data?.paymentSession) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Session Not Found
          </h2>
          <p className="text-gray-600">Payment session not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
          </div>
        </div>
      </div>

      {/* Cart Items */}
      <div className="px-4 py-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Order Items ({cartItems.length})
          </h2>
        </div>

        {cartItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex gap-4">
              {/* Product Image Placeholder */}
              <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center text-4xl">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-base mb-1">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-600">
                    Qty: {item.quantity}
                  </span>
                  <span className="font-bold text-blue-600 text-lg">
                    {item.currency || "RM"}{" "}
                    {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {item.currency || "RM"} {item.price.toFixed(2)} each
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sticky Bottom Section - Order Summary & Pay Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="px-4 py-4">
          {/* Order Summary */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span className="font-medium">RM {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Discount</span>
              <span className="font-medium">-RM {discount.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span className="text-blue-600">RM {total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Pay Now Button */}
          <button
            onClick={handlePayNow}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-colors duration-200 flex items-center justify-center gap-2 min-h-[56px]">
            <span className="text-lg">Pay Now</span>
            <ChevronRight className="w-6 h-6" />
          </button>

          <p className="text-center text-xs text-gray-500 mt-3">
            Secure checkout • Demo mode
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
