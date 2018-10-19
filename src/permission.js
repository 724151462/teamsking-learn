import router from './router/'
router.beforeEach((to, from, next) =>{
  console.log('/' + to.matched[0].meta.address)
/*
  console.log(from)
  console.log(next)
*/
  next()
})
