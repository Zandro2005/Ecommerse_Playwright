import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { invalidLoginCases, validLoginCases } from '@test-data/LoginData';

for (const loginCase of validLoginCases) {
  test(`Valid Login: ${loginCase.name}`, async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.validLogin(loginCase.username, loginCase.password);
    await expect(loginPage.productsTitle).toBeVisible();
  });
}

for (const loginCase of invalidLoginCases) {
  test(`Invalid Login: ${loginCase.name}`, async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.invalidLogin(loginCase.username, loginCase.password);
    await expect(loginPage.errorMessage).toContainText(loginCase.expectedError);
  });
}

test('Dismiss error banner', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.invalidLogin('', '');
  await loginPage.closeErrorBanner();
  await expect(loginPage.errorMessage).toBeHidden();
});

test('Logout', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.validLogin(process.env.TEST_USERNAME!, process.env.TEST_PASSWORD!);
  await expect(page).toHaveURL(loginPage.directUrl);

  await loginPage.logout();
  await expect(page).toHaveURL(loginPage.url);
});

test('Direct URL access when unauthenticated', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.directNavigation();
  await expect(loginPage.errorMessage).toContainText(
    "Epic sadface: You can only access '/inventory.html' when you are logged in.",
  );
});

test('problem_user can log in but displays the known duplicate image bug', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.validLogin('problem_user', process.env.TEST_PASSWORD!);
  await expect(page).toHaveURL(loginPage.directUrl);

  await expect(loginPage.productImages.nth(1)).toHaveAttribute(
    'src',
    (await loginPage.productImages.nth(0).getAttribute('src'))!,
  );
});

test('performance_glitch_user login succeeds despite delay', async ({ page }) => {
  test.setTimeout(60_000);

  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.validLogin('performance_glitch_user', process.env.TEST_PASSWORD!);
  await expect(page).toHaveURL(loginPage.directUrl, { timeout: 45_000 });
});

test('Logo visible on login page', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await expect(loginPage.logo).toBeVisible();
});

test('Password field masks input', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await expect(loginPage.password).toHaveAttribute('type', 'password');
});
