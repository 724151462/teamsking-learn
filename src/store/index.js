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
  leftNavState: '璇剧▼涓績' ,
  modelActive: Cookie.get('modelActive') || "1",
  msgNum:0,
  isFullScreen:false,
  userAvatar:require('@/assets/images/user.png')
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
