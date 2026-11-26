-- ============================================
-- Site Settings (Impressum, Datenschutzerklärung)
-- ============================================

CREATE TABLE IF NOT EXISTS site_settings (
  id BIGSERIAL PRIMARY KEY,
  setting_key TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'de' CHECK (locale IN ('de', 'cs')),
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(setting_key, locale)
);

-- Index for fast lookups
CREATE INDEX idx_site_settings_key_locale ON site_settings (setting_key, locale);

-- Realtime (optional, nicht nötig für statische Seiten)
-- ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can read site_settings (Impressum/Datenschutz öffentlich)
CREATE POLICY "Anyone can read site_settings"
  ON site_settings FOR SELECT
  USING (true);

-- Only authenticated users can write (admin/edit)
CREATE POLICY "Authenticated users can insert site_settings"
  ON site_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update site_settings"
  ON site_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete site_settings"
  ON site_settings FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Trigger: auto-update updated_at
CREATE TRIGGER IF NOT EXISTS site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- Seed: Impressum DE (Standard)
-- ============================================
INSERT INTO site_settings (setting_key, locale, value) VALUES (
  'imprint',
  'de',
  '{
    "company": "Tournament Planner",
    "legal_form": "e. K.",
    "owner": "Max Mustermann",
    "street": "Musterstraße 1",
    "postal_code": "01234",
    "city": "Musterstadt",
    "country": "Deutschland",
    "email": "kontakt@tournament-planner.app",
    "phone": "+49 123 456 789",
    "vat_id": "DE123456789",
    "register_court": "Amtsgericht Musterstadt",
    "register_number": "HRB 12345"
  }'
) ON CONFLICT (setting_key, locale) DO NOTHING;

-- ============================================
-- Seed: Impressum CS (Standard)
-- ============================================
INSERT INTO site_settings (setting_key, locale, value) VALUES (
  'imprint',
  'cs',
  '{
    "company": "Tournament Planner",
    "legal_form": "e. K.",
    "owner": "Max Mustermann",
    "street": "Musterstraße 1",
    "postal_code": "01234",
    "city": "Musterstadt",
    "country": "Deutschland",
    "email": "kontakt@tournament-planner.app",
    "phone": "+49 123 456 789",
    "vat_id": "DE123456789",
    "register_court": "Amtsgericht Musterstadt",
    "register_number": "HRB 12345"
  }'
) ON CONFLICT (setting_key, locale) DO NOTHING;

-- ============================================
-- Seed: Datenschutzerklärung DE (Standard)
-- ============================================
INSERT INTO site_settings (setting_key, locale, value) VALUES (
  'privacy',
  'de',
  '{
    "sections": [
      {
        "title": "1. Verantwortlicher",
        "content": "Verantwortliche Stelle im Sinne der Datenschutz-Grundverordnung (DSGVO) ist die oben genannte Stellen."
      },
      {
        "title": "2. Server-Log-Dateien",
        "content": "Der Provider erhebt und speichert automatisch Informationen in sogenannten Server-Log-Dateien, die Ihr Browser automatisch übermittelt. Dies sind: Browsertyp/Version, verwendetes Betriebssystem, Referrer URL, Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage, IP-Adresse. Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen."
      },
      {
        "title": "3. Hosting",
        "content": "Diese Website wird bei Vercel Inc. gehostet. Anbieter ist Vercel Inc., 440 N Barranca Ave, Covina, CA 91723, USA. Beim Aufruf unserer Website werden bestimmte Daten (u. a. IP-Adresse) an die Server von Vercel übermittelt und dort in Log-Dateien gespeichert."
      },
      {
        "title": "4. Supabase (Datenbank & Authentifizierung)",
        "content": "Wir nutzen Supabase (Supabase Inc., 548 Jackson St, San Francisco, CA 94111, USA) als Datenbank und Authentifizierungsdienst. Bei der Nutzung unserer Plattform werden folgende Daten verarbeitet: E-Mail-Adresse (zur Anmeldung), Benutzerprofil-Daten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem funktionsfähigen Turnier-Management-System). Supabase verarbeitet Daten auf Servern in den USA. Für die Datenübermittlung in die USA wurden Standardvertragsklauseln abgeschlossen."
      },
      {
        "title": "5. Cookies",
        "content": "Diese Website verwendet ausschließlich technisch notwendige Cookies, insbesondere ein Cookie zur Speicherung der Sprachwahl (NEXT_LOCALE) und Authentifizierungs-Cookies über Supabase Auth. Keine Tracking- oder Marketing-Cookies."
      },
      {
        "title": "6. Kontaktmöglichkeit",
        "content": "Wenn Sie uns per E-Mail kontaktieren, werden Ihre Angaben (Name, E-Mail, Inhalt) gespeichert, um Ihre Anfrage zu bearbeiten. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO. Die Daten werden nach abschließender Bearbeitung der Anfrage gelöscht."
      },
      {
        "title": "7. Ihre Rechte",
        "content": "Sie haben gegenüber uns folgende Rechte:\n- Recht auf Auskunft (Art. 15 DSGVO)\n- Recht auf Berichtigung (Art. 16 DSGVO)\n- Recht auf Löschung (Art. 17 DSGVO)\n- Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)\n- Recht auf Datenübertragbarkeit (Art. 20 DSGVO)\n- Widerspruchsrecht (Art. 21 DSGVO)\n- Recht auf Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO)"
      }
    ]
  }'
) ON CONFLICT (setting_key, locale) DO NOTHING;

