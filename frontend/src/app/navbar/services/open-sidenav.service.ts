import { EventEmitter, Injectable, Output } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class OpenSidenavService {
    @Output() toggleSidenav: EventEmitter<void> = new EventEmitter<void>();
}