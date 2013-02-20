import "js.jsx";

native __fake__ class _sqlite3database
{
    static const OK = 0;
    static const ERROR = 1;
    static const INTERNAL = 2;
    static const PERM = 3;
    static const ABORT = 4;
    static const BUSY = 5;
    static const LOCKED = 6;
    static const NOMEM = 7;
    static const READONLY = 8;
    static const INTERRUPT = 9;
    static const IOERR = 10;
    static const CORRUPT = 11;
    static const NOTFOUND = 12;
    static const FULL = 13;
    static const CANTOPEN = 14;
    static const PROTOCOL = 15;
    static const EMPTY = 16;
    static const SCHEMA = 17;
    static const TOOBIG = 18;
    static const CONSTRAINT = 19;
    static const MISMATCH = 20;
    static const MISUSE = 21;
    static const NOLFS = 22;
    static const AUTH = 23;
    static const FORMAT = 24;
    static const RANGE = 25;

    function run(...params : variant) : void;
    function all(...params : variant) : void;
    function each(...params : variant) : void;
    function close(...params : variant) : void;
    function serialize(...params : variant) : void;
}

native __fake__ class _sqlite3statement
{
}

native __fake__ class _sqlite3error
{
    var message : string;
    var errno : int;
    var code : string;
}

class SQLite3Database
{
    var _instance : _sqlite3database;

    function constructor (filename : string)
    {
        var exp = "(function () { var __sqlite3 = require('sqlite3'); return new __sqlite3.Database('" + filename + "');})()";
        this._instance = js.eval(exp) as __noconvert__ _sqlite3database;
    }

    function run (sql : string) : SQLite3Database
    {
        this._instance.run(sql);
        return this;
    }

    function run (sql : string, bind : variant) : SQLite3Database
    {
        this._instance.run(sql, bind);
        return this;
    }

    function run (sql : string, bind : variant, callback : (Nullable.<_sqlite3error>) -> void) : SQLite3Database
    {
        this._instance.run(sql, bind, callback);
        return this;
    }

    function run (sql : string, callback : (Nullable.<_sqlite3error>) -> void) : SQLite3Database
    {
        this._instance.run(sql, callback);
        return this;
    }

    function each (sql : string, callback : (Nullable.<_sqlite3error>, variant) -> void) : SQLite3Database
    {
        this._instance.each(sql, callback);
        return this;
    }

    function all (sql : string, callback : (Nullable.<_sqlite3error>, variant[]) -> void) : SQLite3Database
    {
        this._instance.all(sql, callback);
        return this;
    }

    function serialize () : void
    {
        this._instance.serialize();
    }

    function serialize (callback : (Nullable.<_sqlite3error>) -> void) : void
    {
        this._instance.serialize(callback);
    }

    function close () : void
    {
        this._instance.close();
    }

    function close (callback : (Nullable.<_sqlite3error>) -> void) : void
    {
        this._instance.close(callback);
    }
}
