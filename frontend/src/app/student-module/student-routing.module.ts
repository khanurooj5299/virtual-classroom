import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "../auth-module/services/auth.guard";
import { MainLayoutComponent } from "../layout-module/components/main-layout/main-layout.component";
import { AdmitCardComponent } from "./components/admit-card/admit-card.component";
import { CertificateComponent } from "./components/certificate/certificate.component";
import { CourseEnrollComponent } from "./components/course-enroll/course-enroll.component";
import { GiveExamComponent } from "./components/give-exam/give-exam.component";
import { ResultCardComponent } from "./components/result-card/result-card.component";
import { StudentCourseDetailsComponent } from "./components/student-course-details/student-course-details.component";
import { StudentCoursesComponent } from "./components/student-courses/student-courses.component";


const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        canActivateChild: [AuthGuard],
        children: [
        { path: 'admit-card', component: AdmitCardComponent},
        { path: 'courses', component: StudentCoursesComponent},
        { path: ':courseId/course-details', component: StudentCourseDetailsComponent},
        { path: ':courseId/course-enroll', component: CourseEnrollComponent },
        { path: 'give-exam', component: GiveExamComponent},
        { path: 'result-sheet', component: ResultCardComponent},
        { path: 'certificate', component: CertificateComponent}
        ]
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class StudentRoutingModule {}