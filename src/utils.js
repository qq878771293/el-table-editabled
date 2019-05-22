const toString = Object.prototype.toString
import Vue from 'vue'

export const isNumber = function (val) {
  let isNumberRes = true

  if (Number.isNaN(val)) {
    isNumberRes = false
  } else if (typeof val !== 'number') {
    isNumberRes = false
  }

  return isNumberRes
}

export const isEmpty = (target) => {
  if (isUndefined(target) || isNull(target)) {
    return true
  } else if (isString(target)) {
    return target.trim().length === 0
  } else if (isObject(target)) {
    return Object.keys(target).length === 0
  } else if (isArray(target)) {
    return target.length === 0
  }
  return false
}

export const getEmptyArray = function () {
  return []
}

export const getEmptyObject = function () {
  return {}
}

export const isUndefined = (target) => {
  return toString.call(target) === '[object Undefined]'
}

export const isNull = (target) => {
  return toString.call(target) === '[object Null]'
}

export const isString = (target) => {
  return toString.call(target) === '[object String]'
}

export const isObject = (target) => {
  return toString.call(target) === '[object Object]'
}

export const deepCopy = (data) => JSON.parse(JSON.stringify(data))

export const observable = Vue.observable ? Vue.observable : (target) => new Vue({data: target})
