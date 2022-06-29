import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgModel } from '@angular/forms';

import { Course } from 'src/app/shared/models/course.model';
import { CourseService } from 'src/app/shared/services/course.service';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-add-course-dialog',
  templateUrl: './add-course-dialog.component.html',
  styleUrls: ['./add-course-dialog.component.scss']
})
export class AddCourseDialogComponent implements OnInit {
  course: Course = {};
  fileError: string = "";
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('requirements') requirements!: NgModel;
  @ViewChild('learningObjectives') learningObjectives!: NgModel;
  editMode: boolean = false;

  constructor(
      private courseService: CourseService,
      private dialogRef: MatDialogRef<AddCourseDialogComponent>,
      @Inject(MAT_DIALOG_DATA) private dialogData: any,
      public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
      this.editMode = this.dialogData.editMode;
      this.setCourse();
  }

  setCourse() {
        if(this.editMode) {
            this.course = this.dialogData.course;
        }
    }

  onFileInput(eventObj: any) {
        let allowedExt = /(\jpg|\jpeg|\png)$/i;
        let allowedFileSize = 50 *1000 ; //in bytes
        const imgFile = eventObj.target.files[0];
        
        if(imgFile) {
            let extension = imgFile.type.replace(/(.*)\//g, '');
            if(extension.match(allowedExt)) {
                let size = imgFile.size; //returned size is in bytes
                if(size <= allowedFileSize) {
                    this.fileError = '';
                    const reader = new FileReader();
                    reader.onload = ()=>{  //when this function is called it means that user selected file is available in reader.result as a DataURL
                        this.course.image = reader.result;
                    };
                    reader.readAsDataURL(imgFile);
                }
                else {
                    this.fileError = `File too large. Allowed file size is ${allowedFileSize/1000}KB`;
                    this.course.image = ''; //needed because a user might reselect a invalid file
                    this.fileInput.nativeElement.value = '';
                }
                
            }
            else {
                this.fileError = 'File type not supported';
                this.course.image = ''; //needed because a user might reselect a invalid file 
                this.fileInput.nativeElement.value = '';
            }
        }
        else { //this is required because if user opens the dialog and clicks cancel..then no file is chosen
            this.fileError = '';
            this.course.image = '';
        }
    }

  onCourseAdd() {
    this.course.requirements = this.requirements.value.split(/\r?\n/);
    this.course.learningObjectives = this.learningObjectives.value.split(/\r?\n/);
    this.courseService.addCourse(this.course, this.editMode).subscribe((res: any)=>{
        Swal.fire({
            toast: true,
            position: 'top',
            timer: 3000,
            icon: res.status===200?'success':'error',
            showConfirmButton: false,
            title: res.data
        });
        this.dialogRef.close(res.status===200?'success':'error');
    });
  }
}
