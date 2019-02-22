import Vue from 'vue'
import Vuex from 'vuex'
import socket from './modules/socket'
import { stat } from 'fs';
import Cookie from 'js-cookie'

Vue.use(Vuex)
const state = {
  allMenu: [],
  filterMenu: [],
  topNavState: 'course',
  leftNavState: '课程中心' ,
  modelActive: Cookie.get('modelActive') || "1",
  msgNum:0
}

const mutations = {
  setAllMenu: (state, list)=> {
    // console.log('rwq', list)
    list.forEach(element => {
      state.allMenu.push(element)
    });
  },
  MSG_READY:(state, data)=>{
    state.msgNum = state.msgNum - Number(data)
  },
  SET_MSG:(state, data)=>{
    state.msgNum = Number(data)
  }
}

const getters = {
  currentMenu: (state)=> {
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
