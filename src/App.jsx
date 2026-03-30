import { Routes, Route } from "react-router-dom";
import Checkout from "./pages/Checkout";
import Receipt from "./pages/Receipt";
import MockCheckout from "./pages/MockCheckout";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/payment" element={<Checkout />} />
        <Route path="/mock" element={<MockCheckout />} />
        <Route path="/receipt" element={<Receipt />} />
      </Routes>
    </div>
  );
}

export default App;
