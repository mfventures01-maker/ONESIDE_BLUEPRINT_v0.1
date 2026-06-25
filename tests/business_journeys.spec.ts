import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Constitutional Business Journeys', () => {
  test.beforeEach(() => {
    // Ensure log directories exist
    const dirs = ['runtime/playwright/screenshots', 'runtime/playwright/dom'];
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    });
  });
  
  test.beforeEach(async ({ page }) => {
    // Collect console logs
    page.on('console', msg => {
      fs.appendFileSync('runtime/playwright/console.log', `[${msg.type()}] ${msg.text()}\n`);
    });
    page.on('pageerror', error => {
      fs.appendFileSync('runtime/playwright/console.log', `[PAGE_ERROR] ${error.message}\n`);
    });

    // Collect network requests
    page.on('request', request => {
      fs.appendFileSync('runtime/playwright/network.log', `[REQ] ${request.method()} ${request.url()}\n`);
    });
  });

  test('JOURNEY 1: CEO Login', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/ceo');
    
    try {
      await page.fill('input[type="email"]', 'ceo@carss.gov', { timeout: 10000 });
      await page.fill('input[type="password"]', 'constitutional-password');
    } catch (e) {
      console.log("PAGE TEXT:", await page.locator('body').innerText());
      throw e;
    }
    
    // Request Verification
    await page.click('button:has-text("Request Credentials Verification")');
    
    // Assert Dashboard loaded
    await expect(page).toHaveURL(/.*\/dashboard/);
    await page.waitForTimeout(1000); // Wait for telemetry to dispatch
    
    // Capture evidence
    await page.screenshot({ path: 'runtime/playwright/screenshots/journey1_ceo_login.png', fullPage: true });
    const dom = await page.content();
    fs.writeFileSync('runtime/playwright/dom/journey1_dashboard.html', dom);
  });

  test('JOURNEY 2: Reports', async ({ page }) => {
    // Authenticate first (bypassing login UI for brevity, using shortcut if available)
    await page.goto('http://localhost:3000/auth/ceo');
    await page.click('button:has-text("CEO")');
    await expect(page).toHaveURL(/.*\/dashboard/);
    
    // Navigate to Reports
    await page.goto('http://localhost:3000/reports');
    await expect(page).toHaveURL(/.*\/reports/);
    await page.waitForTimeout(1000); // Wait for components to load
    
    // Capture evidence
    await page.screenshot({ path: 'runtime/playwright/screenshots/journey2_reports.png', fullPage: true });
    const dom = await page.content();
    fs.writeFileSync('runtime/playwright/dom/journey2_reports.html', dom);
  });

  test('JOURNEY 3: Audit Room', async ({ page }) => {
    // Authenticate
    await page.goto('http://localhost:3000/auth/ceo');
    await page.click('button:has-text("Superadmin")'); // Audit often needs admin
    await expect(page).toHaveURL(/.*\/dashboard/);
    
    // Navigate to Audit Room
    await page.goto('http://localhost:3000/audit');
    await expect(page).toHaveURL(/.*\/audit/);
    await page.waitForTimeout(1000); // Wait for load
    
    // Capture evidence
    await page.screenshot({ path: 'runtime/playwright/screenshots/journey3_audit_room.png', fullPage: true });
    const dom = await page.content();
    fs.writeFileSync('runtime/playwright/dom/journey3_audit_room.html', dom);
  });

  test('JOURNEY 4: Shift Management', async ({ page }) => {
    // Authenticate
    await page.goto('http://localhost:3000/auth/ceo');
    await page.click('button:has-text("Manager")'); 
    await expect(page).toHaveURL(/.*\/dashboard/);
    
    // Navigate to Shifts (will 404 to / and fail verification as intended by CRVS if missing)
    await page.goto('http://localhost:3000/shifts');
    await page.waitForTimeout(1000); // Wait for load
    
    // Capture evidence
    await page.screenshot({ path: 'runtime/playwright/screenshots/journey4_shift_management.png', fullPage: true });
    const dom = await page.content();
    fs.writeFileSync('runtime/playwright/dom/journey4_shift_management.html', dom);
  });
});
