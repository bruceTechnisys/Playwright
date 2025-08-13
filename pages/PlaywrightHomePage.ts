// @ts-check
import { expect, type Page } from '@playwright/test';

export class PlaywrightHomePage {
	private readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async goto(): Promise<void> {
		await this.page.goto('/');
	}

	async assertTitleContainsPlaywright(): Promise<void> {
		await expect(this.page).toHaveTitle(/Playwright/);
	}

	async clickGetStarted(): Promise<void> {
		await this.page.getByRole('link', { name: 'Get started' }).click();
	}

	installationHeading() {
		return this.page.getByRole('heading', { name: 'Installation' });
	}
}


