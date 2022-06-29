import { NgModule } from "@angular/core";

import { NavbarModule } from "../navbar/navbar.module";
import { SharedRoutingModule } from "./shared-routing.module";

import { CoursesComponent } from './components/courses/courses.component';
import { AddCourseDialogComponent } from './components/courses/add-course-dialog/add-course-dialog.component';
import { SubjectsComponent } from "./components/subjects/subjects.component";
import { AddSubjectDialogComponent } from "./components/subjects/add-subject-dialog/add-subject-dialog.component";
import { AddContentDialogComponent } from './components/subjects/add-content-dialog/add-content-dialog.component';
import { EditContentDialogComponent } from './components/subjects/edit-content-dialog/edit-content-dialog.component';

@NgModule({
    declarations: [
        CoursesComponent,
        AddCourseDialogComponent,
        SubjectsComponent,
        AddSubjectDialogComponent,
        AddContentDialogComponent,
        EditContentDialogComponent
    ],
    imports: [
        NavbarModule,
        SharedRoutingModule
    ],
    exports: [
        EditContentDialogComponent
    ]
})
export class SharedModule {}