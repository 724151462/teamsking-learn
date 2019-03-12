import {commonsAjax} from '../utils/requery'

/***************
 **数据统计模块**
/**
 * 课后数据
 */
export function afterOther(data) {
  return commonsAjax(`/study/classafter/other`, data, 'post')
}
/**
 * 学习度
 */
export function leanRate(data) {
  return commonsAjax(`/study/classafter/page`, data, 'post')
}

/**
 * 学习时间段
 */
export function timeBucketOther(data) {
  return commonsAjax(`/study/classafter`, data, 'post')
}

/**
 * 课堂行为
 */
export function classBehavior(data) {
  return commonsAjax(`/study/classbehavior/page`, data, 'post')
}
/**
 * 学情质量
 */
export function studyAnalysis(data) {
  return commonsAjax(`/course/classquality/page`, data, 'post')
}

