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
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForSelector('h1:has-text("Train")');
});

// ─── Page structure ──────────────────────────────────────────────────────────

test.describe('Page structure', () => {
  test('displays "Train the Model" heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Train the Model' })).toBeVisible();
  });

  test('renders 3×3 grid with exactly 9 cells', async ({ page }) => {
    await expect(cells(page)).toHaveCount(9);
  });

  test('all grid cells are inactive (not red) on load', async ({ page }) => {
    const allCells = cells(page);
    const count = await allCells.count();
    for (let i = 0; i < count; i++) {
      await expect(allCells.nth(i)).not.toHaveAttribute('class', /bg-\[red\]/);
    }
  });

  test('renders 10 digit buttons (0–9)', async ({ page }) => {
    for (let n = 0; n <= 9; n++) {
      await expect(digitButton(page, n)).toBeVisible();
    }
  });

  test('displays "Export Data" button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Export Data' })).toBeVisible();
  });

  test('displays "Go to Checker" link', async ({ page }) => {
    await expect(page.getByRole('link', { name: /Go to Checker/ })).toBeVisible();
  });

  test('displays training data table headers after first entry', async ({ page }) => {
    await digitButton(page, 0).click();
    await expect(page.getByText('Pattern')).toBeVisible();
    await expect(page.getByText('Target')).toBeVisible();
  });

  test('training data list is empty on load', async ({ page }) => {
    await expect(resultEntries(page)).toHaveCount(0);
  });
});

// ─── Grid interaction ────────────────────────────────────────────────────────

test.describe('Grid interaction', () => {
  test('clicking a cell marks it as active (red)', async ({ page }) => {
    const c = cell(page, 0, 0);
    await expect(c).not.toHaveAttribute('class', /bg-\[red\]/);
    await c.click();
    await expect(c).toHaveAttribute('class', /bg-\[red\]/);
  });

  test('clicking an active cell deactivates it (toggle)', async ({ page }) => {
    const c = cell(page, 1, 1);
    await c.click();
    await expect(c).toHaveAttribute('class', /bg-\[red\]/);
    await c.click();
    await expect(c).not.toHaveAttribute('class', /bg-\[red\]/);
  });

  test('multiple cells can be activated independently', async ({ page }) => {
    await cell(page, 0, 0).click();
    await cell(page, 0, 2).click();
    await cell(page, 2, 1).click();

    await expect(cell(page, 0, 0)).toHaveAttribute('class', /bg-\[red\]/);
    await expect(cell(page, 0, 2)).toHaveAttribute('class', /bg-\[red\]/);
    await expect(cell(page, 2, 1)).toHaveAttribute('class', /bg-\[red\]/);
    await expect(cell(page, 0, 1)).not.toHaveAttribute('class', /bg-\[red\]/);
    await expect(cell(page, 1, 0)).not.toHaveAttribute('class', /bg-\[red\]/);
  });
});

// ─── Training flow ───────────────────────────────────────────────────────────

test.describe('Training flow', () => {
  test('clicking a digit on an empty grid adds an entry to the list', async ({ page }) => {
    await digitButton(page, 0).click();
    await expect(resultEntries(page)).toHaveCount(1);
  });

  test('entry contains the correct target digit', async ({ page }) => {
    await digitButton(page, 7).click();
    await expect(entryTargets(page).first()).toHaveText('7');
  });

  test('entry contains valid input pattern (9 values)', async ({ page }) => {
    await cell(page, 1, 1).click();
    await digitButton(page, 3).click();

    const pattern = await entryPatterns(page).first().textContent();
    expect(pattern).toBeTruthy();
    const values = pattern!.split(',').map(Number);
    expect(values).toHaveLength(9);
    expect(values[4]).toBe(1); // center cell (1,1) → index 4
    values.forEach((v, i) => i !== 4 && expect(v).toBe(0));
  });

  test('grid resets after labeling', async ({ page }) => {
    await cell(page, 0, 0).click();
    await cell(page, 2, 2).click();
    await digitButton(page, 5).click();

    const allCells = cells(page);
    const count = await allCells.count();
    for (let i = 0; i < count; i++) {
      await expect(allCells.nth(i)).not.toHaveAttribute('class', /bg-\[red\]/);
    }
  });

  test('multiple patterns can be added sequentially', async ({ page }) => {
    await digitButton(page, 1).click();
    await cell(page, 0, 0).click();
    await digitButton(page, 2).click();
    await cell(page, 1, 1).click();
    await digitButton(page, 3).click();

    await expect(resultEntries(page)).toHaveCount(3);
  });

  test('each entry matches the digit that was clicked', async ({ page }) => {
    await digitButton(page, 4).click();
    await digitButton(page, 8).click();

    const targets = await entryTargets(page).allTextContents();
    expect(targets).toEqual(['4', '8']);
  });
});

// ─── Persistence ─────────────────────────────────────────────────────────────

test.describe('Persistence', () => {
  test('saves pattern to localStorage after labeling', async ({ page }) => {
    await digitButton(page, 6).click();

    const stored = await page.evaluate(() => localStorage.getItem('result'));
    expect(stored).not.toBeNull();

    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].target).toBe(6);
    expect(parsed[0].input).toHaveLength(9);
  });

  test('accumulates multiple patterns in localStorage', async ({ page }) => {
    await digitButton(page, 1).click();
    await digitButton(page, 2).click();
    await digitButton(page, 3).click();

    const stored = await page.evaluate(() => localStorage.getItem('result'));
    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(3);
    expect(parsed.map((e: { target: number }) => e.target)).toEqual([1, 2, 3]);
  });

  test('entries are visible after page reload', async ({ page }) => {
    await digitButton(page, 5).click();
    await digitButton(page, 9).click();
    await expect(resultEntries(page)).toHaveCount(2);

    await page.reload();
    await page.waitForSelector('h1:has-text("Train")');

    await expect(resultEntries(page)).toHaveCount(2);
    const targets = await entryTargets(page).allTextContents();
    expect(targets).toEqual(['5', '9']);
  });
});

// ─── Navigation ──────────────────────────────────────────────────────────────

test.describe('Navigation', () => {
  test('"Go to Checker" link navigates to the Checker page', async ({ page }) => {
    await page.getByRole('link', { name: /Go to Checker/ }).click();
    await expect(page.getByRole('heading', { name: 'Check the Model' })).toBeVisible();
    expect(page.url()).toContain('#/checker');
  });

  test('can navigate back from Checker to Train', async ({ page }) => {
    await page.getByRole('link', { name: /Go to Checker/ }).click();
    await expect(page.getByRole('heading', { name: 'Check the Model' })).toBeVisible();

    await page.getByRole('link', { name: 'Train' }).first().click();
    await expect(page.getByRole('heading', { name: 'Train the Model' })).toBeVisible();
  });
});
