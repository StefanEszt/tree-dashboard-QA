import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const csvPath = path.join(__dirname, 'tree-results.csv');

// First: Decision table test
test('Verify filtering by Poor condition does not include other tree conditions', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Select Poor condition
  await page.selectOption('select', { label: 'Poor' });
  await page.waitForTimeout(1000);

  // Get all health values from the tree cards
  const healthValues = await page.$$eval('div.border.rounded-xl div.text-sm', (els) =>
    els.map(el => el.textContent || '')
  );

  // Extract health part
  const parsedHealth = healthValues.map(text => {
    const parts = text.split('–').map(s => s.trim());
    return parts.length > 1 ? parts[1] : '';
  });

  console.log('Tree health values:', parsedHealth);

  // Ensure all are Poor
  for (const health of parsedHealth) {
    expect(health).toBe('Poor');
  }
});

// Second: Export all results to CSV
test('Filter Poor Condition Trees and Export to CSV', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Select Poor condition
  await page.selectOption('select', { label: 'Poor' });
  await page.waitForTimeout(1000);

  // Keep clicking "Load More Trees" until the button disappears
  while (await page.$('button:has-text("Load More Trees")')) {
    await page.click('button:has-text("Load More Trees")');
    await page.waitForTimeout(500);
  }

  // Collect all visible tree cards
  const trees = (await page.$$eval('div.border.rounded-xl', (cards) => {
    return cards.map((card) => {
      const name = card.querySelector('span')?.textContent?.trim() || '';
      const details = card.querySelectorAll('div.text-sm');
      if (!name || details.length === 0) return null;

      const parts = details[0].textContent?.split('–').map(s => s.trim()) || [];
      const species = parts[0] || '';
      const health = parts[1] || '';
      const co2 = parts[2]?.replace('CO₂:', '').replace('kg', '').trim() || '';
      const address = card.querySelector('div.text-xs')?.textContent?.replace('📍', '').trim() || '';

      return { name, species, health, co2, address };
    });
  })).filter(Boolean);

  // Export to CSV
  const header = 'Name,Species,Health,CO2_kg,Address\n';
  const rows = trees.map(t => `${t.name},${t.species},${t.health},${t.co2},${t.address}`).join('\n');
  fs.writeFileSync(csvPath, header + rows, 'utf-8');

  console.log(`Exported ${trees.length} trees to`, csvPath);
  expect(trees.length).toBeGreaterThan(0);
});

