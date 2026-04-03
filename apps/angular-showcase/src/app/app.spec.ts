import { TestBed } from '@angular/core/testing';
import { BrandOneShowcaseAppComponent } from './app';

describe('BrandOneShowcaseAppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandOneShowcaseAppComponent],
    }).compileComponents();
  });

  it('creates the Angular brand-one showcase application component', () => {
    const componentFixture = TestBed.createComponent(BrandOneShowcaseAppComponent);
    const applicationComponent = componentFixture.componentInstance;

    expect(applicationComponent).toBeTruthy();
  });

  it('renders the brand-one headline and the button examples', async () => {
    const componentFixture = TestBed.createComponent(BrandOneShowcaseAppComponent);

    await componentFixture.whenStable();

    const renderedElement = componentFixture.nativeElement as HTMLElement;
    expect(renderedElement.querySelector('h1')?.textContent).toContain(
      'Angular consumes only wrapper logic, then Brand 1 arrives from CSS.'
    );
    expect(renderedElement.textContent).toContain('Brand 1 default');
    expect(renderedElement.textContent).toContain('Class-based override');
    expect(renderedElement.textContent).toContain('Inline token tweak');
    expect(renderedElement.textContent).toContain('only the primitive represented in Figma: the button');
  });

  it('switches the shell theme attribute when the user changes theme', async () => {
    const componentFixture = TestBed.createComponent(BrandOneShowcaseAppComponent);

    componentFixture.detectChanges();
    await componentFixture.whenStable();

    const renderedElement = componentFixture.nativeElement as HTMLElement;
    const mainElement = renderedElement.querySelector('main');
    const darkThemeButton = Array.from(renderedElement.querySelectorAll('button')).find((buttonElement) =>
      buttonElement.textContent?.includes('Dark')
    );
    const lightThemeButton = Array.from(renderedElement.querySelectorAll('button')).find((buttonElement) =>
      buttonElement.textContent?.includes('Light')
    );

    expect(mainElement?.getAttribute('data-theme')).toBe('light');

    darkThemeButton?.click();
    componentFixture.detectChanges();
    expect(mainElement?.getAttribute('data-theme')).toBe('dark');

    lightThemeButton?.click();
    componentFixture.detectChanges();
    expect(mainElement?.getAttribute('data-theme')).toBe('light');
  });

});
