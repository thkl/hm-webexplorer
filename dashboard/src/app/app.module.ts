import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { LoggerModule, NgxLoggerLevel } from "ngx-logger";

import { AppComponent } from './app.component';
import { ApplianceComponent } from './components/appliances/appliance/appliance.component';
import { CategoryComponent } from './components/categories/category/category.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { SwitchComponent } from './components/appliances/switch/switch.component';
import { LongPressDirective } from './directives/long-press.directive';
import { DimmerComponent } from './components/appliances/dimmer/dimmer.component';
import { SonosComponent } from './components/appliances/sonos/sonos.component';
import { HeaderitemComponent } from './components/headeritem/headeritem.component';
import { BlindComponent } from './components/appliances/blind/blind.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { KeyComponent } from './components/appliances/key/key.component';
import { RgbComponent } from './components/appliances/rgb/rgb.component';

import { ColorHueModule } from 'ngx-color/hue';
import { ContactComponent } from './components/appliances/contact/contact.component';
import { ProgramComponent } from './components/appliances/program/program.component';
import { RotaryComponent } from './components/appliances/rotary/rotary.component';

@NgModule({
  declarations: [
    AppComponent,
    ApplianceComponent,
    CategoryComponent,
    DashboardComponent,
    HeaderComponent,
    SwitchComponent,
    LongPressDirective,
    DimmerComponent,
    SonosComponent,
    HeaderitemComponent,
    BlindComponent,
    KeyComponent,
    RgbComponent,
    ContactComponent,
    ProgramComponent,
    RotaryComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatTabsModule,
    MatButtonModule,
    ColorHueModule,
    LoggerModule.forRoot({
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.DEBUG,
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
