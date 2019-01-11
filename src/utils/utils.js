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
        token = store.state.socket.token,
        userId = store.state.socket.userId,
        courseId = store.state.socket.courseId;
    let stompClient = Stomp.over(socket);
    stompClient.connect({'token': token,'courseId':courseId}, function (frame) {
        store.commit('NEW_SOCKET',stompClient)
        stompClient.subscribe('/teamsking/helloWorld', function (result) {
          console.log(result);
        },{'token': token});
        stompClient.subscribe('/user/' + userId + '/teamsking/classroom',function(result){
          console.log(result);
        });
        resolve('连接失败');
      },
      function errorCallBack (error) {
        // 连接失败时（服务器响应 ERROR 帧）的回调方法
        reject('连接失败');
      }
    )
}

export function sign(resolve,reject) {
    let tagClient = store.state.socket.stompClient,
        token = store.state.socket.token,
        userId = store.state.socket.userId,
      classroomId = store.state.socket.classroomId,
        courseId = store.state.socket.courseId;
        console.log(store.state.socket.stompClient)
      tagClient.send('/teamsking/course/sign/start',{'token': token},
        JSON.stringify({
          "classroomId":1,
          "courseId":classroomId,
          "userId":userId
        })
  );
}

export function signClose(resolve,reject) {
  let tagClient = store.state.socket.stompClient,
    token = store.state.socket.token,
    userId = store.state.socket.userId,
    classroomId = store.state.socket.classroomId,
    courseId = store.state.socket.courseId;

  tagClient.send('/teamsking/course/sign/close',{'token': token},
    JSON.stringify({
      "bean":50,
      "classroomId":1,
      "courseId":classroomId,
      "userId":userId
    })
  );
}

