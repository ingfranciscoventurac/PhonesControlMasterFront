import {
  Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges,
  OnChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Observable, takeUntil } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PaginationRequest, ServicesPaginationRequest, TransactionsPaginationRequest } from '../../models/pagination.model';
import {
  ContentChild,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { UtilsService } from '../../services/utils.service';
@Component({
  selector: 'CustomTable',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './custom-table.component.html',
  styleUrl: './custom-table.component.scss'
})
export class CustomTableComponent implements OnDestroy, OnInit, OnChanges {
  form!: FormGroup;
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  @ContentChild('rowTemplate', { static: false }) rowTemplate?: TemplateRef<any>;
  //@Input() displayedColumns: { [key: string]: string } = {};
  @Input() cols: { variableName: string; headerName: string; dataType?: string; canCopy?: boolean }[] = [];
  @Input() fetchData!: (pagination: PaginationRequest) => void;
  @Input() customFetchData?: (pagination: any) => void;
  @Input() customFetchDataType?: string = '';
  @Input() data$!: Observable<any[]>;
  @Input() totalRecords$!: Observable<number>;
  @Output() rowSelected = new EventEmitter<any>();
  @Input() hasRadiobox: boolean = false;
  @Input() hasOverlayMenu: boolean = false;
  @Input() isAscendant: boolean = false;
  @Input() sortFirstBy: string | null = null;
  @Input() isCustomPagination?: boolean = false;
  @Input() additionalPaginationVariables?: any = {};
  data: any[] = [];

  totalRecords?: number;
  pageSizeOptions: number[] = [10, 20, 30, 50];

  searchTerm: string = '';
  sortedColumn: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  private overlayRef: OverlayRef | null = null;

  @ContentChild('customMenuTemplate', { static: false }) customMenuTemplate!: TemplateRef<any>;
  @ViewChild('defaultMenuTemplate') defaultMenuTemplate?: TemplateRef<any>;


  constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private utilsService: UtilsService,
  ) { }


  get visiblePageButtons(): number[] {
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, start + 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  ngOnInit(): void {

    if (this.sortFirstBy) {
      this.sortedColumn = this.sortFirstBy;
    }

    this.form = new FormGroup({
      radioInput: new FormControl(null),
    });

    this.data$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.data = data;
    });

    this.totalRecords$.pipe(takeUntil(this.destroy$)).subscribe((total) => {
      this.totalRecords = total;
      this.totalPages = Math.ceil(total / this.pageSize);
    });



    this.searchSubject.pipe(
      debounceTime(500),
      takeUntil(this.destroy$)
    ).subscribe(term => {
      this.searchTerm = term;
      this.currentPage = 1;
      this.loadPage();
    });

    this.loadPage();
  }

  ngOnChanges(changes: SimpleChanges) {
    const change = changes['additionalPaginationVariables'];
    if (change && !change.firstChange) {
      this.loadPage();
    }
  }

  async copyText(text: string) {
    const ok = await this.utilsService.copy(text);
    console.log("🚀 ~ AmeroComponent ~ copyText ~ ok:", ok)
  }



  selectRow(row: any) {
    if (this.hasRadiobox) {
      // if you prefer comparing by id: this.form.get('radioInput').setValue(row.id)
      this.form.get('radioInput')!.setValue(row);
      this.onRadioChange(row); // keep current behavior
    }

  }

  // Helper used by template for highlighting
  isSelected(row: any) {
    if (this.hasRadiobox) {
      const current = this.form.get('radioInput')!.value;
      // If using object identity:
      return current === row;
    }
    return;
  }


  onRadioChange(data: any) {
    this.rowSelected.emit(data);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchChange() {
    this.searchSubject.next(this.searchTerm);
  }


  getValue(row: any, key: string): any {
    return row[key];
  }

  sortBy(column: string) {
    if (this.sortedColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortedColumn = column;
      this.sortDirection = 'asc';
    }
    this.currentPage = 1;
    this.loadPage();
  }

  loadPage(): void {
    let sortOrderValue = 1 as 1 | -1;

    if (this.isAscendant) {
      sortOrderValue = -1;
      this.isAscendant = false;
    } else {
      sortOrderValue = this.sortDirection === 'asc' ? 1 : -1;
    }

    if (this.isCustomPagination) {
      if (this.customFetchDataType == "services") {

        const customPaginationRequest: ServicesPaginationRequest = {
          first: (this.currentPage - 1) * this.pageSize,
          rows: this.pageSize,
          sortField: this.sortedColumn == null ? 'id' : this.sortedColumn,
          sortOrder: sortOrderValue,
          filters: this.additionalPaginationVariables.filters,
          currencies: this.additionalPaginationVariables.currencies,
          statuses: this.additionalPaginationVariables.statuses,
          channels: this.additionalPaginationVariables.channels,
          createdby: this.additionalPaginationVariables.createdby,
          types: this.additionalPaginationVariables.types,
          amounttype: this.additionalPaginationVariables.amounttype,
          amountinitial: this.additionalPaginationVariables.amountinitial,
          amountfinal: this.additionalPaginationVariables.amountfinal,
          datetype: this.additionalPaginationVariables.datetype,
          dateinitial: this.additionalPaginationVariables.dateinitial,
          datefinal: this.additionalPaginationVariables.datefinal,
        };

        if (this.isCustomPagination) {
          this.customFetchData!(customPaginationRequest);

          return;
        }
      } else if (this.customFetchDataType == "regionalManager") {


        const customPaginationRequest: PaginationRequest = {
          first: (this.currentPage - 1) * this.pageSize,
          rows: this.pageSize,
          sortField: this.sortedColumn || 'id',
          sortOrder: sortOrderValue,
          filters: this.additionalPaginationVariables.filters,
          managerId: this.additionalPaginationVariables.managerId,
        };

        if (this.isCustomPagination) {
          this.customFetchData!(customPaginationRequest);
          return;
        }
      } else if (this.customFetchDataType == "licenses") {


        const customPaginationRequest: any = {
          first: (this.currentPage - 1) * this.pageSize,
          rows: this.pageSize,
          sortField: this.sortedColumn == null ? 'deviceId' : this.sortedColumn,
          sortOrder: sortOrderValue,
          filters: this.additionalPaginationVariables.filters,
          typeId: this.additionalPaginationVariables.typeId,
          groupId: this.additionalPaginationVariables.groupId,
          family: this.additionalPaginationVariables.family,
          userId: this.additionalPaginationVariables.userId,
        }

        if (this.isCustomPagination) {
          this.customFetchData!(customPaginationRequest);
          return;
        }
      }
      else if (this.customFetchDataType == "licensesList") {


        const customPaginationRequest: any = {
          first: (this.currentPage - 1) * this.pageSize,
          rows: this.pageSize,
          sortField: this.sortedColumn == null ? 'id' : this.sortedColumn,
          sortOrder: sortOrderValue,
          filters: this.additionalPaginationVariables.filters,
          userId: this.additionalPaginationVariables.userId,
        }

        if (this.isCustomPagination) {
          this.customFetchData!(customPaginationRequest);
          return;
        }
      }
      else if (this.customFetchDataType == "licensesGroup") {


        const customPaginationRequest: any = {
          first: (this.currentPage - 1) * this.pageSize,
          rows: this.pageSize,
          sortField: this.sortedColumn == null ? 'id' : this.sortedColumn,
          sortOrder: sortOrderValue,
          filters: this.additionalPaginationVariables.filters,
          userId: this.additionalPaginationVariables.userId,
        }

        if (this.isCustomPagination) {
          this.customFetchData!(customPaginationRequest);
          return;
        }
      }
      else if (this.customFetchDataType == "licensesActive") {


        const customPaginationRequest: any = {
          first: (this.currentPage - 1) * this.pageSize,
          rows: this.pageSize,
          sortField: this.sortedColumn == null ? 'id' : this.sortedColumn,
          sortOrder: sortOrderValue,
          filters: this.additionalPaginationVariables.filters,
          userId: this.additionalPaginationVariables.userId,
        }

        if (this.isCustomPagination) {
          this.customFetchData!(customPaginationRequest);
          return;
        }
      }
      else if (this.customFetchDataType == "proxies") {

        const customPaginationRequest: any = {
          first: (this.currentPage - 1) * this.pageSize,
          rows: this.pageSize,
          sortField: this.sortedColumn == null ? 'id' : this.sortedColumn,
          sortOrder: sortOrderValue,
          filters: this.additionalPaginationVariables.filters,
          userId: this.additionalPaginationVariables.userId,
        }

        if (this.isCustomPagination) {
          this.customFetchData!(customPaginationRequest);
          return;
        }
      }
      else if (this.customFetchDataType == "proxiesActive") {


        const customPaginationRequest: any = {
          first: (this.currentPage - 1) * this.pageSize,
          rows: this.pageSize,
          sortField: this.sortedColumn == null ? 'id' : this.sortedColumn,
          sortOrder: sortOrderValue,
          filters: this.additionalPaginationVariables.filters,
          userId: this.additionalPaginationVariables.userId,
        }

        if (this.isCustomPagination) {
          this.customFetchData!(customPaginationRequest);
          return;
        }
      }
      else {
        const customPaginationRequest: TransactionsPaginationRequest = {
          first: (this.currentPage - 1) * this.pageSize,
          rows: this.pageSize,
          sortField: this.sortedColumn || 'id',
          sortOrder: sortOrderValue,
          filters: this.additionalPaginationVariables.filters,
          currencies: this.additionalPaginationVariables.currencies,
          statuses: this.additionalPaginationVariables.statuses,
          channels: this.additionalPaginationVariables.channels,
          types: this.additionalPaginationVariables.types,
          amounttype: this.additionalPaginationVariables.amounttype,
          amountinitial: this.additionalPaginationVariables.amountinitial,
          amountfinal: this.additionalPaginationVariables.amountfinal,
          datetype: this.additionalPaginationVariables.datetype,
          dateinitial: this.additionalPaginationVariables.dateinitial,
          datefinal: this.additionalPaginationVariables.datefinal,
        };

        if (this.isCustomPagination) {
          this.customFetchData!(customPaginationRequest);
          return;
        }
      }

    } else {

      const paginationRequest: PaginationRequest = {
        first: (this.currentPage - 1) * this.pageSize,
        rows: this.pageSize,
        sortField: this.sortedColumn || 'id',
        sortOrder: sortOrderValue,
        filters: this.searchTerm
      };

      this.fetchData(paginationRequest);
      return;
    }

  }

  closeModal(modal: any) {
    modal.dismiss();
  }

  changePageSize(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadPage();
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.loadPage();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadPage();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPage();
    }
  }

  toggleMenu(trigger: HTMLElement, ...props: any) {
    this.rowSelected.emit(props[0].rowSelected);
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
      return;
    }

    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(trigger)
      .withPositions([
        {
          originX: 'end',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'top',
          offsetY: 10
        }
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.close()
    });

    if (this.defaultMenuTemplate) {
      const portal = new TemplatePortal(
        this.defaultMenuTemplate,
        this.viewContainerRef,
        { $implicit: props[0]?.rowSelected, closeMenu: () => this.closeMenu() } // <-- Context
      );
      this.overlayRef.attach(portal);
    }
    this.overlayRef.backdropClick().subscribe(() => {
      this.overlayRef?.dispose();
      this.overlayRef = null;
    });
  }

  closeMenu() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }
}
