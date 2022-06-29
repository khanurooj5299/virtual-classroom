import { EventEmitter, Injectable, Output } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class MainLayoutService {
    @Output() contentChanged: EventEmitter<void> = new EventEmitter<void>();
}