import { chromium } from 'playwright';

const log = (...a) => console.log(...a);

const browser = await chromium.launch();
const page = await browser.newPage();
const consoleErrors = [];
page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
page.on('pageerror', (err) => consoleErrors.push('pageerror: ' + err.message));

async function hop(label, fn) {
  try {
    await fn();
    log(`[OK]   ${label} -> ${page.url()}`);
  } catch (e) {
    log(`[FAIL] ${label}: ${e.message}`);
  }
}

// HOP 1: site home
await hop('1. site home /', async () => {
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  const title = await page.title();
  log('   title=', title);
});

// HOP 2: /artists page
await hop('2. /artists', async () => {
  await page.goto('http://localhost:3000/artists', { waitUntil: 'networkidle' });
});

// HOP 3: click hero GET STARTED CTA -> app /signup?role=artist&utm...
await hop('3. click hero GET-STARTED CTA', async () => {
  const links = await page.locator('a[href*="/signup?role=artist"]').all();
  log('   found', links.length, 'role=artist CTAs');
  for (const l of links) log('   href=', await l.getAttribute('href'));
  await links[0].click();
  await page.waitForLoadState('networkidle');
});

// HOP 4: on /signup — verify sessionStorage got the role hint, verify form
await hop('4. /signup form render', async () => {
  log('   url=', page.url());
  const hint = await page.evaluate(() => sessionStorage.getItem('gigproof_pending_role'));
  log('   sessionStorage pending role=', hint);
  const hasFirstName = await page.locator('input[autocomplete="given-name"]').count();
  const hasEmail = await page.locator('input[type="email"]').count();
  const hasPassword = await page.locator('input[type="password"]').count();
  log('   fields: firstName=', hasFirstName, 'email=', hasEmail, 'password=', hasPassword);
  const hint2 = await page.locator('text=/at least/i').first().textContent().catch(() => null);
  log('   password hint text=', hint2);
});

// HOP 5: field QA — empty, invalid email, short password, long value, Hebrew
await hop('5. field QA states', async () => {
  await page.locator('input[autocomplete="given-name"]').fill('נועה');
  await page.locator('input[autocomplete="family-name"]').fill('וולק');
  await page.locator('input[type="email"]').fill('not-an-email');
  await page.locator('input[type="password"]').fill('123');
  await page.locator('button:has-text("Create account"), button[type="submit"]').first().click({ trial: true }).catch(()=>{});
  // Try native submit to see browser validation triggers (form has no noValidate)
  const emailValidity = await page.locator('input[type="email"]').evaluate((el) => el.validity.valid);
  log('   email validity(not-an-email)=', emailValidity);
  const pwValidity = await page.locator('input[type="password"]').evaluate((el) => el.validity.valid, );
  log('   password validity(123, minLength=6)=', pwValidity);
});

// HOP 6: fill valid data and submit (will hit network — expect failure/timeout since sandboxed, capture behavior)
await hop('6. submit signup (network expected to fail in sandbox)', async () => {
  await page.locator('input[type="email"]').fill('test-artist-e2e@example.com');
  await page.locator('input[type="password"]').fill('longenoughpassword');
  const respPromise = page.waitForResponse((r) => r.url().includes('supabase'), { timeout: 5000 }).catch(() => null);
  await page.locator('button[type="submit"], .btn-primary').first().click();
  const resp = await respPromise;
  log('   supabase response seen:', !!resp);
  await page.waitForTimeout(1500);
  log('   url after submit attempt=', page.url());
  const errNote = await page.locator('.card, form').first().textContent().catch(()=>null);
  log('   visible text snippet:', (errNote||'').slice(0,300));
});

log('\n--- console errors collected ---');
for (const e of consoleErrors) log(e);

await browser.close();
