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

  private licenseGroupsListSubject = new BehaviorSubject<any>(undefined);
  licenseGroupsList$: Observable<any> = this.licenseGroupsListSubject.asObservable();

  private totalRecordsSubject = new BehaviorSubject<any>(undefined);
  totalRecords$: Observable<any> = this.totalRecordsSubject.asObservable();

  async getLicenseGroupPagination(pagination: any): Promise<any> {
    this.licenseGroupsListSubject.next([]);
    await POST_METHOD(`https://pcapi.valoracatalog.com/api/v1/LicenseGroup/Pagination`, pagination,
      true).then((response: any) => {
        this.licenseGroupsListSubject.next(response?.data);
        this.totalRecordsSubject.next(response?.totalRecords);
      })
  }

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
  async editNewLicenseGroup(editLicenseGroup: any): Promise<void> {
    await PUT_METHOD(`https://pcapi.valoracatalog.com/api/v1/LicenseGroup/Update`, editLicenseGroup,
      true).then((response: any) => {
        return response;
      })
  }
  async deleteNewLicenseGroup(id: any): Promise<any> {
    await DELETE_METHOD(`https://pcapi.valoracatalog.com/api/v1/LicenseGroup/Delete?id=${id}`,
      true).then((response: any) => {
        return response;
      })
  }
}
