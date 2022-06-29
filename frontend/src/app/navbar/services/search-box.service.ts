import { EventEmitter, Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class SearchBoxService {
    /*If some component has to display the searchbox in topnavbar it has to inject this
    service and then emit the toggleVisibility event with true, which the topnavbar subscribes to.
    The component should emit the event again with false in ngOnDestroy, otherwise the searchbox will still be visible after router outlet changes.
    */
    public toggleVisibility: EventEmitter<boolean> = new EventEmitter<boolean>();
    
    /*topnavbar will emit this event on searchbox value change. Some component will subscribe and get the value
    */
    public searchValueChanged: EventEmitter<string> = new EventEmitter<string>();
}