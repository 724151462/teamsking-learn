export default {
  state:{
    isConnect:false,
    stompClient : '',
    token : '',
    courseId:'',
    userId:'1',
},
  getters:{},
  mutations:{
    SAVE_INFO:(state, data)=>{
      state.userId = data.userId
      state.token = data.token
      state.courseId = data.courseId
    },
    NEW_SOCKET:(state,data)=>{
      // console.log('get Target ', data)
      state.stompClient = data
      console.log('vuex中',state.stompClient)
    }
  },
  actions:{
    GET_SOCKET:()=>{

    }
  }
}