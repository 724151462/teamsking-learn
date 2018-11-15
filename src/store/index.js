import Vue from 'vue'
import Vuex from 'vuex'
import {sysCollegeList} from '@/api/school'

Vue.use(Vuex)

const state = {
  collegeList: []
}

export default new Vuex.Store({
  state,
  mutations: {
    getCollegeList(state) {
      sysCollegeList()
      .then((response)=>{
          if (response.code === 200){
              let all = {"collegeId": -1, "collegeName": "全部"}
            // this.collegeList.unshift(all)
              state.collegeList = response.data
              state.collegeList.unshift(all)
          }
      })
    }
  },
  actions: {

  }
})
