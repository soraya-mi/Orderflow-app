import { createMachine, assign } from "xstate";
import type { Product, OrderForm, OrderStatus } from "../types";

type Ctx = {
  product?: Product;
  form: OrderForm;
  orderId?: string;
  error?: string;
  status?: OrderStatus;
};

type Ev =
  | { type: "SELECT_PRODUCT"; product: Product }
  | { type: "UPDATE_ADDRESS"; address: Partial<OrderForm["address"]> }
  | { type: "UPDATE_PAYMENT"; payment: Partial<OrderForm["payment"]> }
  | { type: "NEXT" }
  | { type: "BACK" }
  | { type: "SUBMIT" }
  | { type: "RETRY" }
  | { type: "RESET" };

const initialForm: OrderForm = {
  address: { fullName: "", line1: "", city: "", country: "" },
  payment: { cardNumber: "", exp: "", cvc: "" },
};

export const orderMachine = createMachine(
  {
    id: "order",
    types: {} as { context: Ctx; events: Ev },
    context: {
      form: initialForm,
    },
    initial: "selectingProduct",
    states: {
      selectingProduct: {
        on: {
          SELECT_PRODUCT: {
            target: "form.address",
            actions: assign({
              product: ({ event }) => event.product,
            }),
          },
        },
      },

      form: {
        initial: "address",
        states: {
          address: {
            on: {
              UPDATE_ADDRESS: {
                actions: assign({
                  form: ({ context, event }) => ({
                    ...context.form,
                    address: { ...context.form.address, ...event.address },
                  }),
                }),
              },
              NEXT: [
                {
                  guard: ({ context }) =>
                    !!context.form.address.fullName &&
                    !!context.form.address.line1 &&
                    !!context.form.address.city &&
                    !!context.form.address.country,
                  target: "payment",
                },
              ],
            },
          },
          payment: {
            on: {
              UPDATE_PAYMENT: {
                actions: assign({
                  form: ({ context, event }) => ({
                    ...context.form,
                    payment: { ...context.form.payment, ...event.payment },
                  }),
                }),
              },
              BACK: "address",
              NEXT: [
                {
                  guard: ({ context }) =>
                    !!context.form.payment.cardNumber &&
                    !!context.form.payment.exp &&
                    !!context.form.payment.cvc,
                  target: "#order.review",
                },
              ],
            },
          },
        },
      },

      review: {
        id: "review",
        on: {
          BACK: "form.payment",
          SUBMIT: "pending",
        },
      },

      pending: {
        invoke: {
          src: "submitOrder",
          onDone: {
            target: "processing",
            actions: assign({
              orderId: ({ event }) => (event.output as { id: string }).id,
              status: () => "processing",
            }),
          },
          onError: {
            target: "error",
            actions: assign({ error: ({ event }) => (event.error as Error).message }),
          },
        },
      },

      processing: {
        after: {
          1500: "shipped",
        },
        entry: assign({ status: () => "processing" as OrderStatus }),
      },

      shipped: {
        after: {
          1500: "delivered",
        },
        entry: assign({ status: () => "shipped" as OrderStatus }),
      },

      delivered: {
        entry: assign({ status: () => "delivered" as OrderStatus }),
        on: { RESET: { target: "selectingProduct", actions: assign({ product: () => undefined, form: () => initialForm, orderId: () => undefined, error: () => undefined, status: () => undefined }) } },
      },

      error: {
        entry: assign({ status: () => "error" as OrderStatus }),
        on: {
          RETRY: "pending",
          RESET: { target: "selectingProduct", actions: assign({ product: () => undefined, form: () => initialForm, orderId: () => undefined, error: () => undefined, status: () => undefined }) },
        },
      },
    },
  },
  {
    services: {
      // swap this with a real axios POST later
      submitOrder: async ({ context }) => {
        // Simulate network latency + random failure
        await new Promise((r) => setTimeout(r, 900));
        const fail = Math.random() < 0.15;
        if (fail) throw new Error("Payment authorization failed");
        // pretend backend creates an order id
        return { id: "ord_" + Math.random().toString(36).slice(2, 8) };
      },
    },
  }
);
