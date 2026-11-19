import type { ComponentProps } from "react";

export function Button({ className = "", type = "button", ...props }: ComponentProps<"button">) {
  return <button {...props} type={type} className={`button ${className}`} />;
}

export function Input({ className = "", ...props }: ComponentProps<"input">) {
  return <input {...props} className={`line-input ${className}`} />;
}

export function Select({ className = "", ...props }: ComponentProps<"select">) {
  return <select {...props} className={`line-input ${className}`} />;
}
