import { Injectable } from '@angular/core';
import { POST_METHOD, PUT_METHOD, GET_METHOD, DELETE_METHOD } from '../utils/https-requests';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProxiesService {

  constructor() { }

  //PROXY INFO//////////////////////////////////////////////
  private deviceProxyInfoSubject = new BehaviorSubject<any>(undefined);
  deviceProxyInfo$: Observable<any> = this.deviceProxyInfoSubject.asObservable();
  //PROXY INFO//////////////////////////////////////////////

  //PROXIES//////////////////////////////////////////////
  private proxiesSubject = new BehaviorSubject<any>(undefined);
  proxies$: Observable<any> = this.proxiesSubject.asObservable();

  private totalRecordsSubject = new BehaviorSubject<any>(undefined);
  totalRecords$: Observable<any> = this.totalRecordsSubject.asObservable();
  //PROXIES//////////////////////////////////////////////

  //PROXIES LIST//////////////////////////////////////////////
  private proxiesListSubject = new BehaviorSubject<any>(undefined);
  proxiesList$: Observable<any> = this.proxiesListSubject.asObservable();

  private totalRecordsListSubject = new BehaviorSubject<any>(undefined);
  totalRecordsList$: Observable<any> = this.totalRecordsListSubject.asObservable();
  //PROXIES LIST//////////////////////////////////////////////

  private proxiesActiveListSubject = new BehaviorSubject<any>(undefined);
  proxiesActiveList$: Observable<any> = this.proxiesActiveListSubject.asObservable();
  private totalRecordsActiveListSubject = new BehaviorSubject<any>(undefined);
  totalRecordsActiveList$: Observable<any> = this.totalRecordsActiveListSubject.asObservable();

  async getProxyByDeviceId(id: number): Promise<void> {
    this.deviceProxyInfoSubject.next([]);
    await GET_METHOD(`https://pcapi.valoracatalog.com/api/v1/Proxy/ByDeviceId?id=${id}`,
      true).then((response: any) => {
        this.deviceProxyInfoSubject.next(response?.data);
      })
  }

  async getProxiesWithDevices(pagination: any): Promise<void> {
    this.proxiesSubject.next([]);
    await POST_METHOD(`https://pcapi.valoracatalog.com/api/v1/Proxy/PaginationWithDevices`, pagination,
      true).then((response: any) => {
        this.proxiesSubject.next(response?.data);
        this.totalRecordsSubject.next(response?.totalRecords);
      })
  }

  async getProxyPagination(pagination: any): Promise<void> {
    this.proxiesListSubject.next([]);
    await POST_METHOD(`https://pcapi.valoracatalog.com/api/v1/Proxy/Pagination`, pagination,
      true).then((response: any) => {
        this.proxiesListSubject.next(response?.data);
        this.totalRecordsListSubject.next(response?.totalRecords);
      })
  }

  async getProxiesActivePagination(pagination: any): Promise<void> {
    this.proxiesActiveListSubject.next([]);
    await POST_METHOD(`https://pcapi.valoracatalog.com/api/v1/Proxy/PaginationActive`, pagination,
      true).then((response: any) => {
        this.proxiesActiveListSubject.next(response?.data);
        this.totalRecordsActiveListSubject.next(response?.totalRecords);
      })
  }

  async addNewProxy(newProxy: any): Promise<any> {
    await POST_METHOD(`https://pcapi.valoracatalog.com/api/v1/Proxy/Add`, newProxy,
      true).then((response: any) => {
        return response;
      })
  }

  async editNewProxy(editLicense: any): Promise<any> {
    await PUT_METHOD(`https://pcapi.valoracatalog.com/api/v1/Proxy/Update`, editLicense,
      true).then((response: any) => {
        return response;
      })
  }

  async deleteProxy(id: number): Promise<void> {
    await DELETE_METHOD(`https://pcapi.valoracatalog.com/api/v1/Proxy/Delete?id=${id}`,
      true).then((response: any) => {
      })
  }

}
