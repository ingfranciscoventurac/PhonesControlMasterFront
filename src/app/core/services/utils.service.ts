import { Injectable } from '@angular/core'
import axios from 'axios';
@Injectable({
  providedIn: 'root',
})
export class UtilsService {


  constructor() { }

  dividePercentage(percentage: any) {
    const percent: any = percentage / 3
    const value = parseInt(percent)
    return value
  }


  // async GET_METHOD(url: string, hasToken: boolean, fromApp: boolean = false): Promise<any> {
  //   const token = this.authService.token;

  //   try {
  //     const response = await axios.get(`${fromApp ? API_BASE_URL2 : API_BASE_URL}${url}`, {
  //       headers: {
  //         accept: '*/*',
  //         Authorization: hasToken ? `Bearer ${token}` : 'Bearer',
  //       },
  //     });
  //     return response.data;
  //   } catch (error: any) {
  //     if (error?.response?.status === 401) {
  //       this.authService.logout();
  //     }
  //     return {
  //       error: true,
  //       status: error?.response?.status,
  //       response: error?.response?.data,
  //     };
  //   }
  // }

  // async POST_METHOD(url: string, data: any, hasToken: boolean): Promise<any> {
  //   const token = this.authService.token;

  //   try {
  //     const response = await axios.post(`${API_BASE_URL}${url}`, data, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         accept: '*/*',
  //         Authorization: hasToken ? `Bearer ${token}` : 'Bearer',
  //       },
  //     });
  //     return response.data;
  //   } catch (error: any) {
  //     if (error?.response?.status === 401) {
  //       this.authService.logout();
  //     }
  //     return {
  //       error: true,
  //       status: error?.response?.status,
  //       response: error?.response?.data,
  //     };
  //   }
  // }

  // async PUT_METHOD(url: string, data: any, hasToken: boolean): Promise<any> {
  //   const token = this.authService.token;

  //   try {
  //     const response = await axios.put(`${API_BASE_URL}${url}`, data ?? null, {
  //       headers: {
  //         accept: '*/*',
  //         Authorization: hasToken ? `Bearer ${token}` : 'Bearer',
  //       },
  //     });
  //     return response.data;
  //   } catch (error: any) {
  //     if (error?.response?.status === 401) {
  //       this.authService.logout();
  //     }
  //     return {
  //       error: true,
  //       status: error?.response?.status,
  //       response: error?.response?.data,
  //     };
  //   }
  // }

  // async DELETE_METHOD(url: string, hasToken: boolean): Promise<any> {
  //   const token = this.authService.token;

  //   try {

  //     const response = await axios.delete(
  //       `${API_BASE_URL}${url}`,
  //       hasToken
  //         ? {
  //           headers: {
  //             accept: "*/*",
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //         : undefined
  //     );
  //     return response.data;
  //   } catch (error: any) {
  //     if (error?.response?.status === 401) {
  //       this.authService.logout();
  //     }
  //     return {
  //       error: true,
  //       status: error?.response?.status,
  //       response: error?.response?.data,
  //     };
  //   }
  // }

  // findAllParent(menuItems: MenuItem[], menuItem: any): any {
  //   let parents = [];
  //   const parent = this.findMenuItem(menuItems, menuItem['parentKey']);

  //   if (parent) {
  //     parents.push(parent['key']);
  //     if (parent['parentKey']) {
  //       parents = [...parents, ...this.findAllParent(menuItems, parent)];
  //     }
  //   }
  //   return parents;
  // }

  // findMenuItem(menuItems: MenuItem[], menuItemKey: string): any {
  //   if (menuItems && menuItemKey) {
  //     for (let i = 0; i < menuItems.length; i++) {
  //       if (menuItems[i].key === menuItemKey) {
  //         return menuItems[i];
  //       }
  //       const found = this.findMenuItem(menuItems[i].subMenu, menuItemKey);
  //       if (found) return found;
  //     }
  //   }
  //   return null;
  // }

  addOrSubtractDaysFromDate(days: number): Date {
    const result = new Date();
    result.setDate(result.getDate() + days);
    return result;
  }

