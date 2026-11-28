"use client";
import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";
import ActivationForm from "./ActivationForm";
import SuccessView from "./SuccessView";

export default function RequestActivationPage() {
  const t = useTranslations("auth.requestActivation");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);
    try {
      const response = await fetch("/api/auth/request-activation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Fehler beim Senden der Email");
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ein unerwarteter Fehler ist aufgetreten"
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) return <SuccessView t={t} />;
  return (
    <ActivationForm
      t={t}
      email={email}
      onEmailChange={setEmail}
      loading={loading}
      error={error}
      onSubmit={handleSubmit}
    />
  );
}