-- ============================================
-- Seed: Datenschutzerklärung CS (Standard)
-- ============================================
INSERT INTO site_settings (setting_key, locale, value) VALUES (
  'privacy',
  'cs',
  '{
    "sections": [
      {
        "title": "1. Odpovědná osoba",
        "content": "Odpovědnou osobou ve smyslu Nařízení o ochraně osobních údajů (GDPR) je výše uvedený provozovatel."
      },
      {
        "title": "2. Protokoly serveru",
        "content": "Provozovatel automaticky shromažďuje a ukládá informace v tzv. protokolech serveru, které váš prohlížeč automaticky předává. Jedná se o: typ/verzi prohlížeče, používaný operační systém, referrer URL, hostname připojeného počítače, čas serverového požadavku, IP adresu. Spojení těchto dat s jinými zdroji dat se neprovádí."
      },
      {
        "title": "3. Hosting",
        "content": "Tato webová stránka je hostována u Vercel Inc. Poskytovatelem je Vercel Inc., 440 N Barranca Ave, Covina, CA 91723, USA. Při návštěvě naší webové stránky jsou určité údaje (včetně IP adresy) odeslány na servery Vercel a uloženy v log souborech."
      },
      {
        "title": "4. Supabase (databáze a autentizace)",
        "content": "Používáme Supabase (Supabase Inc., 548 Jackson St, San Francisco, CA 94111, USA) jako databázovou a autentizační službu. Při používání naší platformy jsou zpracovávány následující údaje: e-mailová adresa (pro registraci), údaje uživatelského profilu. Právním základem je čl. 6 odst. 1 písm. f GDPR (oprávněný zájem o funkční systém pro správu turnajů). Supabase zpracovává data na serverech v USA. Pro přenos dat do USA byly sjednány standardní smluvní doložky."
      },
      {
        "title": "5. Cookie",
        "content": "Tato webová stránka používá pouze technicky nezbytné cookie, zejména cookie pro uložení výběru jazyka (NEXT_LOCALE) a autentizační cookie přes Supabase Auth. Žádné trackovací nebo marketingové cookie."
      },
      {
        "title": "6. Možnost kontaktu",
        "content": "Pokud nás kontaktujete e-mailem, vaše údaje (jméno, e-mail, obsah) budou uloženy pro zpracování vaší žádosti. Právním základem je čl. 6 odst. 1 písm. b GDPR. Údaje budou po ukončení zpracování žádosti smazány."
      },
      {
        "title": "7. Vaše práva",
        "content": "Máte následující práva:\n- Právo na výpis údajů (čl. 15 GDPR)\n- Právo na opravu (čl. 16 GDPR)\n- Právo na výmaz (čl. 17 GDPR)\n- Právo na omezení zpracování (čl. 18 GDPR)\n- Právo na přenositelnost údajů (čl. 20 GDPR)\n- Právo na námitku (čl. 21 GDPR)\n- Právo na stížnost u dozorového úřadu (čl. 77 GDPR)"
      }
    ]
  }'
) ON CONFLICT (setting_key, locale) DO NOTHING;
