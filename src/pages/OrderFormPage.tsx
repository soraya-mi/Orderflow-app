import { useOrderMachine } from "../context/OrderMachineProvider";
import Progress from "../components/Progress";

export default function OrderFormPage() {
  const [state, , send] = useOrderMachine();

  const isAddress = state.matches({ form: "address" });
  const isPayment = state.matches({ form: "payment" });

  const { address, payment } = state.context.form;
  const step = isAddress ? "address" : isPayment ? "payment" : "review";

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Order details</h1>
      <Progress step={step as any} />

      {isAddress && (
        <div className="space-y-3 mt-4">
          <input className="input" placeholder="Full name"
                 value={address.fullName}
                 onChange={(e) => send({ type: "UPDATE_ADDRESS", address: { fullName: e.target.value } })}/>
          <input className="input" placeholder="Address line 1"
                 value={address.line1}
                 onChange={(e) => send({ type: "UPDATE_ADDRESS", address: { line1: e.target.value } })}/>
          <div className="grid grid-cols-2 gap-3">
            <input className="input" placeholder="City"
                   value={address.city}
                   onChange={(e) => send({ type: "UPDATE_ADDRESS", address: { city: e.target.value } })}/>
            <input className="input" placeholder="Country"
                   value={address.country}
                   onChange={(e) => send({ type: "UPDATE_ADDRESS", address: { country: e.target.value } })}/>
          </div>
          <div className="flex gap-2 pt-2">
            <button className="btn-primary" onClick={() => send({ type: "NEXT" })}>Continue</button>
          </div>
        </div>
      )}

      {isPayment && (
        <div className="space-y-3 mt-4">
          <input className="input" placeholder="Card number"
                 value={payment.cardNumber}
                 onChange={(e) => send({ type: "UPDATE_PAYMENT", payment: { cardNumber: e.target.value } })}/>
          <div className="grid grid-cols-2 gap-3">
            <input className="input" placeholder="MM/YY"
                   value={payment.exp}
                   onChange={(e) => send({ type: "UPDATE_PAYMENT", payment: { exp: e.target.value } })}/>
            <input className="input" placeholder="CVC"
                   value={payment.cvc}
                   onChange={(e) => send({ type: "UPDATE_PAYMENT", payment: { cvc: e.target.value } })}/>
          </div>
          <div className="flex gap-2 pt-2">
            <button className="btn" onClick={() => send({ type: "BACK" })}>Back</button>
            <button className="btn-primary" onClick={() => send({ type: "NEXT" })}>Review</button>
          </div>
        </div>
      )}

      {state.matches("review") && (
        <div className="space-y-4 mt-4">
          <div className="rounded-xl border p-3">
            <div className="font-semibold mb-2">Address</div>
            <div className="text-sm text-gray-600">{address.fullName}</div>
            <div className="text-sm text-gray-600">{address.line1}</div>
            <div className="text-sm text-gray-600">{address.city}, {address.country}</div>
          </div>
          <div className="rounded-xl border p-3">
            <div className="font-semibold mb-2">Payment</div>
            <div className="text-sm text-gray-600">•••• •••• •••• {address.fullName ? "1234" : "0000"}</div>
          </div>
          <div className="flex gap-2 pt-2">
            <button className="btn" onClick={() => send({ type: "BACK" })}>Back</button>
            <button className="btn-primary" onClick={() => send({ type: "SUBMIT" })}>Place order</button>
          </div>
        </div>
      )}
    </div>
  );
}
