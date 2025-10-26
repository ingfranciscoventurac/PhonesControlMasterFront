// pagination.model.ts
export interface PaginationRequest {
  id?: any;
  first: number;         // zero‑based index of first record
  rows: number;          // pageSize
  sortField: string;     // column key
  sortOrder: 1 | -1;     // asc=1 | desc=-1
  filters: string;       // whatever your API expects
  managerId?: number;
}

// pagination.model.ts
export interface TransactionsPaginationRequest {
  id?: number
  first: number
  rows: number
  sortField: string
  sortOrder: 1 | -1;
  filters: string
  currencies: string[]
  statuses: number[]
  channels: number[]
  types: number[]
  amounttype: number
  amountinitial: number
  amountfinal: number
  datetype: number
  dateinitial: string
  datefinal: string
}

export interface ServicesPaginationRequest {
  id?: number
  first: number
  rows: number
  sortField: string
  sortOrder: 1 | -1;
  filters: string
  currencies: string[]
  statuses: number[]
  channels: number[]
  types: number[]
  amounttype: number
  createdby: number[]
  amountinitial: number
  amountfinal: number
  datetype: number
  dateinitial: string
  datefinal: string
}
