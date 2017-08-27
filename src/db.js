/*  header-comment
/*  author : arida
/*  date   : 2017-6-4 18:25:51
/*  last   : 2017-8-4 12:43:25
*/
/** 目前采用的存储层为localstorage
 *  将来如果有其他复杂计算，可以考虑使用缓存或者更换存储层
 * @class 前端数据缓存
 * 
 */
import moment from "moment";
import type from "./type";

const SEPRATOR = "::";
const constructorMap = {
  string: value => "" + value,
  boolean: value => value === "true",
  number: value => 0 + value,
  array: value => new Array(value),
  date: value => new Date(value),
  moment: value => moment(value)
};
function arrayConstructor(object) {
  const ret = [];
  if (!object) return ret;
  if (!Object.keys(object).length) return ret;
  const key = Object.keys(object)[0];
  ret[key] = object[key];
  return ret;
}
/**
 * {a: Number(1), b: {c:'3'}} -> 
 * { a::number: 1, b::object: {c::string: 3} }
 * @param {Object} object
 * @return {Object} 
 */
function putReference(payload) {
  const ret = type(payload) === "object" ? {} : {};
  for (const key in payload) {
    const item = payload[key];
    const _type = type(item);
    if (_type === "object" || _type === "array") {
      ret[`${key}${SEPRATOR}${_type}`] = putReference(item);
    } else {
      ret[`${key}${SEPRATOR}${_type}`] = item;
    }
  }
  return ret;
}
/**
 * { a::number: 1, b::object: {c::string: 3} } -> 
 * {a: Number(1), b: {c:'3'}}
 * @param {Object} object
 * @return {Object} 
 */
function takeReference(payload) {
  const ret = type(payload) === "object" ? {} : [];
  for (const key in payload) {
    const item = payload[key];
    const _type = type(item);
    const realKey = key.split(SEPRATOR)[0];
    const realType = key.split(SEPRATOR)[1];
    if (realType === "object") {
      ret[realKey] = takeReference(item);
    } else if (realType === "array") {
      ret[realKey] = ret[realKey] || [];

      ret[realKey] = arrayConstructor(takeReference(item));
    } else if (constructorMap[realType]) {
      ret[realKey] = constructorMap[realType](item);
    }
  }

  return ret;
}
module.exports = {
  /**
     * @method db.get
     * @param {string} key 
     */
  get(key) {
    let ret;
    ["boolean", "number", "string", "date"].forEach(ele => {
      const value = window.localStorage.getItem(`${key}${SEPRATOR}${ele}`);
      if (value) {
        ret = constructorMap[ele](value);
      }
    });
    if (!ret) {
      // array ?
      const result = window.localStorage.getItem(`${key}${SEPRATOR}object`);
      if (result) {
        ret = takeReference(JSON.parse(result));
      } else {
        ret = null;
      }
    }
    return ret;
  },
  /**
     * @method db.set
     * @param {string} key 
     * @param {any} value 
     */
  set(key, value) {
    const _type = type(value);
    let ultimateValue = value;
    if (_type === "array" || _type === "object") {
      ultimateValue = JSON.stringify(putReference(value));
    }

    window.localStorage.setItem(`${key}${SEPRATOR}${_type}`, ultimateValue);
    return true;
  },
  clear() {
    localStorage.clear();
  },
  remove(key) {
    const _type = type(value);
    localStorage.removeItem(`${key}${SEPRATOR}${_type}`);
  }
};
