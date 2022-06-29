import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "../auth-module/services/auth.guard";
import { MainLayoutComponent } from "../layout-module/components/main-layout/main-layout.component";
import { CoursesComponent } from "./components/courses/courses.component";
import { SubjectsComponent } from "./components/subjects/subjects.component";

const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        canActivateChild: [AuthGuard],
        children: [
        { path: 'courses', component: CoursesComponent },
        { path: ':courseId/subjects', component: SubjectsComponent}
        ]
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class SharedRoutingModule {}