  shuffleArray(array: any[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  getDateNow(): string {
    const now = new Date();
    return now.toISOString();
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  // formatNumberWithCommas(num: Decimal, numberOfDecimal = 2): string {
  //   const truncated = num.toDecimalPlaces(numberOfDecimal, Decimal.ROUND_DOWN).toString();
  //   const [intPart, fracPart = ''] = truncated.split('.');
  //   const paddedFrac = fracPart.padEnd(numberOfDecimal, '0');
  //   const intWithCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  //   return `${intWithCommas}.${paddedFrac}`;
  // }

  capitalizeFirstLetter(value: string): string {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  formatPhoneNumber(input: string | number): string {
    const digits = String(input).replace(/\D/g, '');
    if (digits.length !== 10) throw new Error('Phone number must contain exactly 10 digits.');
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  formatDateTime(date: string, hour = true): string {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };
    if (hour) {
      options.hour = '2-digit';
      options.minute = '2-digit';
      options.hour12 = true;
    }
    return new Date(date).toLocaleString('en-GB', options);
  }

  isValidGlobalPhoneNumber(phone: string): boolean {
    const cleaned = phone.replace(/[\s()-]/g, '');
    const regex = /^\+[1-9]\d{0,2}\d{10}$/;
    return regex.test(cleaned);
  }

  isValidTenDigitPhoneNumber(phone: string): boolean {
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length === 10;
  }

  // formatToTwoDecimals(input: number | string | Decimal): string {
  //   return new Decimal(input).toFixed(2, Decimal.ROUND_HALF_UP);
  // }

  // calculateAmountAfterCommissionTransfer(amount: number, type: number, commission: number): Decimal {
  //   const decimalAmount = new Decimal(amount);
  //   const decimalCommission = new Decimal(commission);
  //   if ((type !== 1 && type !== 2) || !amount) return new Decimal(0);

  //   if (type === 1) return decimalAmount.plus(decimalCommission);
  //   return decimalAmount.plus(decimalAmount.mul(decimalCommission.div(100)));
  // }

  // calculateAmountMinusCommissionTransfer(amount: number | Decimal, type: number, commission: number): Decimal {
  //   const decimalAmount = new Decimal(amount);
  //   const decimalCommission = new Decimal(commission);
  //   if ((type !== 1 && type !== 2) || !amount) return new Decimal(0);

  //   if (type === 1) return decimalAmount.minus(decimalCommission);
  //   return decimalAmount
  //     .div(decimalCommission.div(100).plus(1))
  //     .toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  // }

  // async calculateExchangeRate(fromCurrency: string, toCurrency: string): Promise<Decimal | null> {
  //   if (!fromCurrency || !toCurrency) {
  //     console.log(`Missing currency: from=${fromCurrency}, to=${toCurrency}`);
  //     return null;
  //   }

  //   try {
  //     const response = await this.POST_METHOD('/ExchangeRate/ByCode', {
  //       parentCode: fromCurrency,
  //       code: toCurrency,
  //       currencyDate: this.getDateNow(),
  //     }, true);

  //     if (response.result === 'Ok') {
  //       return new Decimal(response.data.rate);
  //     } else {
  //       console.error('Unexpected API response:', response.data);
  //       return null;
  //     }
  //   } catch (error) {
  //     console.error('API Error:', error);
  //     return null;
  //   }
  // }

  identifyHaitianMobileWithout509(input: string): { id: number, name: 'MonCash' | 'NatCash', key: string } | null {
    const digitsOnly = input.replace(/\D+/g, '');
    if (!/^\d{8}$/.test(digitsOnly)) return null;
    const prefix = parseInt(digitsOnly.slice(0, 2), 10);
    const natcomPrefixes = new Set([32, 33, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49]);
    if (natcomPrefixes.has(prefix)) {
      return { id: 2, name: 'NatCash', key: '2' };
    }
    return { id: 1, name: 'MonCash', key: '1' };
  }

  async copy(text: string): Promise<boolean> {
    if (!text && text !== '') return false;

    try {
      // Modern async API
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }

      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      // Avoid scrolling to bottom
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.setAttribute('readonly', '');
      document.body.appendChild(textarea);
      textarea.select();

      const success = document.execCommand('copy');
      document.body.removeChild(textarea);

      return !!success;
    } catch (err) {
      console.error('Clipboard copy failed', err);
      return false;
    }
  }

}
