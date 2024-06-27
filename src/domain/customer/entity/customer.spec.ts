import EventDispatcher from '../../@shared/event/event-dispatcher';
import EnviaConsoleLog1Handler from '../event/handler/envia-console-log-1.handler';
import EnviaConsoleLog2Handler from '../event/handler/envia-console-log-2.handler';
import EnviaConsoleLogHandler from '../event/handler/envia-console-log.handler';
import Address from '../value-object/address';
import Customer from './customer';

describe('Customer unit tests', () => {
  it('should throw error when id is empty', () => {
    expect(() => {
      let customer = new Customer('', 'Paulo');
    }).toThrowError('Id is required');
  });

  it('should throw error when name is empty', () => {
    expect(() => {
      let customer = new Customer('123', '');
    }).toThrowError('Name is required');
  });

  it('should change name', () => {
    // Arrange
    const customer = new Customer('123', 'Paulo');

    // Act
    customer.changeName('Jane');

    // Assert
    expect(customer.name).toBe('Jane');
  });

  it('should activate customer', () => {
    const customer = new Customer('1', 'Customer 1');
    const address = new Address('Street 1', 123, '13330-250', 'São Paulo');
    customer.Address = address;

    customer.activate();

    expect(customer.isActive()).toBe(true);
  });

  it('should throw error when address is undefined when you activate a customer', () => {
    expect(() => {
      const customer = new Customer('1', 'Customer 1');
      customer.activate();
    }).toThrowError('Address is mandatory to activate a customer');
  });

  it('should deactivate customer', () => {
    const customer = new Customer('1', 'Customer 1');

    customer.deactivate();

    expect(customer.isActive()).toBe(false);
  });

  it('should add reward points', () => {
    const customer = new Customer('1', 'Customer 1');
    expect(customer.rewardPoints).toBe(0);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(10);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(20);
  });

  it('should create a customer and dispatch event', () => {
    const eventDispatcher = EventDispatcher.getInstance();

    const enviaConsoleLog1Handler = new EnviaConsoleLog1Handler();
    eventDispatcher.register('CustomerCreatedEvent', enviaConsoleLog1Handler);
    const spyEnviaConsoleLog1Handler = jest.spyOn(
      enviaConsoleLog1Handler,
      'handle'
    );

    const enviaConsoleLog2Handler = new EnviaConsoleLog2Handler();
    eventDispatcher.register('CustomerCreatedEvent', enviaConsoleLog2Handler);
    const spyEnviaConsoleLog2Handler = jest.spyOn(
      enviaConsoleLog2Handler,
      'handle'
    );

    const spyConsole = jest.spyOn(console, 'log');

    new Customer('123', 'Paulo');

    expect(
      eventDispatcher.getEventHandlers['CustomerCreatedEvent']
    ).toBeDefined();
    expect(
      eventDispatcher.getEventHandlers['CustomerCreatedEvent'].length
    ).toBe(2);
    expect(
      eventDispatcher.getEventHandlers['CustomerCreatedEvent'][0]
    ).toMatchObject(enviaConsoleLog1Handler);
    expect(
      eventDispatcher.getEventHandlers['CustomerCreatedEvent'][1]
    ).toMatchObject(enviaConsoleLog2Handler);
    expect(spyEnviaConsoleLog1Handler).toHaveBeenCalled();
    expect(spyConsole).toHaveBeenCalledWith(
      'Esse é o primeiro console.log do evento: CustomerCreated'
    );
    expect(spyEnviaConsoleLog2Handler).toHaveBeenCalled();
    expect(spyConsole).toHaveBeenCalledWith(
      'Esse é o segundo console.log do evento: CustomerCreated'
    );
  });

  it('should change address and dispatch event', () => {
    const eventDispatcher = EventDispatcher.getInstance();

    const enviaConsoleLogHandler = new EnviaConsoleLogHandler();
    eventDispatcher.register(
      'CustomerAddressChangedEvent',
      enviaConsoleLogHandler
    );
    const spyEnviaConsoleLogHandler = jest.spyOn(
      enviaConsoleLogHandler,
      'handle'
    );
    const spyConsole = jest.spyOn(console, 'log');
    const customer = new Customer('123', 'Paulo');
    const address = new Address('Street 1', 123, '13330-250', 'São Paulo');
    customer.changeAddress(address);

    expect(
      eventDispatcher.getEventHandlers['CustomerAddressChangedEvent']
    ).toBeDefined();
    expect(
      eventDispatcher.getEventHandlers['CustomerAddressChangedEvent'].length
    ).toBe(1);
    expect(
      eventDispatcher.getEventHandlers['CustomerAddressChangedEvent'][0]
    ).toMatchObject(enviaConsoleLogHandler);
    expect(spyEnviaConsoleLogHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        eventData: {
          customerId: customer.id,
          customerName: customer.name,
          customerAddress: customer.Address,
        },
      })
    );
    expect(spyConsole).toHaveBeenCalledWith(
      `Endereço do cliente: ${customer.id}, ${customer.name} alterado para: ${customer.Address}`
    );
  });
});
