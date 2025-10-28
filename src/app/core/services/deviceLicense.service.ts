import { Injectable } from '@angular/core';
import { POST_METHOD, PUT_METHOD, GET_METHOD, DELETE_METHOD } from '../utils/https-requests';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DeviceLicenseService {

  constructor() { }
  async deleteLicense(unassignedDevice: any): Promise<void> {
    await DELETE_METHOD(`https://pcapi.valoracatalog.com/api/v1/DeviceLicense/UnAssign`,
      true, unassignedDevice).then((response: any) => {
      })
  }


  async assignLicense(assignedDevice: any): Promise<void> {
    await PUT_METHOD(`https://pcapi.valoracatalog.com/api/v1/DeviceLicense/Assign`,
      assignedDevice, true).then((response: any) => {
      })
  }

}
