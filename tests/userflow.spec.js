import { test, expect } from "@playwright/test";

const MOCK_RESULT = {
  headline: "Du bist ein Macher mit Herz und Verstand.",
  insight:
    "Du vereinst analytisches Denken mit echtem Interesse an Menschen. Diese seltene Kombination macht dich besonders wertvoll in Rollen, die Brücken bauen.",
  paths: [
    {
      title: "UX Researcher",
      match: 92,
      why: "Deine Empathie und analytische Stärke sind perfekt für User Research geeignet.",
      first_step: "Melde dich für den kostenlosen Google UX Design Kurs auf Coursera an.",
      time: "6–12 Monate",
    },
    {
      title: "Projektmanager Digital",
      match: 87,
      why: "Deine strukturierte Denkweise passt ideal zum Projektmanagement in digitalen Teams.",
      first_step: "Starte die CAPM-Prüfungsvorbereitung auf PMI.org.",
      time: "3–6 Monate",
    },
    {
      title: "Datenanalyst",
      match: 81,
      why: "Mit deinem analytischen Mindset wäre Data Analytics ein natürlicher Übergang.",
      first_step: "Beginne mit SQL-Grundlagen auf Khan Academy – kostenlos, 4 Stunden.",
      time: "9–18 Monate",
    },
  ],
};

test.describe("SkillingUp — User Flows", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("https://formspree.io/**", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) })
    );
    await page.route("https://api.anthropic.com/**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ content: [{ text: JSON.stringify(MOCK_RESULT) }] }),
      })
    );
    await page.goto("/");
  });

  test("hero page: headline and CTA visible", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Dein Job verändert sich");
    await expect(page.getByRole("button", { name: /MEINEN WEG FINDEN/ })).toBeVisible();
    await expect(page.getByText("✓ Kostenlos")).toBeVisible();
    await expect(page.getByText("✓ 3 Minuten")).toBeVisible();
  });

  test("hero: feature cards visible", async ({ page }) => {
    const cards = page.locator(".su-feature-card__title");
    await expect(cards.filter({ hasText: "Persönlichkeit" })).toBeVisible();
    await expect(cards.filter({ hasText: "Werte" })).toBeVisible();
    await expect(cards.filter({ hasText: "3 konkrete Wege" })).toBeVisible();
  });

  test("hero CTA → job step", async ({ page }) => {
    await page.getByRole("button", { name: /MEINEN WEG FINDEN/ }).click();
    await expect(page.getByText("SCHRITT 1 VON 3")).toBeVisible();
    await expect(page.getByText("Wo kommst du her?")).toBeVisible();
  });

  test("job step: continue disabled without both inputs", async ({ page }) => {
    await page.getByRole("button", { name: /MEINEN WEG FINDEN/ }).click();
    const continueBtn = page.getByRole("button", { name: /WEITER/ });
    await expect(continueBtn).toBeDisabled();

    await page.locator("input").first().fill("Buchhalter");
    await expect(continueBtn).toBeDisabled();

    await page.locator("input").last().fill("8");
    await expect(continueBtn).toBeEnabled();
  });

  test("personality: continue disabled until all answered", async ({ page }) => {
    await page.getByRole("button", { name: /MEINEN WEG FINDEN/ }).click();
    await page.locator("input").first().fill("Buchhalter");
    await page.locator("input").last().fill("8");
    await page.getByRole("button", { name: /WEITER/ }).click();

    await expect(page.getByText("SCHRITT 2 VON 3")).toBeVisible();
    const continueBtn = page.getByRole("button", { name: /WEITER/ });
    await expect(continueBtn).toBeDisabled();

    await page.getByText("Im Austausch mit anderen Menschen").click();
    await page.getByText("Konkrete Aufgaben mit klarem Ergebnis").click();
    await page.getByText("Logisch und datenbasiert").click();
    await page.getByText("Ich suche aktiv nach Neuem").click();
    await expect(continueBtn).toBeEnabled();
  });

  test("full happy path: hero → job → personality → values → gate → result", async ({ page }) => {
    // Hero
    await page.getByRole("button", { name: /MEINEN WEG FINDEN/ }).click();

    // Job
    await page.locator("input").first().fill("Sachbearbeiter");
    await page.locator("input").last().fill("12");
    await page.getByRole("button", { name: /WEITER/ }).click();

    // Personality
    await page.getByText("Im Austausch mit anderen Menschen").click();
    await page.getByText("Konkrete Aufgaben mit klarem Ergebnis").click();
    await page.getByText("Logisch und datenbasiert").click();
    await page.getByText("Ich suche aktiv nach Neuem").click();
    await page.getByRole("button", { name: /WEITER/ }).click();

    // Values
    await expect(page.getByText("SCHRITT 3 VON 3")).toBeVisible();
    await page.getByText("Menschen helfen und begleiten").click();
    await page.getByText("Isoliert, ohne Teamkontakt").click();
    await page.getByRole("button", { name: /ANALYSE STARTEN/ }).click();

    // Gate
    await expect(page.getByText("DEINE ANALYSE IST BEREIT")).toBeVisible();
    const submitBtn = page.getByRole("button", { name: /MEIN ERGEBNIS/ });
    await expect(submitBtn).toBeDisabled();

    await page.locator('input[type="email"]').fill("test@example.com");
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();

    // Result
    await expect(page.getByText("DEIN PROFIL")).toBeVisible();
    await expect(page.getByText("Du bist ein Macher mit Herz und Verstand.")).toBeVisible();
    await expect(page.getByText("DEINE 3 WEGE")).toBeVisible();
    await expect(page.getByText("UX Researcher")).toBeVisible();
    await expect(page.getByText("92% Match")).toBeVisible();
  });

  test("gate: Enter key submits when email filled", async ({ page }) => {
    await page.getByRole("button", { name: /MEINEN WEG FINDEN/ }).click();
    await page.locator("input").first().fill("Buchhalter");
    await page.locator("input").last().fill("5");
    await page.getByRole("button", { name: /WEITER/ }).click();
    await page.getByText("Im Austausch mit anderen Menschen").click();
    await page.getByText("Konkrete Aufgaben mit klarem Ergebnis").click();
    await page.getByText("Logisch und datenbasiert").click();
    await page.getByText("Ich suche aktiv nach Neuem").click();
    await page.getByRole("button", { name: /WEITER/ }).click();
    await page.getByText("Menschen helfen und begleiten").click();
    await page.getByText("Isoliert, ohne Teamkontakt").click();
    await page.getByRole("button", { name: /ANALYSE STARTEN/ }).click();

    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill("enter@test.de");
    await emailInput.press("Enter");

    await expect(page.getByText("DEIN PROFIL")).toBeVisible();
  });

  test("result: reset returns to hero", async ({ page }) => {
    await page.getByRole("button", { name: /MEINEN WEG FINDEN/ }).click();
    await page.locator("input").first().fill("Test");
    await page.locator("input").last().fill("3");
    await page.getByRole("button", { name: /WEITER/ }).click();
    await page.getByText("Im Austausch mit anderen Menschen").click();
    await page.getByText("Konkrete Aufgaben mit klarem Ergebnis").click();
    await page.getByText("Logisch und datenbasiert").click();
    await page.getByText("Ich suche aktiv nach Neuem").click();
    await page.getByRole("button", { name: /WEITER/ }).click();
    await page.getByText("Menschen helfen und begleiten").click();
    await page.getByText("Isoliert, ohne Teamkontakt").click();
    await page.getByRole("button", { name: /ANALYSE STARTEN/ }).click();
    await page.locator('input[type="email"]').fill("reset@test.de");
    await page.getByRole("button", { name: /MEIN ERGEBNIS/ }).click();
    await expect(page.getByText("DEIN PROFIL")).toBeVisible();

    await page.getByRole("button", { name: /NOCHMAL STARTEN/ }).click();
    await expect(page.locator("h1")).toContainText("Dein Job verändert sich");
  });
});

