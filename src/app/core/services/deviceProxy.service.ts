import { Injectable } from '@angular/core';
import { POST_METHOD, PUT_METHOD, GET_METHOD, DELETE_METHOD } from '../utils/https-requests';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DeviceProxyService {

  constructor() { }
  async deleteProxy(unassignedDevice: any): Promise<void> {
    await DELETE_METHOD(`https://pcapi.valoracatalog.com/api/v1/DeviceProxy/UnAssign`,
      true, unassignedDevice).then((response: any) => {
      })
  }


  async assignProxy(assignedDevice: any): Promise<void> {
    console.log("🚀 ~ DeviceProxyService ~ assignProxy ~ assignedDevice:", assignedDevice)
    await PUT_METHOD(`https://pcapi.valoracatalog.com/api/v1/DeviceProxy/Assign`,
      assignedDevice, true).then((response: any) => {
      })
  }

}
