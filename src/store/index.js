import Vue from 'vue'
import Vuex from 'vuex'
import navHeader from './modules/navHeader'
import socket from './modules/socket'
import { stat } from 'fs';
import Cookie from 'js-cookie'

Vue.use(Vuex)
const state = {
  navHeader: navHeader.state.nav,
  allMenu: [],
  filterMenu: [],
  topNavState: 'course',
  leftNavState: 'course' ,
  modelActive: Cookie.get('modelActive') || "1",
  beginDrag:{
    type: '',
    id:''
  }, //当前被拖拽对象的信息
}

const mutations = {
  setNav: (state,target)=> {
    state.navHeader = target
  },
  setAllMenu: (state, list)=> {
    // console.log('rwq', list)
    list.forEach(element => {
      state.allMenu.push(element)
    });
  },
  SAVE_DRAG:(state, data)=>{
    state.beginDrag.type = data.type
    state.beginDrag.id = data.id
  }
}

const getters = {
  currentMenu: (state)=> {
    for (let index = 0; index < state.allMenu.length; index++) {
      // console.log(132, state.allMenu[index].list)
      if(state.allMenu[index].list){
        for (let i = 0; i < state.allMenu[index].list.length; i++) {
          // console.log(444, state.allMenu[index].list[i].name)
          // console.log(state.navHeader)
          if(state.allMenu[index].list[i].name === state.navHeader) {
            console.log('filterlist', state.allMenu[index].list)
            return state.allMenu[index].list
          }
        }
      }
    }
    // state.filterMenu = state.allMenu.filter(element => {
    //   element.list
    // });
  }
}

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions: {

  },
  modules: {
    socket
  }
})
