import { TestBed } from '@angular/core/testing';
import { AngularCustomDemoAppComponent } from './app';

describe('AngularCustomDemoAppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AngularCustomDemoAppComponent],
    }).compileComponents();
  });

  it('creates the Angular custom demo application component', () => {
    const componentFixture = TestBed.createComponent(AngularCustomDemoAppComponent);
    const applicationComponent = componentFixture.componentInstance;

    expect(applicationComponent).toBeTruthy();
  });

  it('renders the custom-brand headline and the button examples', async () => {
    const componentFixture = TestBed.createComponent(AngularCustomDemoAppComponent);

    await componentFixture.whenStable();

    const renderedElement = componentFixture.nativeElement as HTMLElement;
    expect(renderedElement.querySelector('h1')?.textContent).toContain(
      'The same Angular wrapper gets a custom identity from a separate stylesheet.'
    );
    expect(renderedElement.textContent).toContain('Custom brand default');
    expect(renderedElement.textContent).toContain('Host class override');
    expect(renderedElement.textContent).toContain('Inline token tweak');
    expect(renderedElement.querySelector('ff-dropdown')).toBeTruthy();
  });

  it('updates the shell theme attribute when the user toggles the theme', async () => {
    const componentFixture = TestBed.createComponent(AngularCustomDemoAppComponent);

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

  it('updates the dropdown status when a different deployment lane is selected', async () => {
    const componentFixture = TestBed.createComponent(AngularCustomDemoAppComponent);

    componentFixture.detectChanges();
    await componentFixture.whenStable();

    const renderedElement = componentFixture.nativeElement as HTMLElement;
    const dropdownElement = renderedElement.querySelector('ff-dropdown');
    dropdownElement?.dispatchEvent(
      new CustomEvent('ffValueChange', {
        bubbles: true,
        detail: {
          label: 'Public release',
          value: 'public-release'
        }
      })
    );
    componentFixture.detectChanges();

    expect(renderedElement.textContent).toContain('Current selection: Public release');
  });
});
