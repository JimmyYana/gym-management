import type { ReactNode } from "react";

export function FormField({ label, htmlFor, error, children }: {
  label: string;
  htmlFor?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="form-field">
      <div className="form-row">
        {htmlFor ? <label htmlFor={htmlFor}>{label}:</label> : <span>{label}:</span>}
        <div className="field-control">{children}</div>
      </div>
      {error && <p className="field-error" role="alert">{error}</p>}
    </div>
  );
}
