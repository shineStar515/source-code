/**
 * 
 * @param {Promise} promise 
 * @param {Object} errorExt 
 * @returns {Promise}
 */
// await-to-js源码
/*接收一个Promise对象和错误提示对象
  通过then或catch获取结果，返回一个数组
  如果有错误提示对象，对两个错误提示合并为一个对象
*/
function to(promise, errorExt) {
  return promise
      .then(function (data) { 
        return [null, data]; })
      .catch(function (err) {
      if (errorExt) {
        const parsedError = Object.assign( {},err, errorExt);
        return [parsedError, undefined];
      }
      return [err, undefined];
  });
}
const getuser = new Promise((resolve, reject) => {
  
  reject({a:"错误信息1"})
  resolve("666")
})
async function testTo(){
  const [error,data] = await to(getuser,{b:"错误信息2"})
  // 没有错误则error为null，data为undefined
  // console.log("错误信息",error);
  // console.log("正确信息",data);
  if(error){
      console.log(error)
  }
  if(data){
      console.log(data)
  }
}
testTo()