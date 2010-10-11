(function (root) {

	var reflow = function () {
			this._count = 0;
			this._data = {};
			this._concurrency = num;
		},


		reflowProto = reflow.prototype,


		isArray = Array.isArray || function(obj) {
			return !!(obj && obj.concat && obj.unshift && !obj.callee);
		};



	reflowProto.wait = function (fn) {
		this._count++;
		var self = this;
		return function () {
			self._count--;
			fn && fn.apply(self, arguments);
			self.ifComplete();
		};
	};

	reflowProto.concurrency = function (num) {
		this._concurrency = num;
		return this;
	};

	reflowProto.accumulate = function (key) {
		return this.wait(function (obj) {
			var data = this._data;

			if (!key) {
				data = this;
				key = "_data";
			}

			if (!isArray(data[key])) {
				var tmp = data[key];
				data[key] = [];
				if (tmp !== undefined) {
					data[key].push(tmp);
				}
			}

			data[key].push(obj);
		});
	};

	reflowProto.grab = function (key) {
		return this.wait(function (obj) {
			this._data[key] = obj;
		});
	};

	reflowProto.getData = function () {
		return this._data;
	};

	reflowProto.ifComplete = function () {
		if (this._count == 0 && this._complete) {
			this._complete(this._data);
		}
	};

	reflowProto.then = function (fn) {
		this._complete = fn;
		this.ifComplete();
		return this;
	};

	reflowProto.exec = function () {
		var args = Array.prototype.slice.call(arguments, 0),
			i = 0, l = args.length;

		for (; l > i; ++i) {
			args[i].call(this);
		}
		return this;
	};

	reflowProto.seq = function () {

	};

	root.reflow = this;


}(this));
