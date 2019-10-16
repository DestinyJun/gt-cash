/**
 *
 * @param obj 需要置空的对象
 * @returns {*}
 */
export function reset_form (obj) {
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      obj[prop] = null
    }
  }
  return obj
}

/**
 * @param obj 需要clone对象
*/
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

/**
 *
 * @param objA Object  被复制的对象
 * @param objB Object  需要赋值的对象
 */
export function clone_copy_a (objA,objB) {
  for (const prop in objB) {
    if (objB.hasOwnProperty(prop)) {
      objB[prop] = objA[prop]
    }
  }
}

/**
 * @param serverName  服务区名称
 * @param merchantName  店铺名称
 * @param orderNum  账单编号
 * @param num  排队号
 * @param arr 商品信息
 * @param userName 收款人
 * @param payTime  收款时间
 * @param sum  总金额
 */
export function print (serverName,merchantName,orderNum,num,arr,userName,payTime,sum) {
  let goods = '';
  arr.map((item) => {
    goods += `
      <div style="display: flex">
        <span style="flex: 3">${item.goodsName}</span>
        <span style="margin-left: 15px;margin-right: 15px;flex: 1">x${item.number}</span>
        <span style="flex: 1">${item.unitPrice}</span>
      </div>
    `
  });
 let str = `
   <!DOCTYPE html>
   <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>小票打印</title>
        <style type="text/css" media="print">
        body {
          margin-top: 0;
          margin-bottom: 20px;
          margin-left: 3px;
          margin-right: 3px;
        }
        @page {
          margin: 0;
        }
        .page1{
          width: 100%;
          height: auto;
          font-size: 10px;
        }
      </style>
      </head>
      <body>
        <div class="page1">
          <div style="border-top: 1px dashed red"></div>
          <h5>${serverName}</h5>
          <p>商家：${merchantName}</p>
          <p>账单号：${orderNum}</p>
          <p style="display: ${num?'inline-block':'none'}">排队号：${num}</p>
          <div style="border-top: 1px dashed red"></div>
            ${goods}
          <div style="border-top: 1px dashed red"></div>
          <p>收银人：${userName}</p>
          <p>时间：${payTime}</p>
          <p>合计：${sum}元</p>
          <div style="border-top: 1px dashed red"></div>
        </div>
      </body>
    </html>
  `;
   return str;
}
