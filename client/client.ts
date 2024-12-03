import { ListingsEvents } from '../shared/events';
import { ClientUtils, RegisterNuiCB } from '@project-error/pe-utils';

export const ClUtils = new ClientUtils({ promiseTimout: 200 });

const npwdExports = global.exports['npwd'];

onNet(ListingsEvents.UpdateNUI, () => {
  npwdExports.sendNPWDMessage({ type: ListingsEvents.UpdateNUI });
});


RegisterNuiProxy(ListingsEvents.GetUser);
RegisterNuiProxy(ListingsEvents.GetListings);
RegisterNuiProxy(ListingsEvents.CreateListing);
RegisterNuiProxy(ListingsEvents.DeleteListing);
RegisterNuiProxy(ListingsEvents.ReportListing);

function RegisterNuiProxy(event: string) {
  RegisterNuiCallbackType(event);
  on(`__cfx_nui:${event}`, async (data: unknown, cb: CallableFunction) => {
    try {
      const res = await ClUtils.emitNetPromise(event, data);
      cb(res);
    } catch (e) {
      console.error('Error encountered while listening to resp. Error:', e);
      cb({ status: 'error' });
    }
  });
}