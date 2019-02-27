
import lazyLoading from './lazyLoading'
export default (routers,data) => {
  //这里之所以要重新遍历一下，是因为，通常我们动态路由的时候，是获取服务端数据，这个component属性是一个字符串，或者可能连字段名都是其他的key
  //所以这里要做一些转换
  generaMenu(routers,data)
}
function generaMenu(routers,data){
  console.log(data)
  data.forEach((item)=>{
    console.log(item)
    let menu = Object.assign({},item)
    menu.component = lazyLoading(menu.comment)
    // 没有叶子节点
    if(!item.leaf){
      menu.children = []
      generaMenu(menu.children,item.children)
    }
    routers.push(menu)
    console.log(routers)
  })
}