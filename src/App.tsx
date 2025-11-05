import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useOrderMachine } from "./context/OrderMachineProvider";
import ProductSelectPage from "./pages/ProductSelectPage";
import OrderFormPage from "./pages/OrderFormPage";
import OrderStatusPage from "./pages/OrderStatusPage";

export default function App() {
  const [state] = useOrderMachine();
  const loc = useLocation();

  // Redirect to the “right” UI for the current state
  const currentPath =
    state.matches("selectingProduct") ? "/"
    : state.matches("form") || state.matches("review") ? "/form"
    : state.matches("pending") || state.matches("processing") || state.matches("shipped") || state.matches("delivered") || state.matches("error")
      ? "/status"
      : "/";

  const needsRedirect = loc.pathname !== currentPath;

  return (
    <div className="min-h-dvh bg-gray-50 text-gray-900">
      <div className="max-w-5xl mx-auto">
        {needsRedirect && <Navigate to={currentPath} replace />}
        <Routes>
          <Route path="/" element={<ProductSelectPage />} />
          <Route path="/form" element={<OrderFormPage />} />
          <Route path="/status" element={<OrderStatusPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}
