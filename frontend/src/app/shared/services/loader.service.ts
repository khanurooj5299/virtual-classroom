import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class LoaderService {
    isProcessing: boolean = false;

    show() {
        this.isProcessing = true;
    }

    hide() {
        this.isProcessing = false;
    }
} 