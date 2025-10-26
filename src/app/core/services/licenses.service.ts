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

}
