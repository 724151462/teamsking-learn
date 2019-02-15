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

//获取当前日期,及前n天
export function getBeforeDate(n) {
    let nowTime = formatDate(new Date())
    let nowMs = new Date().getTime()
    let beforeMs =  nowMs -  1000 * 60 * 60 * 24 * parseInt(n)
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
