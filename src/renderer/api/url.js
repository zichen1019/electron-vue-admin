import request from '@/utils/request'
import qs from 'qs'

export function queryList(data) {
  return request({
    url: '/urlLib/queryList',
    method: 'get',
    params: data,
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }
  })
}

export function query(data) {
  return request({
    url: '/urlLib/query',
    method: 'get',
    params: data
  })
}

export function get(id) {
  return request({
    url: '/urlLib/get',
    method: 'get',
    params: {
      id: id
    }
  })
}

export function save(data) {
  return request({
    url: '/urlLib/save',
    method: 'post',
    data: data
  })
}

export function update(data) {
  return request({
    url: '/urlLib/update',
    method: 'put',
    data: data
  })
}

export function del(id) {
  return request({
    url: '/urlLib/delete',
    method: 'delete',
    params: {
      id: id
    }
  })
}
