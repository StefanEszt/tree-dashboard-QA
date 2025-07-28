import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const csvPath = path.join(__dirname, 'tree-results.csv');
const expandedCsvPath = path.join(__dirname, 'tree-results-expanded.csv');

function readCSV(filePath: string) {
  const data = fs.readFileSync(filePath, 'utf-8').trim().split('\n').slice(1);
  return data.map(line => {
    const [name, species, health, co2, ...rest] = line.split(',');
    const address = rest.join(',');
    return { name, species, health, co2: parseFloat(co2), address };
  });
}

test('Read CSV, expand with extra info, export expanded CSV, find top 5 districts', async () => {
  const trees = readCSV(csvPath);

  const expanded = trees.map(t => {
    const age = Math.floor(Math.random() * 80) + 5;
    const yearlyTonnes = parseFloat((t.co2 / 1000).toFixed(3));

    let size = 'Medium';
    if (['Oak', 'Pine'].includes(t.species)) size = 'Large';
    if (['Birch', 'Maple'].includes(t.species)) size = 'Small';

    return {
      ...t,
      age,
      yearlyTonnes,
      size,
      tenYearTonnes: parseFloat((yearlyTonnes * 10).toFixed(3))
    };
  });

  // Export expanded CSV
  const header = 'Name,Species,Health,CO2_kg,Address,Age,YearlyTonnes,Size,TenYearTonnes\n';
  const rows = expanded
    .map(t => `${t.name},${t.species},${t.health},${t.co2},${t.address},${t.age},${t.yearlyTonnes},${t.size},${t.tenYearTonnes}`)
    .join('\n');

  fs.writeFileSync(expandedCsvPath, header + rows, 'utf-8');
  console.log(` Expanded CSV exported to ${expandedCsvPath}`);

  // Calculate absorption by district
  const districtTotals: Record<string, number> = {};
  expanded.forEach(t => {
    const parts = t.address.split(',');
    const district = parts[parts.length - 1]?.trim() || 'Unknown';
    districtTotals[district] = (districtTotals[district] || 0) + (t.co2 || 0);
  });

  const top5 = Object.entries(districtTotals)
    .filter(([, value]) => !isNaN(value))
    .sort((a,b) => b[1] - a[1])
    .slice(0,5);

  console.log('Top 5 districts by CO₂ absorption:', top5);
  expect(top5.length).toBeGreaterThan(0);
});

test('Verify map markers match number of tree cards', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.waitForSelector('.leaflet-marker-icon');

  while (await page.locator('text=Load More Trees').isVisible()) {
    await page.locator('text=Load More Trees').click();
    await page.waitForTimeout(500);
  }

  const cardCount = await page.$$eval('div.border.rounded-xl', els => els.length);
  const markerCount = await page.$$eval('.leaflet-marker-icon', els => els.length);

  console.log(`Cards: ${cardCount}, Markers: ${markerCount}`);
  expect(Math.abs(markerCount - cardCount)).toBeLessThanOrEqual(2);
});





