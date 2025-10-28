import { Injectable } from '@angular/core';
import { POST_METHOD, PUT_METHOD, GET_METHOD, DELETE_METHOD } from '../utils/https-requests';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LicensesService {

  constructor() { }

  private deviceLicenseInfoSubject = new BehaviorSubject<any>(undefined);
  deviceLicenseInfo$: Observable<any> = this.deviceLicenseInfoSubject.asObservable();

  private licensesSubject = new BehaviorSubject<any>(undefined);
  licenses$: Observable<any> = this.licensesSubject.asObservable();

  private totalRecordsSubject = new BehaviorSubject<any>(undefined);
  totalRecords$: Observable<any> = this.totalRecordsSubject.asObservable();

  private licensesListSubject = new BehaviorSubject<any>(undefined);
  licensesList$: Observable<any> = this.licensesListSubject.asObservable();

  private totalRecordsListSubject = new BehaviorSubject<any>(undefined);
  totalRecordsList$: Observable<any> = this.totalRecordsListSubject.asObservable();


  private licensesActiveListSubject = new BehaviorSubject<any>(undefined);
  licensesActiveList$: Observable<any> = this.licensesActiveListSubject.asObservable();

  private totalRecordsActiveListSubject = new BehaviorSubject<any>(undefined);
  totalRecordsActiveList$: Observable<any> = this.totalRecordsActiveListSubject.asObservable();

  async getLicenseByDeviceId(id: number): Promise<void> {
    this.deviceLicenseInfoSubject.next([]);
    await GET_METHOD(`https://pcapi.valoracatalog.com/api/v1/License/ByDeviceId?id=${id}`,
      true).then((response: any) => {
        this.deviceLicenseInfoSubject.next(response?.data);
      })
  }

  async getLicenseWithDevices(pagination: any): Promise<void> {
    this.licensesSubject.next([]);
    await POST_METHOD(`https://pcapi.valoracatalog.com/api/v1/License/PaginationWithDevices`, pagination,
      true).then((response: any) => {
        this.licensesSubject.next(response?.data);
        this.totalRecordsSubject.next(response?.totalRecords);
      })
  }

  async getLicensePagination(pagination: any): Promise<void> {
    this.licensesListSubject.next([]);
    await POST_METHOD(`https://pcapi.valoracatalog.com/api/v1/License/Pagination`, pagination,
      true).then((response: any) => {
        this.licensesListSubject.next(response?.data);
        this.totalRecordsListSubject.next(response?.totalRecords);
      })
  }

  async getLicenseActivePagination(pagination: any): Promise<void> {
    this.licensesActiveListSubject.next([]);
    await POST_METHOD(`https://pcapi.valoracatalog.com/api/v1/License/PaginationActive`, pagination,
      true).then((response: any) => {
        this.licensesActiveListSubject.next(response?.data);
        this.totalRecordsActiveListSubject.next(response?.totalRecords);
      })
  }

  async addNewLicense(newLicense: any): Promise<any> {
    await POST_METHOD(`https://pcapi.valoracatalog.com/api/v1/License/Add`, newLicense,
      true).then((response: any) => {
        return response;
      })
  }

  async editNewLicense(editLicense: any): Promise<any> {
    await PUT_METHOD(`https://pcapi.valoracatalog.com/api/v1/License/Update`, editLicense,
      true).then((response: any) => {
        return response;
      })
  }

  async deleteLicense(id: number): Promise<void> {
    await DELETE_METHOD(`https://pcapi.valoracatalog.com/api/v1/License/Delete?id=${id}`,
      true).then((response: any) => {
      })
  }

}
