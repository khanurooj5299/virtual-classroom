import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../auth-module/services/auth.guard';
import { MainLayoutComponent } from '../layout-module/components/main-layout/main-layout.component';
import { SetQuestionPaperComponent } from './components/set-question-paper/set-question-paper.component';

const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        canActivateChild: [AuthGuard],
        children: [
        { path: 'set-question-paper', component: SetQuestionPaperComponent}
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
export class StaffRoutingModule {}