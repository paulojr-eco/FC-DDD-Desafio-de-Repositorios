import EventHandlerInterface from '../../../@shared/event/event-handler.interface';
import CustomerAddressChangedEvent from '../customer-address-changed.event';

export default class EnviaConsoleLogHandler
  implements EventHandlerInterface<CustomerAddressChangedEvent>
{
  handle(event: CustomerAddressChangedEvent): void {
    const { customerId, customerName, customerAddress } = event.eventData;
    console.log(
      `Endereço do cliente: ${customerId}, ${customerName} alterado para: ${customerAddress}`
    );
  }
}
