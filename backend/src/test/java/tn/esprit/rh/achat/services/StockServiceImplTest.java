package tn.esprit.rh.achat.services;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;

import tn.esprit.rh.achat.entities.Stock;
import tn.esprit.rh.achat.repositories.StockRepository;

import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

@TestMethodOrder(OrderAnnotation.class)
@ExtendWith(MockitoExtension.class)
public class StockServiceImplTest {

    @Mock
    private StockRepository stockRepository;

    @InjectMocks
    private StockServiceImpl stockService;

    @Test
    void testRetrieveStock() {
        // Préparation des données
        Stock stock = new Stock();
        stock.setIdStock(1L);
        stock.setLibelleStock("Stock A");
        stock.setQte(10);
        stock.setQteMin(5);

        // Comportement du mock
        when(stockRepository.findById(1L)).thenReturn(Optional.of(stock));

        // Appel de la méthode
        Stock result = stockService.retrieveStock(1L);

        // Vérification
        assertNotNull(result);
        assertEquals("Stock A", result.getLibelleStock());
        assertEquals(10, result.getQte());

        // Vérifie que la méthode findById a bien été appelée
        verify(stockRepository, times(1)).findById(1L);
    }

    @Test
    void testAddStock() {
        // Préparation des données
        Stock stock = new Stock();
        stock.setLibelleStock("Stock B");

        // Comportement du mock
        when(stockRepository.save(any(Stock.class))).thenReturn(stock);

        // Appel de la méthode
        Stock result = stockService.addStock(stock);

        // Vérification
        assertNotNull(result);
        assertEquals("Stock B", result.getLibelleStock());

        // Vérifie que la méthode save a bien été appelée
        verify(stockRepository, times(1)).save(stock);
    }

    @Test
    void testUpdateStock() {
        // Préparation des données
        Stock stock = new Stock();
        stock.setIdStock(1L);
        stock.setLibelleStock("Stock A");
        stock.setQte(20);
        stock.setQteMin(10);

        // No need to mock findById since we're just testing save()

        // Appel de la méthode
        stockService.updateStock(stock);

        // Vérification
        verify(stockRepository, times(1)).save(stock);
    }

    @Test
    void testDeleteStock() {
        // No need to mock existsById() if it's not used in the implementation

        // Perform test actions
        stockService.deleteStock(1L);

        // Verify the interactions
        verify(stockRepository).deleteById(1L);
    }
}