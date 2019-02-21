const devUrl = '/api/v1/study/' // 开发环境
const prodUrl = 'http://120.36.137.90:9008/api/v1/study/' // 生产环境
const baseUrl = process.env.NODE_ENV === 'production' ? prodUrl : devUrl

const courseDev = '/api/v1/course/' // 开发环境
const courseProd = 'http://120.36.137.90:9008/api/v1/course/' // 生产环境
const courseUrl = process.env.NODE_ENV === 'production' ? courseProd : courseDev
import {
  commonsAjax
} from '../utils/requery'

/***************
 **数据统计模块**
/**
 * 课后数据
 */
export function afterOther(data) {
  return commonsAjax(`${baseUrl}classafter/other`, data, 'post')
}
/**
 * 学习度
 */
export function leanRate(data) {
  return commonsAjax(`${baseUrl}classafter/page`, data, 'post')
}

/**
 * 学习时间段
 */
export function timeBucketOther(data) {
  return commonsAjax(`${baseUrl}classafter`, data, 'post')
}

/**
 * 课堂行为
 */
export function classBehavior(data) {
  return commonsAjax(`${baseUrl}classbehavior/page`, data, 'post')
}
/**
 * 学情质量
 */
export function studyAnalysis(data) {
  return commonsAjax(`${courseUrl}classquality/page`, data, 'post')
}

