import { Injectable } from '@angular/core';
import { POST_METHOD, PUT_METHOD, GET_METHOD, DELETE_METHOD } from '../utils/https-requests';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LicenseTypeService {

  constructor() { }

  private licenseTypeSubject = new BehaviorSubject<any>(undefined);
  licenseType$: Observable<any> = this.licenseTypeSubject.asObservable();

  async getLicenseType(): Promise<void> {
    this.licenseTypeSubject.next([]);
    await GET_METHOD(`https://pcapi.valoracatalog.com/api/v1/LicenseType/All`,
      true).then((response: any) => {
        this.licenseTypeSubject.next(response?.types);
      })
  }
}
