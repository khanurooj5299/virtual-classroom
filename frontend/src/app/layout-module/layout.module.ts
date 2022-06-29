import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { NavbarModule } from "../navbar/navbar.module";

import { MainLayoutComponent } from './components/main-layout/main-layout.component';

@NgModule({
    imports: [
        NavbarModule,
        RouterModule
    ],
    declarations: [
      MainLayoutComponent
    ]
})
export class LayoutModule {}
