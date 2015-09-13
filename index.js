/// <reference path="type_declarations/DefinitelyTyped/node/node.d.ts" />
var util_1 = require('util');

// Level is a mapping from level names (strings) to level values (numbers)
(function (Level) {
    Level[Level["notset"]   = 0]  = "notset";
    Level[Level["debug"]    = 10] = "debug";
    Level[Level["info"]     = 20] = "info";
    Level[Level["warning"]  = 30] = "warning";
    Level[Level["error"]    = 40] = "error";
    Level[Level["critical"] = 50] = "critical";
    Level[Level["fatal"]    = 60] = "fatal";
})(exports.Level || (exports.Level = {}));
var Level = exports.Level;

var pad = function(string, width, pad_char) {
  pad_char = pad_char || '0';
  width = width || 2;
  string = string + '';
  return string.length >= width ? string : new Array(width - string.length + 1).join(pad_char) + string;
}

/**
 * Formats a log message similar to the ruby Logger class
 *
 * @param date  [Date] the date object when this log is for
 * @param level [string] the log level as a string
 * @param msg   [string] the message to log
 */
var formatLog = function(date, level, msg) {
    var timestamp = "";
    timestamp+= date.getFullYear()+'-'
    timestamp+= pad(date.getMonth()+1, 2, 0)+'-';
    timestamp+= pad(date.getDate(), 2, 0)+' ';
    timestamp+= pad(date.getHours(), 2, 0)+':';
    timestamp+= pad(date.getMinutes(), 2, 0)+':';
    timestamp+= pad(date.getSeconds(), 2, 0)+'.';
    timestamp+= pad(date.getMilliseconds(), 3, 0);

    return util_1.format("%s, [%s] %s -- : %s\n", 
      level[0].toUpperCase(),
      timestamp,
      pad(level.toUpperCase(), 8, ' '),
      msg
    );
}

/**
 * new Logger(<Stream-like Object>, <Number|String>);
 * 
 * logger.stream: Stream-like object implementing .write(string)
 *   E.g., any stream.Writable, like `process.stderr`
 * 
 * logger._level: Number
 *   It is set via logger.level, as either a String (resolved using
 *   Logger._levels) or Number
 */
var Logger = (function () {
    function Logger(outputStream, level, formatter) {
        if (outputStream === void 0) { outputStream = process.stderr; }
        if (level === void 0)        { level = Level.notset; }

        this.outputStream = outputStream;
        this.level        = level;
        this.formatter    = formatter || formatLog;
    }

    Logger.prototype.log = function (level, args) {
        if (level >= this.level) {
            var text   = args.join(",");
            var output = this.formatter(new Date(), Level[level], text)
            this.outputStream.write(output);
        }
    };

    Logger.prototype.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return this.log(Level.debug, args);
    };

    Logger.prototype.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return this.log(Level.info, args);
    };

    Logger.prototype.warning = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return this.log(Level.warning, args);
    };

    Logger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return this.log(Level.error, args);
    };

    Logger.prototype.critical = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return this.log(Level.critical, args);
    };

    Logger.prototype.fatal = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return this.log(Level.fatal, args);
    };

    return Logger;
})();


exports.Logger = Logger;
exports.logger = new Logger();


/**
 * Creates and returns a new Logger object
 *
 * @param outputStream [stream]   stream like object implementing .write(string) any stream.Writable, like `process.stderr`
 * @param level        [string]   the level to log at ("debug", "fatal")
 * @param formatter    [function] a formatter function taking date, level, and text arguments
 */
exports.create = function(stream, level, formatter) {
    if ( typeof(level) == "function" ) {
        formatter = level;
        level = "notset";
    }

    level = level || "notset";

    return new Logger(stream, Level[level], formatter);
};

