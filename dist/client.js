(() => {
  // node_modules/.pnpm/@project-error+pe-utils@0.3.0/node_modules/@project-error/pe-utils/lib/common/helpers.js
  function PrefixedUUID(iterator) {
    return `${iterator.toString(36)}-${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(36)}`;
  }

  // node_modules/.pnpm/@project-error+pe-utils@0.3.0/node_modules/@project-error/pe-utils/lib/client/cl_utils.js
  var ClientUtils = class {
    constructor(settings) {
      this.uidCounter = 0;
      this._settings = {
        promiseTimeout: 15e3,
        debugMode: false
      };
      this.setSettings(settings);
    }
    debugLog(...args) {
      if (!this._settings.debugMode)
        return;
      console.log(`^1[ClUtils]^0`, ...args);
    }
    /**
     * Change the settings for this instance by passing a new config
     * @param settings Settings to overwrite
     **/
    setSettings(settings) {
      this._settings = Object.assign(Object.assign({}, this._settings), settings);
    }
    /**
     * Emit a promisified event towards the server which will resolve once the
     * server responds.
     * @typeParam T The return type of the event
     * @param eventName The event name
     * @param data The data you wish to send with the request
     **/
    emitNetPromise(eventName, data) {
      return new Promise((resolve, reject) => {
        let hasTimedOut = false;
        setTimeout(() => {
          hasTimedOut = true;
          reject(`${eventName} has timed out after ${this._settings.promiseTimeout} ms`);
        }, this._settings.promiseTimeout);
        const uniqId = PrefixedUUID(this.uidCounter++);
        const listenEventName = `${eventName}:${uniqId}`;
        emitNet(eventName, listenEventName, data);
        const handleListenEvent = (data2) => {
          removeEventListener(listenEventName, handleListenEvent);
          if (hasTimedOut)
            return;
          resolve(data2);
        };
        onNet(listenEventName, handleListenEvent);
      });
    }
    /**
     *  Will Register an NUI event callback that will immediately proxy to a
     *  server side promisified event of the same name. Once the server responds
     *  and resolves the promise on the client, this function will callback to the
     *  NUI and resolve the original HTTP request.
     *
     *  @param event The event name to listen for
     */
    registerNuiProxy(event) {
      RegisterNuiCallbackType(event);
      on(`__cfx_nui:${event}`, async (data, cb) => {
        this.debugLog(`NUICallback processed: ${event}`);
        this.debugLog(`NUI CB Data:`, data);
        try {
          const res = await this.emitNetPromise(event, data);
          cb(res);
        } catch (e) {
          console.error("Error encountered while listening to resp. Error:", e);
          cb({ err: e });
        }
      });
    }
    /**
     * Register a listener for the RPC system which can then be triggered by the
     * server side RPC call.
     *
     * @typeParam T the type of data that will be sent to the listener
     * @typeParam R the type of data that will be returned by the listener
     * @param eventName - The event name to listen for
     * @param cb - The callback function that returns the desired value back to
     * the server
     **/
    registerRPCListener(eventName, cb) {
      onNet(eventName, (listenEventName, data) => {
        this.debugLog(`RPC called: ${eventName}`);
        Promise.resolve(cb(data)).then((retData) => {
          this.debugLog(`RPC Data:`, data);
          emitNet(listenEventName, retData);
        }).catch((e) => {
          console.error(`RPC Error in ${eventName}, ERR: ${e.message}`);
        });
      });
    }
  };

  // client/client.ts
  var ClUtils = new ClientUtils({ promiseTimout: 200 });
  var npwdExports = global.exports["npwd"];
  onNet("npwd-blackmarket:updateNUI" /* UpdateNUI */, () => {
    npwdExports.sendNPWDMessage({ type: "npwd-blackmarket:updateNUI" /* UpdateNUI */ });
  });
  RegisterNuiProxy("npwd-blackmarket:getUser" /* GetUser */);
  RegisterNuiProxy("npwd-blackmarket:getListings" /* GetListings */);
  RegisterNuiProxy("npwd-blackmarket:createListing" /* CreateListing */);
  RegisterNuiProxy("npwd-blackmarket:deleteListing" /* DeleteListing */);
  RegisterNuiProxy("npwd-blackmarket:reportListing" /* ReportListing */);
  function RegisterNuiProxy(event) {
    RegisterNuiCallbackType(event);
    on(`__cfx_nui:${event}`, async (data, cb) => {
      try {
        const res = await ClUtils.emitNetPromise(event, data);
        cb(res);
      } catch (e) {
        console.error("Error encountered while listening to resp. Error:", e);
        cb({ status: "error" });
      }
    });
  }
})();
