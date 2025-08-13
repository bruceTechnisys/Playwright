// @ts-check
import { type Page } from '@playwright/test';

export class PlaywrightHomePage {
	private readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async goto(): Promise<void> {
		await this.page.goto('/');
	}



	async clickGetStarted(): Promise<void> {
		await this.page.getByRole('link', { name: 'Get started' }).click();
	}

	installationHeading() {
		return this.page.getByRole('heading', { name: 'Installation' });
	}
}


