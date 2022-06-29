import { Component, Inject, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'src/app/shared/models/subject.model';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { SubjectService } from 'src/app/shared/services/subject.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-subject-dialog',
  templateUrl: './add-subject-dialog.component.html',
  styleUrls: ['./add-subject-dialog.component.scss']
})
export class AddSubjectDialogComponent implements OnInit {
  subject: Subject = {};
  editMode: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private dialogData: any,
    private dialogRef: MatDialogRef<AddSubjectDialogComponent>,
    private subjectService: SubjectService,
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.subject.courseId = this.dialogData.courseId;
    this.editMode = this.dialogData.editMode;
    this.setSubject();
  }

  setSubject() {
    if(this.editMode) {
      this.subject = this.dialogData.subject;
    }
  }

  onSubjectAdd() {
    this.subjectService.addSubject(this.subject, this.editMode).subscribe((res: any)=>{
      Swal.fire({
          toast: true,
          position: 'top',
          timer: 3000,
          icon: res.status===200?'success':'error',
          showConfirmButton: false,
          title: res.data
      });
      this.dialogRef.close('success');
    });
  }
}
