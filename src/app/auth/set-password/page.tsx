"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import PasswordForm from "./PasswordForm";

export default function SetPasswordPage() {
  const router = useRouter();
  const _token = useSearchParams().get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to set password");
    } finally {
      setLoading(false);
    }
  };

  if (success) return <SuccessView />;
  return (
    <PasswordForm
      loading={loading}
      error={error}
      onSubmit={handleSubmit}
      password={password}
      confirmPassword={confirmPassword}
      onPasswordChange={setPassword}
      onConfirmChange={setConfirmPassword}
    />
  );
}

function SuccessView() {
  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "100px auto",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <h2>✅ Password gesetzt!</h2>
      <p>Wird weitergeleitet zur Anmeldung...</p>
    </div>
  );
}
