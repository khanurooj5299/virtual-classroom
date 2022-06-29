import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from 'src/app/shared/services/loader.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    @ViewChild('registerForm') registerForm!: NgForm;
    @ViewChild('fileInput') fileInput!: ElementRef;
    userRegisterModel: User = {}
    roles: any = [];
    // confirmPassword: string = "";
    preview: string = "../../../assets/avatar.jpg";
    fileError: string = '';
    editMode: boolean = false;

    constructor(
        private authServive: AuthService,
        private currentRoute: ActivatedRoute,
        public loaderService: LoaderService,
        private router: Router,
        private location: Location
    ) { }

    ngOnInit() {
        this.getRoles();
        this.setEditMode();
        this.setUser();
    }

    getRoles() {
        this.roles = this.authServive.getRoles();
        this.roles.shift(); //to remove admin option
    }

    setEditMode() {
        if (this.currentRoute.snapshot.queryParams['editMode']) {
            this.editMode = this.currentRoute.snapshot.queryParams['editMode'];
        }
    }

    setUser() {
        if (this.editMode) {
            if (this.authServive.userIdExists()) {
                this.authServive.getLoggedInUserById().subscribe((res: any) => {
                    if (res.status === 200) {
                        this.userRegisterModel = res.data;
                    }
                    else {
                        Swal.fire({
                            toast: true,
                            position: 'top',
                            timer: 3000,
                            showConfirmButton: false,
                            title: res.data,
                            icon: 'error'
                        });
                    }
                });
            }
        }
    }

    onFileInput(eventObj: any) {
        let allowedExt = /(\jpg|\jpeg|\png)$/i;
        let allowedFileSize = 50 * 1000; //in bytes
        const imgFile = eventObj.target.files[0];

        if (imgFile) {
            let extension = imgFile.type.replace(/(.*)\//g, '');
            if (extension.match(allowedExt)) {
                let size = imgFile.size; //returned size is in bytes
                if (size <= allowedFileSize) {
                    this.fileError = '';
                    const reader = new FileReader();
                    reader.onload = () => {  //when this function is called it means that user selected file is available in reader.result as a DataURL
                        this.userRegisterModel.image = reader.result;
                    };
                    reader.readAsDataURL(imgFile);
                }
                else {
                    this.fileError = `File too large. Allowed file size is ${allowedFileSize / 1000}KB`;
                    this.userRegisterModel.image = ''; //needed because a user might reselect a invalid file
                    this.fileInput.nativeElement.value = '';
                }

            }
            else {
                this.fileError = 'File type not supported';
                this.userRegisterModel.image = ''; //needed because a user might reselect a invalid file 
                this.fileInput.nativeElement.value = '';
            }
        }
        else { //this is required because if user opens the dialog and clicks cancel..then no file is chosen
            this.fileError = '';
            this.userRegisterModel.image = '';
        }
    }

    onRegister() {
        if (this.registerForm.valid) {
            //    if(this.confirmPassword === this.userRegisterModel.password) {
            this.authServive.registerUser(this.userRegisterModel, this.editMode).subscribe((res: any) => {
                Swal.fire({
                    toast: res.status !== 200,
                    position: 'top',
                    title: res.data,
                    icon: res.status === 200 ? 'success' : 'error',
                    // timer: 3000,
                    showConfirmButton: true
                });
                if (res.status === 200) {
                    this.userRegisterModel = {};
                    this.registerForm.resetForm();
                    // this.confirmPassword = "";
                    this.fileInput.nativeElement.value = '';
                    this.router.navigate(['/user']);
                }
            });
            // }
            // else {
            //     Swal.fire({
            //         toast: true,
            //         position: 'top',
            //         title: 'Passwords don\'t match',
            //         icon: 'error',
            //         timer: 3000,
            //         showConfirmButton: false
            //         });
            //     }
        }
    }

    onBack() {
        this.location.back();
    }
}