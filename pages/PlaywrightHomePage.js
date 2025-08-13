// @ts-check

export class PlaywrightHomePage {
	/**
	 * @param {import('@playwright/test').Page} page
	 */
	constructor(page) {
		this.page = page;
	}

	async goto() {
		await this.page.goto('/');
	}

	/**
	 * @param {import('@playwright/test').Expect} expect
	 */
	async assertTitleContainsPlaywright(expect) {
		await expect(this.page).toHaveTitle(/Playwright/);
	}

	async clickGetStarted() {
		await this.page.getByRole('link', { name: 'Get started' }).click();
	}

	installationHeading() {
		return this.page.getByRole('heading', { name: 'Installation' });
	}
}


