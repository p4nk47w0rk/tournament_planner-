interface ResetFormProps {
  loading: boolean;
  error: string | null;
  email: string;
  onEmailChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ResetForm({
  loading,
  error,
  email,
  onEmailChange,
  onSubmit,
}: ResetFormProps) {
  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", padding: "24px" }}>
      <h2>Passwort vergessen?</h2>
      <p style={{ color: "#666", marginBottom: "24px" }}>
        Gib deine E-Mail ein und wir senden dir einen Link zum Zurücksetzen.
      </p>

      {error && <ErrorBanner text={error} />}

      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{ display: "block", marginBottom: "4px", fontWeight: 500 }}
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            required
            style={inputStyle}
            placeholder="admin@tournament-planner.com"
          />
        </div>

        <SubmitButton loading={loading} />
      </form>

      <p style={{ textAlign: "center", marginTop: "24px" }}>
        <a href="/login" style={{ color: "#D97757", textDecoration: "none" }}>
          ← Zurück zum Login
        </a>
      </p>
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
      {loading ? "Wird gesendet..." : "Link senden"}
    </button>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "16px",
  boxSizing: "border-box",
};
