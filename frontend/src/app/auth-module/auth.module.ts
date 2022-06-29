import { NgModule } from "@angular/core";

import { NavbarModule } from "../navbar/navbar.module";
import { AuthRoutingModule } from "./auth-routing.module";

import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { SessionExpiredComponent } from "./components/session-expired/session-expired.component";
import { FirstPageComponent } from './components/first-page/first-page.component';

@NgModule({
    declarations: [
        LoginComponent,
        RegisterComponent,
        SessionExpiredComponent,
        FirstPageComponent,
    ],
    imports: [
        NavbarModule,
        AuthRoutingModule
    ]
})
export class AuthModule {}