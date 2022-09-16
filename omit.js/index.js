/**
 * 
 * @param {Object} obj 
 * @param {Array} fields 
 * @returns {Object}
 */
//omit接收一个对象和一个需要删除的对象键值的数组
//在调用时首通过Object.assign()深度克隆传进来的对象
//然后对数组进行遍历，删除对应的值，返回删除完的对象
function omit(obj, fields) {
  const shallowCopy = Object.assign({}, obj);
  for (let i = 0; i < fields.length; i++) {
    const key = fields[i];
    delete shallowCopy[key];
  }
  return shallowCopy;
}
const res = omit({ name: 'Benjy', age: 18 }, ['name'] );
console.log(res);