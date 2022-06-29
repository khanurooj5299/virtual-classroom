import { Component, ElementRef, ViewChild, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

import { SubjectService } from "src/app/shared/services/subject.service";
import { SubjectContent } from 'src/app/shared/models/subject-content.model';
import { User } from "src/app/auth-module/models/user.model";
import { AuthService } from "src/app/auth-module/services/auth.service";
import { LoaderService } from "src/app/shared/services/loader.service";


@Component({
    selector: 'app-add-dialog',
    templateUrl: './add-content-dialog.component.html',
    styleUrls: ['./add-content-dialog.component.scss']
})

export class AddContentDialogComponent implements OnInit{
    @ViewChild('fileInput') fileInput!: ElementRef;
    subjectId: string = '';
    fileErrors: string[] = [];
    content: SubjectContent[] = [];
    loggedInUser: User = {};
    completed: boolean = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) private dialogData: any,
        private subjectService: SubjectService,
        private authService: AuthService,
        private router: Router,
        public loaderService: LoaderService
    ) { }

    ngOnInit(): void {
        this.subjectId = this.dialogData.subjectId;
        this.setLoggedInUser();
    }

    setLoggedInUser() {
        if(this.authService.userIdExists()) {
            this.authService.getLoggedInUserById().subscribe((res: any)=>{
                if(res.status===200) {
                    this.loggedInUser = res.data;
                }
                else {
                    Swal.fire({
                        toast: true,
                        position: 'top',
                        icon: 'error',
                        title: res.data,
                        timer: 3000,
                        showConfirmButton: false
                    });
                    this.router.navigate(['/user']);
                }
            });
        }
    }

    onFileInput(eventObj: any) {
        this.completed = false;
        this.fileErrors = []; //to clear the previous errors if user again chooses
        const files: FileList = eventObj.target.files;
        let filesToAdd: number = files.length;
        let allowedExt = /(\pdf)$/i;
        let allowedFileSize = 1000000; //in bytes
        if (files) {
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                let extension = file.type.replace(/(.*)\//g, '');
                if (extension.match(allowedExt)) {
                    let size = file.size;
                    if (size < allowedFileSize) {
                        const reader = new FileReader();
                        reader.onload = () => {
                            this.content.push({
                                file: reader.result,
                                fileName: file.name,
                                addedBy: this.loggedInUser._id
                            });
                            if (this.content.length >= filesToAdd) {  //to make opening choose dialog more than once work
                                this.completed = true;
                            } 
                        }
                        reader.readAsDataURL(file);
                    }
                    else {
                        this.fileErrors.push(`${file.name} : File too large. Allowed file size is ${allowedFileSize / 1000000}MB`);
                        this.completed = true;
                        filesToAdd--; //because this file will not be added now
                    }
                }
                else {
                    this.fileErrors.push(`${file.name} : File type not supported`);
                    this.completed = true;
                    filesToAdd--; //because this file will not be added now
                }
            }  //for loop ends
        }  //if(files) ends
        else { //this is required because if user opens the dialog and clicks cancel..then no file is chosen
            this.fileErrors = [];
            if (this.content.length >= filesToAdd) {  //to make opening choose dialog more than once work
                this.completed = true;
            }
        }
    }

    onChoose() {
        this.fileInput.nativeElement.click();
    }

    onRemoveFile(i: number) {
        this.content.splice(i, 1);
    }

    onAdd() {
        this.subjectService.addContentToSubject(this.subjectId, this.content).subscribe((res: any) => {
            if(res.status===200) {
                this.content = [];
            }
            Swal.fire({
                toast: true,
                position: 'top',
                title: res.data,
                showConfirmButton: false,
                icon: res.status===200?'success':'error',
                timer: 3000
            });
        });
    }
}