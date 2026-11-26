import { createClient } from "@/lib/supabase/server";
import ImprintCard from "./ImprintCard";
import PrivacyCard from "./PrivacyCard";

/* ============================================
 * Fallback-Daten (wenn DB noch nicht existiert)
 * ============================================ */

const FALLBACK_IMPRINT = {
  company: "Tournament Planner",
  owner: "Max Mustermann",
  street: "Musterstraße 1",
  postal_code: "01234",
  city: "Musterstadt",
  email: "kontakt@tournament-planner.app",
  phone: "+49 123 456 789",
  vat_id: "DE123456789",
  register_court: "Amtsgericht Musterstadt",
  register_number: "HRB 12345",
};

const FALLBACK_PRIVACY = [
  {
    title: "1. Verantwortlicher",
    content:
      "Verantwortliche Stelle im Sinne der Datenschutz-Grundverordnung (DSGVO) ist der Betreiber dieser Website.",
  },
  {
    title: "2. Erhebung und Speicherung von Daten",
    content:
      "Beim Besuch dieser Website werden automatisch Informationen vom Browser des Besuchers an den Server übermittelt und vorübergehend gespeichert. Dies umfasst: IP-Adresse, Browsertyp und -version, Betriebssystem, Referrer-URL, Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage.",
  },
  {
    title: "3. Hosting",
    content:
      "Diese Website wird über Vercel Inc. (440 N Barranca Ave, Covina, CA 91723, USA) gehostet. Beim Aufruf werden technische Daten an die Server von Vercel übermittelt und in Log-Dateien gespeichert.",
  },
  {
    title: "4. Supabase (Datenbank & Authentifizierung)",
    content:
      "Zur Bereitstellung der Turnier-Funktionen wird Supabase (Supabase Inc., San Francisco, USA) als Datenbank- und Authentifizierungsdienst eingesetzt. Dabei werden E-Mail-Adresse und Profil-Daten verarbeitet. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse). Die Datenverarbeitung erfolgt auf Servern in den USA. Es wurden Standardvertragsklauseln abgeschlossen.",
  },
  {
    title: "5. Cookies",
    content:
      "Diese Website verwendet ausschließlich technisch notwendige Cookies: ein Cookie für die Sprachwahl (NEXT_LOCALE) und Authentifizierungs-Cookies über Supabase Auth. Es werden keine Tracking- oder Marketing-Cookies eingesetzt.",
  },
  {
    title: "6. Kontaktmöglichkeit",
    content:
      "Bei einer Kontaktaufnahme per E-Mail werden Ihre Angaben zum Zweck der Bearbeitung gespeichert. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO. Die Daten werden nach Abschluss der Bearbeitung gelöscht.",
  },
  {
    title: "7. Ihre Rechte",
    content:
      "Sie haben folgende Rechte:\n- Auskunft (Art. 15 DSGVO)\n- Berichtigung (Art. 16 DSGVO)\n- Löschung (Art. 17 DSGVO)\n- Einschränkung der Verarbeitung (Art. 18 DSGVO)\n- Datenübertragbarkeit (Art. 20 DSGVO)\n- Widerspruch (Art. 21 DSGVO)\n- Beschwerderecht bei einer Aufsichtsbehörde (Art. 77 DSGVO)",
  },
];

/* ============================================
 * Server-Component
 * ============================================ */

export default async function SettingsContent({
  settingsKey,
}: {
  settingsKey: "imprint" | "privacy";
}) {
  const locale = "de"; // Fallback; locale wird vom Server aus dem Cookie gelesen
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("setting_key", settingsKey)
    .eq("locale", locale)
    .single();

  if (error || !data) {
    if (settingsKey === "imprint")
      return <ImprintCard settings={FALLBACK_IMPRINT} />;
    return <PrivacyCard sections={FALLBACK_PRIVACY} />;
  }

  const value = data.value as Record<string, unknown>;

  if (settingsKey === "imprint" && "company" in value) {
    return (
      <ImprintCard settings={value as Record<string, string | undefined>} />
    );
  }

  if (settingsKey === "privacy" && "sections" in value) {
    return (
      <PrivacyCard
        sections={value.sections as Array<{ title: string; content: string }>}
      />
    );
  }

  // Fallback
  if (settingsKey === "imprint")
    return <ImprintCard settings={FALLBACK_IMPRINT} />;
  return <PrivacyCard sections={FALLBACK_PRIVACY} />;
}
