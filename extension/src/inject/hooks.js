//Think of modules as a factory that is responsible for managing functions,
//in that you can store them, call them whenever, and have other functions
//trigger them.

var modules, hooks = {};

//Whenever background.js sends a message, it'll send back a request object.
chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        modules.trigger(request.action, {
            data: request.data,
            err: request.err
        });
    });

modules = {
    // Pass along data from client to background.
    send: function(args) {
        chrome.runtime.sendMessage({
            action: args.action,
            method: args.method,
            args: args.args
        });
    },
    // Register a function to be triggered under a string alias.
    on: function(eventName, fn) {
        if (hooks[eventName]) {
            hooks[eventName].push(fn)
        } else {
            hooks[eventName] = [fn]
        }
    },
    // Trigger a function registered via the on function.
    trigger: function(eventName, data) {
        console.log('triggering', eventName, hooks);
        if (hooks[eventName]) {
            hooks[eventName].forEach(function(fn) {
                fn(data);
            });
        } else {
            console.log('no hook')
        }
    }
}
