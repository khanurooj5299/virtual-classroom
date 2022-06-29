import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    serverUrl = environment.serverUrl;

    constructor( private http: HttpClient ) {}

    getDashboardData() {
        return this.http.get(`${this.serverUrl}admin/get-dashboard-data`);
    }

    getRequestCount() {
        return this.http.get(`${this.serverUrl}admin/get-request-count`);
    }

    changeStaffActiveStatus(staffId: string, newActiveStatus: boolean) {
        return this.http.put(`${this.serverUrl}admin/${staffId}/change-staff-active-status`, {newActiveStatus: newActiveStatus});
    }

    getRequests() {
        return this.http.get(`${this.serverUrl}admin/get-requests`);
    }

    handleRequests(requestsToHandle: string[], isApproved: boolean) {
        return this.http.post(`${this.serverUrl}admin/handle-requests`, {requestsToHandle: requestsToHandle, isApproved: isApproved});
    }
}