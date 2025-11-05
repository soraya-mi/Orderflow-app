import { createContext, useContext, type PropsWithChildren,  } from "react";
import { useMachine } from "@xstate/react";
import { orderMachine } from "../machines/orderMachine";
// import type { AnyState, AnyEventObject } from "xstate";

type OrderMachineValue = ReturnType<typeof useMachine<typeof orderMachine>>;
const Ctx = createContext<OrderMachineValue | null>(null);

export const OrderMachineProvider = ({ children }: PropsWithChildren) => {
  const machine = useMachine(orderMachine);
  return <Ctx.Provider value={machine}>{children}</Ctx.Provider>;
};

export const useOrderMachine = () => {
  const value = useContext(Ctx);
  if (!value) throw new Error("useOrderMachine must be used within OrderMachineProvider");
  return value;
};
