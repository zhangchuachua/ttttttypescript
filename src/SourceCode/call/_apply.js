Function.prototype._apply = function (thisArg, args) {
  let _this;
  if (thisArg === null || thisArg === undefined) {
    _this = typeof window === 'undefined' ? global : window;
  } else {
    _this = Object(thisArg);
  }
  if(args === undefined || args === null) return this._call(thisArg);
  if (typeof args !== 'object') throw new TypeError('args is a original data type!')
};
