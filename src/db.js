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
/**
 * {a: Number(1), b: {c:'3'}} -> 
 * { a::number: 1, b::object: {c::string: 3} }
 * @param {Object} object
 * @return {Object} 
 */
function putObject(object) {
  const ret = {};
  for (const key in object) {
    const _type = type(object[key]);
    if (_type === "object") {
      ret[`${key}${SEPRATOR}${_type}`] = putObject(object[key]);
    } else {
      ret[`${key}${SEPRATOR}${_type}`] = object[key];
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
function takeObject(object) {
  const ret = {};
  for (const key in object) {
    const _type = type(object[key]);
    const realKey = key.split(SEPRATOR)[0];
    const realType = key.split(SEPRATOR)[1];
    if (_type === "object") {
      ret[realKey] = takeObject(object[key]);
    } else {
      ret[realKey] = constructorMap[realType](object[key]);
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
    ["boolean", "number", "string", "array", "date"].forEach(ele => {
      const value = window.localStorage.getItem(`${key}${SEPRATOR}${ele}`);
      if (value) {
        ret = constructorMap[ele](value);
      }
    });
    if (!ret) {
      const result = window.localStorage.getItem(`${key}${SEPRATOR}object`);
      if (result) {
        ret = takeObject(JSON.parse(result));
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
    window.localStorage.setItem(
      `${key}${SEPRATOR}${_type}`,
      _type === "object" ? JSON.stringify(putObject(value)) : value
    );
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
