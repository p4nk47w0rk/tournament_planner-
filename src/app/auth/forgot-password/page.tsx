"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ResetForm from "./ResetForm";

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
      setError(err instanceof Error ? err.message : "Reset fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return <SuccessView router={router} />;
  }

  return (
    <ResetForm
      loading={loading}
      error={error}
      email={email}
      onEmailChange={setEmail}
      onSubmit={handleReset}
    />
  );
}

function SuccessView({ router }: { router: ReturnType<typeof useRouter> }) {
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
