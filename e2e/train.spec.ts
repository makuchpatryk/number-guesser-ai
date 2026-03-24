import { test, expect, Page } from '@playwright/test';

// ─── helpers ────────────────────────────────────────────────────────────────

const cells = (page: Page) => page.locator('[data-testid="grid-cell"]');
const cell = (page: Page, row: number, col: number) =>
  page.locator(`[data-testid="grid-cell"][data-row="${row}"][data-col="${col}"]`);

const digitButton = (page: Page, n: number) =>
  page.getByRole('button', { name: String(n), exact: true });

const resultEntries = (page: Page) => page.locator('[data-testid="result-entry"]');
const entryTargets = (page: Page) => page.locator('[data-testid="result-entry-target"]');
const entryPatterns = (page: Page) => page.locator('[data-testid="result-entry-pattern"]');

// ─── setup ──────────────────────────────────────────────────────────────────

test.beforeEach(async ({ page }) => {
  // Przejdź do strony, wyczyść localStorage, przeładuj żeby app wystartował czysto
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForSelector('h1:has-text("Train")');
});

// ─── Smoke — struktura strony ────────────────────────────────────────────────

test.describe('Struktura strony', () => {
  test('wyświetla nagłówek "Train"', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Train' })).toBeVisible();
  });

  test('renderuje siatkę 3×3 z dokładnie 9 komórkami', async ({ page }) => {
    await expect(cells(page)).toHaveCount(9);
  });

  test('wszystkie komórki siatki są na początku nieaktywne (białe)', async ({ page }) => {
    const allCells = cells(page);
    const count = await allCells.count();
    for (let i = 0; i < count; i++) {
      await expect(allCells.nth(i)).not.toHaveAttribute('class', /bg-\[red\]/);
    }
  });

  test('renderuje 10 przycisków cyfr (0–9)', async ({ page }) => {
    for (let n = 0; n <= 9; n++) {
      await expect(digitButton(page, n)).toBeVisible();
    }
  });

  test('wyświetla przycisk "Save to file"', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Save to file' })).toBeVisible();
  });

  test('wyświetla link "Go to Checker"', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Go to Checker' })).toBeVisible();
  });

  test('wyświetla nagłówki listy wyników "Pattern" i "Result"', async ({ page }) => {
    await expect(page.getByText('Pattern')).toBeVisible();
    await expect(page.getByText('Result')).toBeVisible();
  });

  test('lista wyników jest pusta na starcie', async ({ page }) => {
    await expect(resultEntries(page)).toHaveCount(0);
  });
});

// ─── Interakcja z siatką ─────────────────────────────────────────────────────

test.describe('Interakcja z siatką', () => {
  test('kliknięcie komórki zmienia jej kolor na czerwony', async ({ page }) => {
    const c = cell(page, 0, 0);
    await expect(c).not.toHaveAttribute('class', /bg-\[red\]/);
    await c.click();
    await expect(c).toHaveAttribute('class', /bg-\[red\]/);
  });

  test('kliknięcie aktywnej komórki przywraca biały kolor (toggle)', async ({ page }) => {
    const c = cell(page, 1, 1);
    await c.click();
    await expect(c).toHaveAttribute('class', /bg-\[red\]/);
    await c.click();
    await expect(c).not.toHaveAttribute('class', /bg-\[red\]/);
  });

  test('można aktywować wiele komórek niezależnie', async ({ page }) => {
    await cell(page, 0, 0).click();
    await cell(page, 0, 2).click();
    await cell(page, 2, 1).click();

    await expect(cell(page, 0, 0)).toHaveAttribute('class', /bg-\[red\]/);
    await expect(cell(page, 0, 2)).toHaveAttribute('class', /bg-\[red\]/);
    await expect(cell(page, 2, 1)).toHaveAttribute('class', /bg-\[red\]/);
    // pozostałe dalej białe
    await expect(cell(page, 0, 1)).not.toHaveAttribute('class', /bg-\[red\]/);
    await expect(cell(page, 1, 0)).not.toHaveAttribute('class', /bg-\[red\]/);
  });
});

// ─── Przepływ trenowania ─────────────────────────────────────────────────────

