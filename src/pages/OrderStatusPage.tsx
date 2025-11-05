import { useOrderMachine } from "../context/OrderMachineProvider";
import Progress from "../components/Progress";

export default function OrderStatusPage() {
  const [state, , send] = useOrderMachine();
  const { orderId, status, error, product } = state.context;

  const subtitle =
    status === "pending" ? "Submitting order…" :
    status === "processing" ? "Processing payment…" :
    status === "shipped" ? "Shipped! On the way…" :
    status === "delivered" ? "Delivered 🎉" :
    "Something went wrong";

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Order status</h1>
      <Progress step="status" />

      <div className="rounded-2xl border p-4 mt-4">
        <div className="text-sm text-gray-500">Order</div>
        <div className="font-semibold">{orderId ?? "—"}</div>
        <div className="mt-2 text-gray-700">{subtitle}</div>
        <div className="mt-2 text-gray-500">Item: {product?.name ?? "—"}</div>

        {error && (
          <div className="mt-3 text-red-600 text-sm">Error: {error}</div>
        )}

        <div className="flex gap-2 mt-4">
          {state.matches("delivered") && (
            <button className="btn-primary" onClick={() => send({ type: "RESET" })}>New order</button>
          )}
          {state.matches("error") && (
            <>
              <button className="btn" onClick={() => send({ type: "RESET" })}>Start over</button>
              <button className="btn-primary" onClick={() => send({ type: "RETRY" })}>Retry</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
