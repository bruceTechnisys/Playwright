// @ts-check
import { type Page, type Locator } from '@playwright/test';

export class PlaywrightHomePage {
	private readonly page: Page;
	private readonly getStartedLink: Locator;
	private readonly installationHeadingLocator: Locator;
	private readonly docsNavLink: Locator;
	private readonly apiNavLink: Locator;
	private readonly communityNavLink: Locator;

	constructor(page: Page) {
		this.page = page;
		// Define locators once and reuse them
		this.getStartedLink = this.page.getByRole('link', { name: 'Get started' });
		this.installationHeadingLocator = this.page.getByRole('heading', { name: 'Installation' });
		this.docsNavLink = this.page.getByRole('link', { name: 'Docs' });
		this.apiNavLink = this.page.getByRole('link', { name: 'API' });
		this.communityNavLink = this.page.getByRole('link', { name: 'Community' });
	}

	async goto(): Promise<void> {
		await this.page.goto('/');
	}



	async clickGetStarted(): Promise<void> {
		await this.getStartedLink.click();
	}

	installationHeading() {
		return this.installationHeadingLocator;
	}

	// Optional helpers exposing navbar locators when needed by specs
	docsLink() { return this.docsNavLink; }
	apiLink() { return this.apiNavLink; }
	communityLink() { return this.communityNavLink; }
}


