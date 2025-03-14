import { isPlatformBrowser } from '@angular/common';
import {
  inject,
  Inject,
  Injectable,
  PLATFORM_ID,
  RendererFactory2,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class MyTranslateService {
  private readonly renderer2 = inject(RendererFactory2).createRenderer(
    null,
    null
  );
  constructor(
    private transService: TranslateService,
    @Inject(PLATFORM_ID) private id: object
  ) {
    if (isPlatformBrowser(this.id)) {
      transService.setDefaultLang('en');
      const savedLang = localStorage.getItem('lang');
      if (savedLang) {
        transService.use(savedLang!);
      }
      this.changeDir();
    }
  }
  changeDir() {
    if (localStorage.getItem('lang') == 'ar') {
      this.renderer2.setAttribute(document.documentElement, 'dir', 'rtl');
      this.renderer2.setAttribute(document.documentElement, 'lang', 'ar');
    } else if (localStorage.getItem('lang') == 'en') {
      this.renderer2.setAttribute(document.documentElement, 'dir', 'ltr');
      this.renderer2.setAttribute(document.documentElement, 'lang', 'en');
    }
  }
  changeLang(lang: string): void {
    localStorage.setItem('lang', lang);
    this.transService.use(lang);
    this.changeDir();
  }
}
