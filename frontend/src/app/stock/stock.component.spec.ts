import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { StockComponent } from './stock.component';
import { StockService } from '../shared/Service/Stock.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NGXLogger } from 'ngx-logger';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { Stock } from '../shared/Model/Stock';

describe('StockComponent', () => {
  let component: StockComponent;
  let fixture: ComponentFixture<StockComponent>;
  let mockStockService: jasmine.SpyObj<StockService>;
  let mockModalService: jasmine.SpyObj<NgbModal>;
  let mockLogger: jasmine.SpyObj<NGXLogger>;

  const mockStocks: Stock[] = [
    { idStock: 1, libelleStock: 'Stock A', qte: 10, qteMin: 5 },
    { idStock: 2, libelleStock: 'Stock B', qte: 20, qteMin: 10 }
  ];

  beforeEach(async () => {
    // Création des mocks avec toutes les méthodes nécessaires
    mockStockService = jasmine.createSpyObj('StockService',
      ['getAllStocks', 'addStock', 'editStock', 'deleteStock']);
    mockModalService = jasmine.createSpyObj('NgbModal', ['open']);
    mockLogger = jasmine.createSpyObj('NGXLogger', ['info', 'error']);

    // Configuration des mocks
    mockStockService.getAllStocks.and.returnValue(of(mockStocks));
    mockStockService.addStock.and.returnValue(of({}));
    mockStockService.deleteStock.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      declarations: [StockComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: StockService, useValue: mockStockService },
        { provide: NgbModal, useValue: mockModalService },
        { provide: NGXLogger, useValue: mockLogger }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch all stocks on init', () => {
    expect(mockStockService.getAllStocks).toHaveBeenCalled();
    expect(component.listStocks).toEqual(mockStocks);
  });

  it('should add a new stock', fakeAsync(() => {
    const newStock: Stock = { idStock: null, libelleStock: 'New Stock', qte: 15, qteMin: 3 };
    component.addStock(newStock);
    tick();

    expect(mockStockService.addStock).toHaveBeenCalledWith(newStock);
    expect(mockStockService.getAllStocks).toHaveBeenCalledTimes(2); // 1 pour ngOnInit, 1 après l'ajout
  }));

  it('should delete a stock', fakeAsync(() => {
    const stockId = 1;
    component.deleteStock(stockId);
    tick();

    expect(mockStockService.deleteStock).toHaveBeenCalledWith(stockId);
    expect(mockStockService.getAllStocks).toHaveBeenCalledTimes(2); // 1 pour ngOnInit, 1 après la suppression
  }));
  it('should display stocks in template', () => {
    // Initialise les données du composant
    component.listStocks = mockStocks;
    fixture.detectChanges(); // Déclenche la détection des changements

    const compiled = fixture.nativeElement;
    const rows = compiled.querySelectorAll('table tbody tr');

    expect(rows.length).toBe(mockStocks.length);
  });
  it('should handle errors when loading stocks', fakeAsync(() => {
    mockStockService.getAllStocks.and.returnValue(throwError(() => new Error('Test Error')));
    component.ngOnInit();
    tick();

    expect(mockLogger.error).toHaveBeenCalled();
  }));
});
