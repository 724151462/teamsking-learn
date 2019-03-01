
import lazyLoading from './lazyLoading'
const _import = require('@/router/_import_' + process.env.NODE_ENV)
export default (routers,data) => {
  //这里之所以要重新遍历一下，是因为，通常我们动态路由的时候，是获取服务端数据，这个component属性是一个字符串，或者可能连字段名都是其他的key
  //所以这里要做一些转换
  console.log(data)
  generaMenu(routers,data)
}
function generaMenu(routers,data){
  console.log(data)
  data.forEach((item)=>{
    console.log(item)
    let menu = Object.assign({},item)
    menu.component = _import(menu.component)
    // menu.children = menu.list
    if(item.list == null) {
      console.log(menu)
    }else{
      generaMenu(menu.list,item.list)
      // console.log(menu)
    }
    // routers.push(menu)
  })
  
}