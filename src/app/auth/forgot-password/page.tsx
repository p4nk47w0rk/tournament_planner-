"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/set-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Reset fehlgeschlagen";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
        style={{
          maxWidth: "400px",
          margin: "100px auto",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <h2>✅ E-Mail gesendet!</h2>
        <p style={{ color: "#666", marginBottom: "24px" }}>
          Wir haben dir eine E-Mail mit einem Link zum Zurücksetzen deines
          Passworts geschickt. Prüfe dein Postfach.
        </p>
        <button
          onClick={() => router.push("/login")}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#D97757",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Zurück zum Login
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "100px auto",
        padding: "24px",
      }}
    >
      <h2>Passwort vergessen?</h2>
      <p style={{ color: "#666", marginBottom: "24px" }}>
        Gib deine E-Mail ein und wir senden dir einen Link zum Zurücksetzen.
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

      <form onSubmit={handleReset}>
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
      </form>

      <p style={{ textAlign: "center", marginTop: "24px" }}>
        <a href="/login" style={{ color: "#D97757", textDecoration: "none" }}>
          ← Zurück zum Login
        </a>
      </p>
    </div>
  );
}
