type Props = {
  step: "select" | "address" | "payment" | "review" | "status";
};

const steps: Props["step"][] = ["select", "address", "payment", "review", "status"];

export default function Progress({ step }: Props) {
  const idx = steps.indexOf(step);
  return (
    <div className="flex gap-2 items-center my-4">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm
              ${i <= idx ? "bg-blue-600 text-white border-blue-600" : "bg-transparent border-gray-300 text-gray-500"}`}
            title={s}
          >
            {i + 1}
          </div>
          {i < steps.length - 1 && (
            <div className={`w-10 h-[2px] ${i < idx ? "bg-blue-600" : "bg-gray-300"}`} />
          )}
        </div>
      ))}
    </div>
  );
}
