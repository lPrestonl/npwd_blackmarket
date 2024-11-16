(() => {
  // client/client.ts
  var isFocused = false;
  var exps = global.exports;
  RegisterCommand(
    "focus",
    () => {
      if (isFocused) {
        SetNuiFocus(false, false);
        SetNuiFocusKeepInput(false);
        isFocused = false;
        return;
      }
      global.exports["npwd"].sendUIMessage("RANDOM", "Hello from client");
      SetNuiFocusKeepInput(true);
      SetNuiFocus(true, true);
      isFocused = true;
    },
    false
  );
  RegisterCommand(
    "unfocus",
    () => {
      SetNuiFocus(false, false);
    },
    false
  );
  RegisterKeyMapping("focus", "Toggle Phone", "keyboard", "n");
  RegisterCommand("mocknui", () => {
    console.log("Sending mock nui message");
    global.exports["npwd"].sendNPWDMessage("npwd_blackmarket", "setRandomData", { test: "test" });
  }, false);
})();
