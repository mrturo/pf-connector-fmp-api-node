import { Stock as StockModel } from '../../../src/domain/model/stock.model';

describe('Class Stock Model', () => {
  it('Happy Path - Simple 1', async () => {
    const stock: StockModel = new StockModel('VOO');
    stock.name = 'TEST NAME';
    stock.sector = 'TEST SECTOR';
    stock.industry = 'TEST INDUSTRY';
    expect(stock.json(undefined, 1)).toEqual({
      symbol: 'VOO',
      name: 'TEST NAME',
      sector: 'TEST SECTOR',
      industry: 'TEST INDUSTRY',
      type: 'COMPANY',
      quantity: 1,
      unitPriceUSD: 1,
      amountUSD: 1,
      percentage: 100,
      amountLocal: undefined
    });
  });
  it('Happy Path - Simple 2', async () => {
    const stock: StockModel = new StockModel('VOO');
    stock.name = 'TEST NAME';
    stock.sector = 'TEST SECTOR';
    stock.industry = 'TEST INDUSTRY';
    expect(stock.json(1)).toEqual({
      symbol: 'VOO',
      name: 'TEST NAME',
      sector: 'TEST SECTOR',
      industry: 'TEST INDUSTRY',
      type: 'COMPANY',
      quantity: 1,
      unitPriceUSD: 1,
      amountUSD: 1,
      amountLocal: 1
    });
  });
  it('Happy Path - Complete 1', async () => {
    const stock: StockModel = new StockModel('VOO');
    expect(stock.json()).toEqual({
      symbol: 'VOO',
      name: undefined,
      sector: 'COMPANY',
      industry: 'COMPANY',
      type: 'COMPANY',
      quantity: 1,
      unitPriceUSD: 1,
      amountUSD: 1,
      amountLocal: undefined
    });
  });
  it('Happy Path - Complete 2', async () => {
    const stock1: StockModel = new StockModel('X1');
    const stock2: StockModel = new StockModel('X2');
    expect(StockModel.Json([stock1, stock2])).toEqual([
      {
        symbol: 'X1',
        name: undefined,
        sector: 'COMPANY',
        industry: 'COMPANY',
        type: 'COMPANY',
        quantity: 1,
        unitPriceUSD: 1,
        amountUSD: 1,
        amountLocal: undefined
      },
      {
        symbol: 'X2',
        name: undefined,
        sector: 'COMPANY',
        industry: 'COMPANY',
        type: 'COMPANY',
        quantity: 1,
        unitPriceUSD: 1,
        amountUSD: 1,
        amountLocal: undefined
      }
    ]);
  });
  it('Invalid symbol', async () => {
    let errorMsg = '';
    try {
      new StockModel('VO,O');
    } catch (error) {
      if (error instanceof Error) {
        errorMsg = error.message;
      }
    }
    expect(errorMsg).toBe('Invalid symbol: VO,O');
  });
  it('Invalid quantity', async () => {
    let errorMsg = '';
    try {
      new StockModel('VOO', -1);
    } catch (error) {
      if (error instanceof Error) {
        errorMsg = error.message;
      }
    }
    expect(errorMsg).toBe(
      'Stock quantity must be greater or equal than zero: -1'
    );
  });
  it('Invalid price', async () => {
    let errorMsg = '';
    try {
      const stock = new StockModel('VOO', 1);
      stock.unitPriceUSD = -1;
    } catch (error) {
      if (error instanceof Error) {
        errorMsg = error.message;
      }
    }
    expect(errorMsg).toBe(
      'Stock unit price must be greater or equal than zero: -1'
    );
  });
  it('Invalid type', async () => {
    let errorMsg = '';
    try {
      const stock = new StockModel('VOO', 1);
      stock.type = 'skdo';
    } catch (error) {
      if (error instanceof Error) {
        errorMsg = error.message;
      }
    }
    expect(errorMsg).toBe('Invalid stock type: skdo');
  });
});
