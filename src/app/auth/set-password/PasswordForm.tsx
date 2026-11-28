import { inputStyle, buttonStyle, containerStyle } from "./styles";

interface PasswordFormProps {
  loading: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
  password: string;
  confirmPassword: string;
  onPasswordChange: (v: string) => void;
  onConfirmChange: (v: string) => void;
}

export default function PasswordForm({
  loading,
  error,
  onSubmit,
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmChange,
}: PasswordFormProps) {
  return (
    <div style={containerStyle}>
      <h2>Passwort festlegen</h2>
      <p style={{ color: "#666", marginBottom: "24px" }}>
        Setze dein Passwort für den Tournament Planner Admin-Zugang.
      </p>

      {error && <ErrorBanner text={error} />}

      <form onSubmit={onSubmit}>
        <PasswordField password={password} onChange={onPasswordChange} />
        <PasswordField
          password={confirmPassword}
          onChange={onConfirmChange}
          placeholder="Passwort wiederholen"
          isConfirm
          match={password}
        />
        <button type="submit" disabled={loading} style={buttonStyle(loading)}>
          {loading ? "Wird gesetzt..." : "Passwort setzen"}
        </button>
      </form>
    </div>
  );
}

function ErrorBanner({ text }: { text: string }) {
  return (
    <div
      style={{
        padding: "12px",
        marginBottom: "16px",
        backgroundColor: "#fee2e2",
        color: "#dc2626",
        borderRadius: "8px",
        fontSize: "14px",
      }}
    >
      {text}
    </div>
  );
}

function PasswordField({
  password,
  onChange,
  placeholder = "Mindestens 6 Zeichen",
  isConfirm,
  match,
}: {
  password: string;
  onChange: (v: string) => void;
  placeholder?: string;
  isConfirm?: boolean;
  match?: string;
}) {
  const label = isConfirm ? "Passwort bestätigen" : "Passwort";
  const hasError = isConfirm
    ? password.length > 0 && password !== match
    : password.length > 0 && password.length < 6;
  const errorColor = hasError ? "#dc2626" : undefined;

  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ display: "block", marginBottom: "4px", fontWeight: 500 }}>
        {label}
      </label>
      <input
        type="password"
        value={password}
        onChange={(e) => onChange(e.target.value)}
        required
        minLength={6}
        style={{ ...inputStyle, borderColor: errorColor ?? "#d1d5db" }}
        placeholder={placeholder}
      />
    </div>
  );
}
