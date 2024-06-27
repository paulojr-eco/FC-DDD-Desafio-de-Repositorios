import EventDispatcher from '../../@shared/event/event-dispatcher';
import CustomerAddressChangedEvent from '../event/customer-address-changed.event';
import CustomerCreatedEvent from '../event/customer-created.event';
import EnviaConsoleLog1Handler from '../event/handler/envia-console-log-1.handler';
import Address from '../value-object/address';

export default class Customer {
  private _id: string;
  private _name: string = '';
  private _address!: Address;
  private _active: boolean = false;
  private _rewardPoints: number = 0;
  private _eventDispatcher: EventDispatcher;

  constructor(id: string, name: string) {
    this._id = id;
    this._name = name;
    this.validate();
    this._eventDispatcher = EventDispatcher.getInstance();
    this.createCustomerEvent();
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get rewardPoints(): number {
    return this._rewardPoints;
  }

  private createCustomerEvent() {
    const customerCreatedEvent = new CustomerCreatedEvent({});
    this._eventDispatcher.notify(customerCreatedEvent);
  }

  validate() {
    if (this._id.length === 0) {
      throw new Error('Id is required');
    }
    if (this._name.length === 0) {
      throw new Error('Name is required');
    }
  }

  changeName(name: string) {
    this._name = name;
    this.validate();
  }

  get Address(): Address {
    return this._address;
  }

  changeAddress(address: Address) {
    this._address = address;
    const customerAddressChanged = new CustomerAddressChangedEvent({
      customerId: this._id,
      customerName: this._name,
      customerAddress: address,
    });
    this._eventDispatcher.notify(customerAddressChanged);
  }

  isActive(): boolean {
    return this._active;
  }

  activate() {
    if (this._address === undefined) {
      throw new Error('Address is mandatory to activate a customer');
    }
    this._active = true;
  }

  deactivate() {
    this._active = false;
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points;
  }

  set Address(address: Address) {
    this._address = address;
  }
}
