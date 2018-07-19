function PromiseTest(fn) {
	const self = this;

	this.promiseQueue = [];
	this.fn = fn;
	this._resolve = function (result) {
		self.promiseQueue.forEach((promise) => {
			const a = promise.fn(result);

			try {
				promise._resolve(a);
			} catch(err) {
				promise._reject(err);
			}
		});
	};
	this._reject = function (error) {

		self.promiseQueue.forEach((promise) => {

			promise._reject(error);
		});
	};

	fn(this._resolve, this._reject);
};

PromiseTest.prototype = {
	then: function (onResolve, onReject) {
		const nextPromise = new PromiseTest(onResolve);

		this.promiseQueue.push(nextPromise);

		return nextPromise;
	},
	catch: function (onReject) {
		const nextPromise = new PromiseTest(() => true, onReject);

		this.promiseQueue.push(nextPromise);

		return nextPromise;
	}
};

const a = new PromiseTest(function (res, rej) {
	setTimeout(() => {
		rej(1000);
	}, 3000);
});

a.then(function (data) {
	return data;
}).then(function (data) {
	return data;
}).then(function (data) {
	return data;
}).catch((err) => {
	console.warn(err);
});



