import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class AddressService {
    serverUrl = environment.serverUrl;

    constructor(private http: HttpClient) {}

    getCountries() {
        return this.http.get(`${this.serverUrl}address/get-countries`);
    }

    getStates(countryId: string) {
        return this.http.get(`${this.serverUrl}address/${countryId}/get-states`);
    }

    getCities(stateId: string) {
        return this.http.get(`${this.serverUrl}address/${stateId}/get-cities`);
    }
}