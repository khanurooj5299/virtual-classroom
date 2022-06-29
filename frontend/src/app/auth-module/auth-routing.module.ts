import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FirstPageComponent } from './components/first-page/first-page.component';
import { RegisterComponent } from './components/register/register.component';
import { SessionExpiredComponent } from './components/session-expired/session-expired.component';

const routes: Routes = [
    {
        path: '',
        children: [
        { path: '', component: FirstPageComponent},
        { path: 'register', component: RegisterComponent},
        { path: 'session-expired', component: SessionExpiredComponent}
        ]
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AuthRoutingModule {}