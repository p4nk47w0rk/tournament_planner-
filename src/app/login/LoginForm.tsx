interface LoginFormProps {
  loading: boolean;
  isLoading: boolean;
  error: string | null;
  email: string;
  password: string;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "16px",
  boxSizing: "border-box",
};

export default function LoginForm({
  loading,
  isLoading,
  error,
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) {
  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", padding: "24px" }}>
      <h2>Login</h2>
      <p style={{ color: "#666", marginBottom: "24px" }}>
        Melde dich als Admin an, um Ergebnisse zu verwalten.
      </p>

      {error && <ErrorBanner text={error} />}

      <form onSubmit={onSubmit}>
        <Field label="Email">
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            required
            style={inputStyle}
            placeholder="admin@tournament-planner.com"
          />
        </Field>

        <Field label="Passwort">
          <input
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            required
            style={inputStyle}
          />
        </Field>

        <ForgotPasswordLink />
        <SubmitButton loading={loading || isLoading} />
      </form>

      <ActivationLink />
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ display: "block", marginBottom: "4px", fontWeight: 500 }}>
        {label}
      </label>
      {children}
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

function ForgotPasswordLink() {
  return (
    <div style={{ textAlign: "right", marginBottom: "24px" }}>
      <a
        href="/auth/forgot-password"
        style={{ color: "#D97757", fontSize: "14px", textDecoration: "none" }}
      >
        Passwort vergessen?
      </a>
    </div>
  );
}

function SubmitButton({ loading }: { loading: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      style={{
        width: "100%",
        padding: "12px",
        backgroundColor: "#D97757",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: 600,
        cursor: loading ? "not-allowed" : "pointer",
        marginBottom: "16px",
      }}
    >
      {loading ? "Anmelden..." : "Anmelden"}
    </button>
  );
}

function ActivationLink() {
  return (
    <p style={{ textAlign: "center", color: "#666", fontSize: "14px" }}>
      Noch kein Admin?{" "}
      <a href="/auth/request-activation" style={{ color: "#D97757" }}>
        Activation anfordern
      </a>
    </p>
  );
}
