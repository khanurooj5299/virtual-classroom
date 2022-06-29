import { NgModule } from "@angular/core";

import { NavbarModule } from "../navbar/navbar.module";

import { AdmitCardComponent } from "./components/admit-card/admit-card.component";
import { RollNumberSlipDialogComponent } from "./components/admit-card/roll-number-slip-dialog/roll-number-slip-dialog.component";
import { CourseEnrollComponent } from "./components/course-enroll/course-enroll.component";
import { GiveExamComponent } from "./components/give-exam/give-exam.component";
import { ResultCardComponent } from "./components/result-card/result-card.component";
import { StudentCourseDetailsComponent } from "./components/student-course-details/student-course-details.component";
import { StudentCoursesComponent } from "./components/student-courses/student-courses.component";
import { StudentRoutingModule } from "./student-routing.module";
import { CertificateComponent } from './components/certificate/certificate.component';
import { SharedModule } from "../shared/shared.module";
import { GetInputsComponent } from './components/certificate/get-inputs/get-inputs.component';

@NgModule({
    declarations: [
        AdmitCardComponent,
        RollNumberSlipDialogComponent,
        CourseEnrollComponent,
        GiveExamComponent,
        ResultCardComponent,
        StudentCourseDetailsComponent,
        StudentCoursesComponent,
        CertificateComponent,
        GetInputsComponent
    ],
    imports: [
        NavbarModule,
        StudentRoutingModule
    ]
})
export class StudentModule {}