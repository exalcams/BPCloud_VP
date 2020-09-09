import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { ChatModule } from './chat.module';
import { ChatConfigComponent } from './chat-config/chat-config.component';
import { ChatWidgetComponent } from './chat-widget/chat-widget.component';
// import { BrowserModule } from '@angular/platform-browser';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  imports: [ChatModule],
  exports: [ChatModule]
})
export class ElementModule {
  constructor(private injector: Injector) {
  }

  ngDoBootstrap() {
    const chatConfig = <any>createCustomElement(ChatConfigComponent, {
      injector: this.injector,
    });
    const chatWidget = <any>createCustomElement(ChatWidgetComponent, {
      injector: this.injector,
    });
    customElements.define('chat-config', chatConfig);
    customElements.define('chat-widget', chatWidget);
  }
}
