// @ts-check
import { type Page, type Locator } from '@playwright/test';

export class PlaywrightHomePage {
	private readonly page: Page;
	private readonly getStartedLink: Locator;
	private readonly installationHeadingLocator: Locator;
	private readonly docsNavLink: Locator;
	private readonly apiNavLink: Locator;
	private readonly communityNavLink: Locator;
	
	// New locators for enhanced testing
	private readonly searchButton: Locator;
	private readonly heroHeading: Locator;
	private readonly heroSubtitle: Locator;
	private readonly githubStars: Locator;
	private readonly featuresSection: Locator;
	private readonly companiesSection: Locator;
	private readonly crossBrowserText: Locator;
	private readonly crossPlatformText: Locator;
	private readonly crossLanguageText: Locator;
	private readonly testMobileWebText: Locator;
	private readonly footerSection: Locator;
	private readonly mobileMenuButton: Locator;
	private readonly languageSelector: Locator;

	constructor(page: Page) {
		this.page = page;
		// Define locators once and reuse them
		this.getStartedLink = this.page.getByRole('link', { name: 'Get started' });
		this.installationHeadingLocator = this.page.getByRole('heading', { name: 'Installation' });
		this.docsNavLink = this.page.getByRole('link', { name: 'Docs' });
		this.apiNavLink = this.page.getByRole('link', { name: 'API' });
		this.communityNavLink = this.page.getByRole('link', { name: 'Community' });
		
		// New locators
		this.searchButton = this.page.locator('[aria-label="Search"]');
		this.heroHeading = this.page.getByRole('heading', { name: /Playwright enables reliable end-to-end testing/ });
		this.heroSubtitle = this.page.getByText('Any browser • Any platform • One API');
		this.githubStars = this.page.getByText(/75k\+/);
		this.featuresSection = this.page.locator('text=Cross-browser').first();
		this.companiesSection = this.page.locator('text=Chosen by companies');
		this.crossBrowserText = this.page.getByText('Cross-browser');
		this.crossPlatformText = this.page.getByText('Cross-platform');
		this.crossLanguageText = this.page.getByText('Cross-language');
		this.testMobileWebText = this.page.getByText('Test Mobile Web');
		this.footerSection = this.page.locator('footer');
		this.mobileMenuButton = this.page.locator('[aria-label="Toggle navigation"]');
		this.languageSelector = this.page.locator('text=Node.js').first();
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

	// New methods for enhanced testing
	async scrollToCompanies(): Promise<void> {
		await this.companiesSection.scrollIntoViewIfNeeded();
	}

	async scrollToFooter(): Promise<void> {
		await this.footerSection.scrollIntoViewIfNeeded();
	}

	async openSearch(): Promise<void> {
		if (await this.searchButton.isVisible()) {
			await this.searchButton.click();
		}
	}

	async clickMobileMenu(): Promise<void> {
		if (await this.mobileMenuButton.isVisible()) {
			await this.mobileMenuButton.click();
		}
	}

	// Getters for new locators
	heroSection() { return this.heroHeading; }
	heroSubtitleSection() { return this.heroSubtitle; }
	githubStarsElement() { return this.githubStars; }
	features() { return this.featuresSection; }
	companies() { return this.companiesSection; }
	crossBrowser() { return this.crossBrowserText; }
	crossPlatform() { return this.crossPlatformText; }
	crossLanguage() { return this.crossLanguageText; }
	testMobileWeb() { return this.testMobileWebText; }
	footer() { return this.footerSection; }
	mobileMenu() { return this.mobileMenuButton; }
	languageSelectorElement() { return this.languageSelector; }
}


