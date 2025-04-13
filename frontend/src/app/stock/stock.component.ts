import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Stock } from '../shared/Model/Stock';
import { StockService } from '../shared/Service/Stock.service';
import { NGXLogger } from 'ngx-logger';  // Utiliser NGXLogger

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {

  listStocks: any;
  form: boolean = false;
  stock!: Stock;
  closeResult!: string;

  private logger: NGXLogger;  // Déclaration de NGXLogger

  constructor(private stockService: StockService, private modalService: NgbModal, logger: NGXLogger) {
    this.logger = logger;  // Injection du service NGXLogger
  }

  ngOnInit(): void {
    this.logger.info('Component initialized. Fetching all stocks...');
    this.getAllStockss();

    this.stock = {
      idStock: null,
      libelleStock: null,
      qte: null,
      qteMin: null
    };
  }

  getAllStockss() {
    this.logger.info('Fetching all stocks...');
    this.stockService.getAllStocks().subscribe(
        res => {
          this.logger.info('Stocks fetched successfully:', res);
          this.listStocks = res;
        },
        error => {
          this.logger.error('Error fetching stocks:', error);
        }
    );
  }

  addStock(p: any) {
    this.logger.info('Adding new stock:', p);
    this.stockService.addStock(p).subscribe(
        () => {
          this.logger.info('Stock added successfully');
          this.getAllStockss();
          this.form = false;
        },
        error => {
          this.logger.error('Error adding stock:', error);
        }
    );
  }

  editStock(stock: Stock) {
    this.logger.info('Editing stock:', stock);
    this.stockService.editStock(stock).subscribe(
        () => {
          this.logger.info('Stock edited successfully');
        },
        error => {
          this.logger.error('Error editing stock:', error);
        }
    );
  }

  deleteStock(idStock: any) {
    this.logger.info('Deleting stock with ID:', idStock);
    this.stockService.deleteStock(idStock).subscribe(
        () => {
          this.logger.info('Stock deleted successfully');
          this.getAllStockss();
        },
        error => {
          this.logger.error('Error deleting stock:', error);
        }
    );
  }

  open(content: any, action: any) {
    this.logger.info('Opening modal...');
    if (action != null) {
      this.logger.info('Editing stock:', action);
      this.stock = action;
    } else {
      this.stock = new Stock();
      this.logger.info('Creating new stock');
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.logger.info('Modal closed with result:', result);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.logger.info('Modal dismissed with reason:', reason);
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  cancel() {
    this.logger.info('Cancelling form...');
    this.form = false;
  }
}