test.describe('Przepływ trenowania', () => {
  test('kliknięcie cyfry na pustej siatce dodaje wpis do listy', async ({ page }) => {
    await digitButton(page, 0).click();
    await expect(resultEntries(page)).toHaveCount(1);
  });

  test('wpis zawiera poprawny target (cyfrę, którą kliknięto)', async ({ page }) => {
    await digitButton(page, 7).click();
    await expect(entryTargets(page).first()).toHaveText('7');
  });

  test('wpis zawiera wzorzec wejściowy (9 wartości 0/1)', async ({ page }) => {
    // Aktywuj komórkę (1,1) → input[4] = 1, reszta = 0
    await cell(page, 1, 1).click();
    await digitButton(page, 3).click();

    const pattern = await entryPatterns(page).first().textContent();
    // pattern to ciąg rozdzielony przecinkami, np. "0,0,0,0,1,0,0,0,0"
    expect(pattern).toBeTruthy();
    const values = pattern!.split(',').map(Number);
    expect(values).toHaveLength(9);
    expect(values[4]).toBe(1); // środkowa komórka (1,1)
    // pozostałe = 0
    values.forEach((v, i) => i !== 4 && expect(v).toBe(0));
  });

  test('siatka resetuje się do pustej po etykietowaniu', async ({ page }) => {
    await cell(page, 0, 0).click();
    await cell(page, 2, 2).click();
    await digitButton(page, 5).click();

    // Po kliknięciu cyfry siatka powinna być pusta
    const allCells = cells(page);
    const count = await allCells.count();
    for (let i = 0; i < count; i++) {
      await expect(allCells.nth(i)).not.toHaveAttribute('class', /bg-\[red\]/);
    }
  });

  test('można dodać wiele wzorców pod rząd', async ({ page }) => {
    await digitButton(page, 1).click();
    await cell(page, 0, 0).click();
    await digitButton(page, 2).click();
    await cell(page, 1, 1).click();
    await digitButton(page, 3).click();

    await expect(resultEntries(page)).toHaveCount(3);
  });

  test('każdy wpis ma unikalny target pasujący do klikniętej cyfry', async ({ page }) => {
    await digitButton(page, 4).click();
    await digitButton(page, 8).click();

    const targets = await entryTargets(page).allTextContents();
    expect(targets).toEqual(['4', '8']);
  });
});

// ─── Persystencja (localStorage) ─────────────────────────────────────────────

test.describe('Persystencja', () => {
  test('zapisuje wzorzec do localStorage po etykietowaniu', async ({ page }) => {
    await digitButton(page, 6).click();

    const stored = await page.evaluate(() => localStorage.getItem('result'));
    expect(stored).not.toBeNull();

    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].target).toBe(6);
    expect(parsed[0].input).toHaveLength(9);
  });

  test('wiele wzorców jest poprawnie akumulowanych w localStorage', async ({ page }) => {
    await digitButton(page, 1).click();
    await digitButton(page, 2).click();
    await digitButton(page, 3).click();

    const stored = await page.evaluate(() => localStorage.getItem('result'));
    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(3);
    expect(parsed.map((e: { target: number }) => e.target)).toEqual([1, 2, 3]);
  });

  test('wpisy są widoczne po przeładowaniu strony', async ({ page }) => {
    // Dodaj 2 wzorce
    await digitButton(page, 5).click();
    await digitButton(page, 9).click();
    await expect(resultEntries(page)).toHaveCount(2);

    // Przeładuj BEZ czyszczenia localStorage
    await page.reload();
    await page.waitForSelector('h1:has-text("Train")');

    // Wpisy muszą być nadal widoczne (async init ładuje z localStorage)
    await expect(resultEntries(page)).toHaveCount(2);
    const targets = await entryTargets(page).allTextContents();
    expect(targets).toEqual(['5', '9']);
  });
});

// ─── Nawigacja ───────────────────────────────────────────────────────────────

test.describe('Nawigacja', () => {
  test('link "Go to Checker" przenosi na stronę Checkera', async ({ page }) => {
    await page.getByRole('link', { name: 'Go to Checker' }).click();
    await expect(page.getByRole('heading', { name: 'Checker' })).toBeVisible();
    expect(page.url()).toContain('#/checker');
  });

  test('powrót z Checkera do Train działa poprawnie', async ({ page }) => {
    await page.getByRole('link', { name: 'Go to Checker' }).click();
    await expect(page.getByRole('heading', { name: 'Checker' })).toBeVisible();

    await page.getByRole('link', { name: 'Train' }).click();
    await expect(page.getByRole('heading', { name: 'Train' })).toBeVisible();
  });
});

