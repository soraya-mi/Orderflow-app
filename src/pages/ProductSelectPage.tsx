import { useOrderMachine } from "../context/OrderMachineProvider";
import type { Product } from "../types";
import Progress from "../components/Progress";

const PRODUCTS: Product[] = [
  { id: "coffee", name: "Coffee Beans", priceCents: 1299 },
  { id: "pizza", name: "Artisan Pizza", priceCents: 1899 },
  { id: "ebook", name: "E-book (Digital)", priceCents: 999 },
];

export default function ProductSelectPage() {
  const [{ context }, , send] = useOrderMachine();

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Choose a product</h1>
      <Progress step="select" />
      <div className="grid sm:grid-cols-3 gap-4 mt-4">
        {PRODUCTS.map((p) => (
          <button
            key={p.id}
            className="rounded-2xl border p-4 hover:shadow-md transition text-left"
            onClick={() => send({ type: "SELECT_PRODUCT", product: p })}
          >
            <div className="font-semibold">{p.name}</div>
            <div className="text-sm text-gray-500 mt-1">${(p.priceCents / 100).toFixed(2)}</div>
          </button>
        ))}
      </div>
      {context.product && (
        <p className="mt-4 text-sm text-gray-600">Selected: {context.product.name}</p>
      )}
    </div>
  );
}
