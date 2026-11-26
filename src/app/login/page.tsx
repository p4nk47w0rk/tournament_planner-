"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/supabase/hooks";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn(email, password);
      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Anmeldung fehlgeschlagen";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "100px auto",
        padding: "24px",
      }}
    >
      <h2>Login</h2>
      <p style={{ color: "#666", marginBottom: "24px" }}>
        Melde dich als Admin an, um Ergebnisse zu verwalten.
      </p>

      {error && (
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
          {error}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{ display: "block", marginBottom: "4px", fontWeight: 500 }}
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
            placeholder="admin@tournament-planner.com"
          />
        </div>

        <div style={{ marginBottom: "8px" }}>
          <label
            style={{ display: "block", marginBottom: "4px", fontWeight: 500 }}
          >
            Passwort
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ textAlign: "right", marginBottom: "24px" }}>
          <a
            href="/auth/forgot-password"
            style={{
              color: "#D97757",
              fontSize: "14px",
              textDecoration: "none",
            }}
          >
            Passwort vergessen?
          </a>
        </div>

        <button
          type="submit"
          disabled={loading || isLoading}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#D97757",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: loading || isLoading ? "not-allowed" : "pointer",
            marginBottom: "16px",
          }}
        >
          {loading ? "Anmelden..." : "Anmelden"}
        </button>
      </form>

      <p style={{ textAlign: "center", color: "#666", fontSize: "14px" }}>
        Noch kein Admin?{" "}
        <a href="/auth/request-activation" style={{ color: "#D97757" }}>
          Activation anfordern
        </a>
      </p>
    </div>
  );
}
