/**
 * webworker.jsx
 *
 * WebWorker API wrapper. This Wrapper is designed for worker sides.
 * Caller side should use js/web.jsx in stdard library.
 *
 * @author Yoshiki Shibukawa
 *
 * @see http://github.com/shibukawa/
 *
 * License: MIT
 */


import "js/web.jsx";

/**
 * This class is a instance of DedicatedWorkerGlobalScope, SharedWorkerGlobalScope.
 */
native final class self {
    static function postMessage(message : variant/*any*/) : void;
    static function postMessage(message : variant/*any*/, transfer : Transferable[]) : void;
    static function close() : void;

    static const location : WorkerLocation;
    // only for SharedWorker
    static const name : Nullable.<string>/*DOMString*/;
    static const applicationCache : Nullable.<ApplicationCache>;

    // implements WorkerUtils

    static function importScripts(...urls : string/*DOMString...*/) : void;
    static const navigator : WorkerNavigator;

    /** @see http://www.w3.org/TR/2013/WD-IndexedDB-20130516/ */
    __readonly__ var indexedDB : IDBFactory;

    // implements IDBEnvironmentSync

    /** @see http://www.w3.org/TR/2013/WD-IndexedDB-20130516/ */
    __readonly__ var indexedDBSync : IDBFactorySync;

    // implements WindowBase64
    static function btoa(btoa : string/*DOMString*/) : string/*DOMString*/;
    static function atob(atob : string/*DOMString*/) : string/*DOMString*/;

    // implements WindowTimer
    static function setTimeout(callback : function():void, intervalMS : number) : TimerHandle;
    static function clearTimeout(timer : TimerHandle) : void;
    static function setInterval(callback : function():void, intervalMS : number) : TimerHandle;
    static function clearInterval(timer : TimerHandle) : void;
} = '''self''';

/**
 * Implementation-defined object which setTimeout() and setInterval() return.
 */
final class TimerHandle {
    delete function constructor();
}

/*
 * Expected code

class _Main
{
    static function main (argv : string[]) : void {};
    static function onmessage (event : MessageEvent) : void {};
}*/

