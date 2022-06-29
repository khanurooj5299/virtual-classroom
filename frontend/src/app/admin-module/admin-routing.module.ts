import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthGuard } from "../auth-module/services/auth.guard";
import { MainLayoutComponent } from "../layout-module/components/main-layout/main-layout.component";
import { AdminDashboardComponent } from "./components/admin-dashboard/admin-dashboard.component";
import { RequestsComponent } from "./components/requests/requests.component";

const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        canActivateChild: [AuthGuard],
        children: [
            { path: 'dashboard', component: AdminDashboardComponent},
            { path: 'requests', component: RequestsComponent},
        ],
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class AdminRoutingModule {}