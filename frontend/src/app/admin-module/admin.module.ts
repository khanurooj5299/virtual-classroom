import { NgModule } from "@angular/core";
import { NgChartsModule } from "ng2-charts";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { NavbarModule } from "../navbar/navbar.module";
import { AdminRoutingModule } from "./admin-routing.module";

import { AdminDashboardComponent } from "./components/admin-dashboard/admin-dashboard.component";
import { RequestsComponent } from './components/requests/requests.component';

@NgModule({
    declarations: [
        AdminDashboardComponent,
        RequestsComponent
    ],
    imports: [
        NavbarModule,
        AdminRoutingModule,
        NgChartsModule,
        MatSlideToggleModule
    ]
})
export class AdminModule {}