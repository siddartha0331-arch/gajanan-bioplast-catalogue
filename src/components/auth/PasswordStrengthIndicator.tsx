import { useMemo } from "react";
import { Check, X } from "lucide-react";

interface PasswordStrengthIndicatorProps {
  password: string;
}

export const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
  const requirements = useMemo(() => {
    return [
      { label: "At least 6 characters", met: password.length >= 6 },
      { label: "Contains a number", met: /\d/.test(password) },
      { label: "Contains uppercase", met: /[A-Z]/.test(password) },
      { label: "Contains lowercase", met: /[a-z]/.test(password) },
    ];
  }, [password]);

  const strength = useMemo(() => {
    const metCount = requirements.filter((r) => r.met).length;
    if (metCount <= 1) return { label: "Weak", color: "bg-destructive", width: "25%" };
    if (metCount === 2) return { label: "Fair", color: "bg-orange-500", width: "50%" };
    if (metCount === 3) return { label: "Good", color: "bg-yellow-500", width: "75%" };
    return { label: "Strong", color: "bg-green-500", width: "100%" };
  }, [requirements]);

  if (!password) return null;

  return (
    <div className="space-y-2 mt-2">
      {/* Strength bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full ${strength.color} transition-all duration-300`}
            style={{ width: strength.width }}
          />
        </div>
        <span className="text-xs font-medium text-muted-foreground">{strength.label}</span>
      </div>

      {/* Requirements list */}
      <ul className="space-y-1">
        {requirements.map((req) => (
          <li key={req.label} className="flex items-center gap-2 text-xs">
            {req.met ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <X className="h-3 w-3 text-muted-foreground" />
            )}
            <span className={req.met ? "text-green-600" : "text-muted-foreground"}>
              {req.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
