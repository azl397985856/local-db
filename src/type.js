import moment from "moment";

export default function type(obj) {
  var refrenceType = {};
  "Boolean Number String Function Array Date RegExp Object Error"
    .split(" ")
    .forEach(function(e) {
      refrenceType["[object " + e + "]"] = e.toLowerCase();
    });
  //当然为了兼容IE低版本，forEach需要一个polyfill，不作细谈了。
  function _typeof(obj) {
    if (obj === null) {
      return String(obj);
    }
    return typeof obj === "object" || typeof obj === "function"
      ? refrenceType[refrenceType.toString.call(obj)] || "object"
      : typeof obj;
  }
  if (moment.isMoment(obj)) return "moment";
  return _typeof(obj);
}
