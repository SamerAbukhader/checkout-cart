import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_PAYMENT_STATUS } from "../apollo/client";
import { CheckCircle, Download, Home, FileText, Image } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Receipt = () => {
  const navigate = useNavigate();
  const receiptRef = useRef(null);
  const [orderData, setOrderData] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session");

  // Fetch payment status and receipt data
  const { data, loading, error } = useQuery(GET_PAYMENT_STATUS, {
    variables: { sessionId },
    skip: !sessionId, // Don't run query if no sessionId
    pollInterval: 3000, // Poll every 3 seconds to check for updates
  });
  console.log("Payment Status Data:", data);
  useEffect(() => {
    // Update order data when payment status data is fetched
    if (data?.paymentSession && data.paymentSession.status === "paid") {
      setOrderData({
        items: data.paymentSession.cartItems,
        subtotal: data.paymentSession.subtotal,
        total: data.paymentSession.total,
        timestamp: data.paymentSession.paidAt,
        orderNumber: `ORD-${Date.now()}`,
      });
    }
  }, [data]);

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleBackToShop = () => {
    sessionStorage.removeItem("orderData");
    navigate("/");
  };

  const handleDownloadAsImage = async () => {
    if (!receiptRef.current || isDownloading) return;

    try {
      setIsDownloading(true);
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        logging: false,
      });

      const link = document.createElement("a");
      link.download = `receipt-${orderData.orderNumber}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to download image. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadAsPDF = async () => {
    if (!receiptRef.current || isDownloading) return;

    try {
      setIsDownloading(true);
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`receipt-RM{orderData.orderNumber}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to download PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // If no order data, show error state
  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Receipt Found
          </h2>
          <p className="text-gray-600 mb-6">
            There is no order data available. Please complete a purchase first.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 min-h-[56px]">
            <Home className="w-5 h-5" />
            <span>Go to Checkout</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Success Header */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 text-white py-8 px-4 text-center">
        <CheckCircle className="w-16 h-16 mx-auto mb-3" strokeWidth={2} />
        <h1 className="text-2xl font-bold mb-1">Payment Successful!</h1>
        <p className="text-green-100 text-sm">Your order has been confirmed</p>
      </div>

      {/* Receipt Container */}
      <div className="px-4 py-6">
        <div
          ref={receiptRef}
          className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-6">
          {/* Order Info */}
          <div className="border-b border-gray-200 pb-4 mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-3 text-center">
              Order Receipt
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-semibold text-gray-900">
                  {orderData.orderNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date & Time:</span>
                <span className="font-medium text-gray-900">
                  {formatDateTime(orderData.timestamp)}
                </span>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span>Items Purchased</span>
              <span className="text-sm text-gray-500">
                ({orderData.items.length})
              </span>
            </h3>
            <div className="space-y-3">
              {orderData.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-start py-2 border-b border-gray-100 last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {item.title}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 ml-10">
                      {item.currency} {item.price.toFixed(2)} × {item.quantity}
                    </div>
                  </div>
                  <div className="font-semibold text-gray-900 ml-2">
                    {item.currency} {(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t-2 border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span className="font-medium">RM {orderData.subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Tax (6%)</span>
              <span className="font-medium">
                RM {Number((orderData.subtotal * 0.06).toFixed(2))}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Total Paid</span>
                <span className="text-green-600">
                  RM {Number((orderData.subtotal * 1.06).toFixed(2))}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              Thank you for your purchase!
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Demo Mode • No real transaction
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Download Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleDownloadAsImage}
              disabled={isDownloading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 active:bg-blue-800 text-white font-semibold py-4 px-4 rounded-lg transition-colors duration-200 flex flex-col items-center justify-center gap-2 min-h-[68px] shadow-md">
              <Image className="w-5 h-5" />
              <span className="text-sm">
                {isDownloading ? "Processing..." : "Download as Image"}
              </span>
            </button>

            <button
              onClick={handleDownloadAsPDF}
              disabled={isDownloading}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 active:bg-red-800 text-white font-semibold py-4 px-4 rounded-lg transition-colors duration-200 flex flex-col items-center justify-center gap-2 min-h-[68px] shadow-md">
              <FileText className="w-5 h-5" />
              <span className="text-sm">
                {isDownloading ? "Processing..." : "Download as PDF"}
              </span>
            </button>
          </div>
        </div>

        {/* Info Text */}
        <p className="text-center text-xs text-gray-500 mt-4">
          Save your receipt for your records
        </p>
      </div>
    </div>
  );
};

export default Receipt;
