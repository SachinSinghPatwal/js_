/**
 * executeCallbackRegistry.js
 *
 * A module-level registry that holds the imperative "execute code" callback
 * registered by CodeEditor. Functions cannot be stored in Redux state, so
 * this thin registry acts as the bridge between CodeEditor (which owns the
 * editor instance) and the Redux async thunk that needs to trigger execution.
 */

let _executeCallback = null;

export function setExecuteCallback(cb) {
  _executeCallback = cb;
}

export async function invokeExecuteCallback() {
  if (_executeCallback) {
    await _executeCallback();
  }
}
