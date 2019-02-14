import store from '@/store/index';

export function formatDate (time) {
  let date
  if (time) {
    if (typeof time === 'object') {
      date = time
    } else {
      date = new Date(time).getTime()
    }
  } else {
    return null
  }
  let newDate = new Date(date)
  let year = newDate.getFullYear()
  if (Number(year.length) === 1) {
    year = '0' + year
  }
  let month = (newDate.getMonth() + 1) + ''

  if (Number(month.length) === 1) {
    month = '0' + month
  }
  let day = newDate.getDate() + ''
  if (Number(day.length) === 1) {
    day = '0' + day
  }
  let hour = newDate.getHours() + ''
  let minute = newDate.getMinutes() + ''
  let seconds = newDate.getSeconds() + ''
  if (Number(hour.length) === 1) {
    hour = '0' + hour
  }
  if (Number(minute.length) === 1) {
    minute = '0' + minute
  }
  if (Number(seconds.length) === 1) {
    seconds = '0' + seconds
  }
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + seconds
}

export function connect(resolve,reject){
    let socket = new SockJS('http://120.36.137.90:9008/websocket'),
        token = sessionStorage.getItem('token'),
        userId = sessionStorage.getItem('userId'),
        courseId = sessionStorage.getItem('courseId');
    let stompClient = Stomp.over(socket);
    console.log(this)

  stompClient.connect({'token': token,'courseId':courseId}, function (frame) {
        stompClient.subscribe('/teamsking/helloWorld', function (result) {
          console.log(result);
        },{'token': token});
        stompClient.subscribe('/user/' + userId + '/teamsking/classroom',function(result){
          console.log(result);
        });
      // this.$store.commit('SAVE_CLASSROME',res.data.classroomId)
      resolve('连接成功');
      },
      function errorCallBack (error) {
        // 连接失败时（服务器响应 ERROR 帧）的回调方法
        reject('连接失败');
      }
    )
  console.log(this)

}

export function sign(resolve,reject) {
    let tagClient = this.STOMP_CLIENT,
        token = sessionStorage.getItem('token'),
        userId = sessionStorage.getItem('userId'),
        courseId = sessionStorage.getItem('courseId'),
        classroomId = sessionStorage.getItem('classroom');

  tagClient.send('/teamsking/course/sign/start',{'token': token},
        JSON.stringify({
          "classroomId":1,
          "courseId":classroomId,
          "userId":userId
        })
  );
}

export function signClose(resolve,reject) {
  let tagClient = this.STOMP_CLIENT,
      token = sessionStorage.getItem('token'),
      userId = sessionStorage.getItem('userId'),
      courseId = sessionStorage.getItem('courseId'),
      classroomId = sessionStorage.getItem('classroom');
  tagClient.send('/teamsking/course/sign/close',{'token': token},
    JSON.stringify({
      "classroomId":classroomId,
      "courseId":courseId,
      "userId":userId
    })
  );
}

// 去富文本HTML标签
export function matchReg(str) {
  let reg = /<\/?.+?\/?>/g;
  return str.replace(reg, "");
}