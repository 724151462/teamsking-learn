export function formatDate(time) {
  var date;
  if(time){
    if(typeof time === 'object'){
      date = time;
    }else{
      date = new Date(time).getTime();
    }
  }else{
    return null;
  }
  var newDate = new Date(date);
  var year = newDate.getFullYear();
  if(year.length == 1){
    year = "0"+year;
  }
  var month = (newDate.getMonth()+1)+"";

  if(month.length == 1){
    month = "0"+month;
  }
  var day = newDate.getDate()+"";
  if(day.length == 1){
    day = "0"+day;
  }
  var hour =  newDate.getHours()+"";
  var minute = newDate.getMinutes()+"";
  var seconds = newDate.getSeconds()+"";
  if(hour.length == 1){
    hour = "0"+hour;
  }
  if(minute.length == 1){
    minute = "0"+minute;
  }
  if(seconds.length == 1){
    seconds = "0"+seconds;
  }
  return year+"-"+month+"-"+day+" "+hour+":"+minute+":"+seconds;
}
