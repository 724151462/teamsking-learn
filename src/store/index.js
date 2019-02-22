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
  leftNavState: '璇剧▼涓績' ,
  modelActive: Cookie.get('modelActive') || "1",
  msgNum:0,
  isFullScreen:false,
  userAvatar:require('@/assets/images/user.png')
}

const mutations = {
  setAllMenu: (state, list)=> {
    // console.log('rwq', list)
    list.forEach(element => {
      state.allMenu.push(element)
    });
  },
  //修改未读消息
  MSG_READY:(state, data)=>{
    state.msgNum = state.msgNum - Number(data)
  },
  SET_MSG:(state, data)=>{
    state.msgNum = Number(data)
  },
  //修改用户头像
  CHANGE_AVATAR:(state, data)=>{
    state.userAvatar = data
  },
  //全屏
  SET_FULLSCREEN(state, data){
    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();

      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();

      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      }
      state.isFullScreen = true
      // console.log('全屏')
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      state.isFullScreen = false
      // console.log('退出全屏')
    }
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
