var SerialPort = require('serialport');
var Duplex = require('stream').Duplex;
var EventEmitter = require('events').EventEmitter;
var util = require('util');

function S2Serial(path, options) {
	Duplex.call(this);
	var self = this;

	// strip parser option if set.  Force default (raw)
	if (options.parser)
		options.parser = undefined;

	this._serialport = new SerialPort(path, options);

	this.wrap(this._serialport);

	this._write = function _write(buf, encoding, callback) {
		self._serialport.write(buf, function (err, res) {
			if (err) {
				callback(err);
				return;
			}
			if (res && res != buf.length) {
				callback(new Error("write error: " +
				    "wrote %d bytes, expected to write %d",
				    res, buf.length));
				return;
			}
			callback()
		});
	};

	this._serialport.on('open', function () {
		self.emit('open');
	});

	this._serialport.on('disconnect', function(err) {
		self.emit('disconnect', err);
	});

	this._serialport.on('close', function () {
		self.emit('close');
	});

	this._serialport.on('error', function(err) {
		self.emit('error', err);
	});
};
util.inherits(S2Serial, Duplex);

S2Serial.prototype.close = function(callback) {
	var self = this;
	self._serialport.close(callback);
};

S2Serial.prototype.open = function(callback) {
	var self = this;
	self._serialport.open(callback);
};

S2Serial.prototype.flush = function(callback) {
	var self = this;
	self._serialport.flush(callback);
};

S2Serial.prototype.drain = function(callback) {
	var self = this;
	self._serialport.drain(callback);
};

S2Serial.prototype.set = function(options, callback) {
	var self = this;
	self._serialport.set(options, callback);
};

S2Serial.prototype.update = function(options, callback) {
	var self = this;
	self._serialport.update(options, callback);
};

S2Serial.prototype.isOpen = function() {
	var self = this;
	return self._serialport.isOpen();
}

module.exports = {
	S2Serial: S2Serial
}
