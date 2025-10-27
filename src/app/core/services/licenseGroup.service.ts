import { Injectable } from '@angular/core';
import { POST_METHOD, PUT_METHOD, GET_METHOD, DELETE_METHOD } from '../utils/https-requests';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LicenseGroupService {

  constructor() { }

  private licenseGroupSubject = new BehaviorSubject<any>(undefined);
  licenseGroup$: Observable<any> = this.licenseGroupSubject.asObservable();

  async getLicenseGroup(): Promise<void> {
    this.licenseGroupSubject.next([]);
    await GET_METHOD(`https://pcapi.valoracatalog.com/api/v1/LicenseGroup/All`,
      true).then((response: any) => {
        this.licenseGroupSubject.next(response?.types);
      })
  }

  async addNewLicenseGroup(newLicenseGroup: any): Promise<void> {
    await POST_METHOD(`https://pcapi.valoracatalog.com/api/v1/LicenseGroup/Add`, newLicenseGroup,
      true).then((response: any) => {
        return response;
      })
  }
}
