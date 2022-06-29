import { NgModule } from '@angular/core';

import { NavbarModule } from '../navbar/navbar.module';
import { StaffRoutingModule } from './staff-routing.module';

import { SetQuestionPaperComponent } from './components/set-question-paper/set-question-paper.component';
import { SetCourseAndSubjectDialogComponent } from './components/set-question-paper/set-course-and-subject-dialog/set-course-and-subject-dialog.component';

@NgModule({
    declarations: [
        SetQuestionPaperComponent,
        SetCourseAndSubjectDialogComponent
    ],
    imports: [
        NavbarModule,
        StaffRoutingModule
    ]
})
export class StaffModule {}