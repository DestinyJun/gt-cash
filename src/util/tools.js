export function reset_form (obj) {
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      obj[prop] = null
    }
  }
  return obj
}
export function clone_obj (obj) {
  const cloneA = {}
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      cloneA[prop] = obj[prop]
    }
  }
  return cloneA
}

/**
 *
 * @param objA Object 需要赋值的对象
 * @param objB Object 被复制的对象
 * @returns {*}
 */
export function clone_copy (objA,objB) {
  for (const prop in objB) {
    if (objB.hasOwnProperty(prop)) {
      objA[prop] = objB[prop]
    }
  }
}
