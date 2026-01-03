import { CheckCircle2, Clock, Package, Truck, XCircle } from "lucide-react";

interface OrderTimelineProps {
  status: string;
  createdAt: string;
  expectedDate?: string;
}

const OrderTimeline = ({ status, createdAt, expectedDate }: OrderTimelineProps) => {
  const steps = [
    { key: "pending", label: "Order Placed", icon: Clock },
    { key: "confirmed", label: "Confirmed", icon: CheckCircle2 },
    { key: "processing", label: "Processing", icon: Package },
    { key: "completed", label: "Completed", icon: Truck },
  ];

  const isCancelled = status === "cancelled";
  const currentStepIndex = steps.findIndex((s) => s.key === status);

  const getStepStatus = (index: number) => {
    if (isCancelled) return "cancelled";
    if (index < currentStepIndex) return "completed";
    if (index === currentStepIndex) return "current";
    return "upcoming";
  };

  return (
    <div className="py-4">
      {isCancelled ? (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
          <XCircle className="h-6 w-6 text-destructive" />
          <div>
            <p className="font-semibold text-destructive">Order Cancelled</p>
            <p className="text-sm text-muted-foreground">
              This order was cancelled. Please contact support for more details.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => {
              const stepStatus = getStepStatus(index);
              const Icon = step.icon;
              
              return (
                <div key={step.key} className="flex flex-col items-center flex-1">
                  <div className="relative flex items-center justify-center">
                    {/* Connecting line */}
                    {index > 0 && (
                      <div
                        className={`absolute right-1/2 w-full h-0.5 -translate-y-1/2 top-1/2 ${
                          stepStatus === "completed" || stepStatus === "current"
                            ? "bg-primary"
                            : "bg-muted"
                        }`}
                        style={{ width: "calc(100% - 2rem)", right: "calc(50% + 1rem)" }}
                      />
                    )}
                    
                    {/* Step circle */}
                    <div
                      className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                        stepStatus === "completed"
                          ? "bg-primary border-primary text-primary-foreground"
                          : stepStatus === "current"
                          ? "bg-primary/20 border-primary text-primary animate-pulse"
                          : "bg-muted border-muted-foreground/30 text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  
                  <span
                    className={`mt-2 text-xs text-center font-medium ${
                      stepStatus === "current"
                        ? "text-primary"
                        : stepStatus === "completed"
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 flex justify-between text-xs text-muted-foreground">
            <span>Ordered: {new Date(createdAt).toLocaleDateString()}</span>
            {expectedDate && (
              <span>Expected: {new Date(expectedDate).toLocaleDateString()}</span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default OrderTimeline;