test.describe("SkillingUp — Mobile viewport (375px)", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    await page.route("https://formspree.io/**", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) })
    );
    await page.route("https://api.anthropic.com/**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ content: [{ text: JSON.stringify(MOCK_RESULT) }] }),
      })
    );
    await page.goto("/");
  });

  test("hero renders and CTA is accessible on mobile", async ({ page }) => {
    await expect(page.locator("h1")).toBeVisible();
    const cta = page.getByRole("button", { name: /MEINEN WEG FINDEN/ });
    await expect(cta).toBeVisible();
    const box = await cta.boundingBox();
    expect(box.height).toBeGreaterThanOrEqual(44);
  });

  test("full flow works on mobile", async ({ page }) => {
    await page.getByRole("button", { name: /MEINEN WEG FINDEN/ }).click();
    await page.locator("input").first().fill("Buchhalter");
    await page.locator("input").last().fill("7");
    await page.getByRole("button", { name: /WEITER/ }).click();
    await page.getByText("Im Austausch mit anderen Menschen").click();
    await page.getByText("Konkrete Aufgaben mit klarem Ergebnis").click();
    await page.getByText("Logisch und datenbasiert").click();
    await page.getByText("Ich suche aktiv nach Neuem").click();
    await page.getByRole("button", { name: /WEITER/ }).click();
    await page.getByText("Menschen helfen und begleiten").click();
    await page.getByText("Isoliert, ohne Teamkontakt").click();
    await page.getByRole("button", { name: /ANALYSE STARTEN/ }).click();
    await page.locator('input[type="email"]').fill("mobile@test.de");
    await page.getByRole("button", { name: /MEIN ERGEBNIS/ }).click();
    await expect(page.getByText("DEIN PROFIL")).toBeVisible();
  });
});
