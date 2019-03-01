import store from '@/store/index';
import Cookie from 'js-cookie'

export function formatDate(time) {
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

/*
* 获取当前日期,及前n天
* */
export function getBeforeDate(n) {
  let nowTime = formatDate(new Date())
  let nowMs = new Date().getTime()
  let beforeMs = nowMs - 1000 * 60 * 60 * 24 * parseInt(n)
  let beforeTime = formatDate(beforeMs)

  return {
    nowTime,
    beforeTime
  }
}

/*
* 将秒转换为时分秒，并补零
* */
function PadZero(str) {
  //补零
  return new RegExp(/^\d$/g).test(str) ? `0${str}` : str;
}
export function formatTime(_seconds) {
  _seconds = parseInt(_seconds);
  let hours, mins, seconds;
  let result = '';
  seconds = parseInt(_seconds % 60);
  mins = parseInt(_seconds % 3600 / 60)
  hours = parseInt(_seconds / 3600);
  if (hours)
    result = `${PadZero(hours)}:${PadZero(mins)}:${PadZero(seconds)}`
  else
    result = `${PadZero(mins)}:${PadZero(seconds)}`
  return result;
}
/*
* 去除文本里的HTML标签
* */
export function matchReg(str) {
  let reg = /<\/?.+?\/?>/g;
  return str.replace(reg, "");
}

// 下载
export function downLoadFile(url, fileName) {
  var oReq = new XMLHttpRequest();
      oReq.open(
        "GET",
        url,
        true
      );
      oReq.setRequestHeader("token", sessionStorage.getItem('token'));
      oReq.responseType = "blob";
      oReq.onload = function(oEvent) {
        var content = oReq.response;
        console.log(oReq);
        var elink = document.createElement("a");
        elink.download = fileName;
        elink.style.display = "none";

        var blob = new Blob([content]);
        elink.href = URL.createObjectURL(blob);

        document.body.appendChild(elink);
        elink.click();

        document.body.removeChild(elink);
      };
      oReq.send();
}

//判断文件类型
export function fileType(name){
  
  let fileType = ''
  let curType
  let index= name.lastIndexOf('.'),
      imgArr = ['jpeg','jpg','png'],
      audioArr=['mp3','wav'],
      videoArr=['mp4','avi','rmvb','wmv','mkv'],
      docArr=['pdf','txt','doc','docx','xls','xlsx','ppt','pptx'];
  if(name.includes('.')) {
    curType = name.substring(index+1,name.length).toLowerCase()
  }else{
    curType = name
  }
  console.log(curType)
    if(imgArr.find((item)=>{return curType == item})){
      fileType = "image"
    }else if(videoArr.find((item)=>{return curType == item})){
      fileType = "video"
    }else if(docArr.find((item)=>{return curType == item})){
      fileType = "doc"
    }else if(audioArr.find((item)=>{return curType == item})){
      fileType = "audio"
    }else{
      // this.$message.error('请上传受支持的资源文件')
      return false
    }

  return fileType
}
/***
 *获取文件后缀
 * */
export function fileKind(name){

  let index= name.lastIndexOf(".");

  return name.substr(index+1);
}
/*
*错误信息处理
 * 参数：后台返回的错误消息
* */
export function  getErrorMsg(res) {
  return res.split('|')[res.split('|').length-1]
}
/***
 *  解决下载图片报跨域问题,将图片地址: http,换为https
* ***/
function insert_url(url){
  return 'https' + url.substring(4)
}
