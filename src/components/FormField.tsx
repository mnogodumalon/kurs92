interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}

export function FormField({ label, required, children, hint }: FormFieldProps) {
  return (
    <div style={{ marginBottom: "1.125rem" }}>
      <label
        style={{
          display: "block",
          fontSize: "0.8125rem",
          fontWeight: 600,
          color: "var(--foreground)",
          marginBottom: "0.375rem",
          letterSpacing: "-0.01em",
        }}
      >
        {label}
        {required && <span style={{ color: "oklch(0.577 0.245 27.325)", marginLeft: "0.25rem" }}>*</span>}
      </label>
      {children}
      {hint && (
        <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", marginTop: "0.25rem" }}>{hint}</p>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.625rem 0.875rem",
  borderRadius: "0.5rem",
  border: "1px solid var(--input)",
  background: "var(--background)",
  fontSize: "0.9375rem",
  color: "var(--foreground)",
  fontFamily: "var(--font-sans)",
  outline: "none",
  transition: "border-color 0.15s ease, box-shadow 0.15s ease",
  boxSizing: "border-box",
};

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function TextInput(props: TextInputProps) {
  return (
    <input
      {...props}
      style={inputStyle}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "oklch(0.52 0.22 264)";
        e.currentTarget.style.boxShadow = "0 0 0 3px oklch(0.52 0.22 264 / 0.15)";
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "var(--input)";
        e.currentTarget.style.boxShadow = "none";
        props.onBlur?.(e);
      }}
    />
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function TextAreaInput(props: TextAreaProps) {
  return (
    <textarea
      {...props}
      rows={props.rows ?? 3}
      style={{ ...inputStyle, resize: "vertical", minHeight: 80 }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "oklch(0.52 0.22 264)";
        e.currentTarget.style.boxShadow = "0 0 0 3px oklch(0.52 0.22 264 / 0.15)";
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "var(--input)";
        e.currentTarget.style.boxShadow = "none";
        props.onBlur?.(e);
      }}
    />
  );
}

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}

export function SelectInput(props: SelectInputProps) {
  return (
    <select
      {...props}
      style={{ ...inputStyle, appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 0.875rem center", paddingRight: "2.5rem" }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "oklch(0.52 0.22 264)";
        e.currentTarget.style.boxShadow = "0 0 0 3px oklch(0.52 0.22 264 / 0.15)";
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "var(--input)";
        e.currentTarget.style.boxShadow = "none";
        props.onBlur?.(e);
      }}
    />
  );
}

interface CheckboxInputProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export function CheckboxInput({ checked, onChange, label }: CheckboxInputProps) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: "0.625rem", cursor: "pointer" }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{
          width: 18,
          height: 18,
          accentColor: "oklch(0.52 0.22 264)",
          cursor: "pointer",
        }}
      />
      <span style={{ fontSize: "0.9375rem", color: "var(--foreground)", fontWeight: 500 }}>{label}</span>
    </label>
  );
}
