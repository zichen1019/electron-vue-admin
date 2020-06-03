import request from '@/utils/request'
import qs from 'qs'

export function query(data) {
  return request({
    url: '/urlClassifyLib/query',
    method: 'get',
    params: data
  })
}

export function getAll(data) {
  return request({
    url: '/urlClassifyLib/getAll',
    method: 'get',
    params: data
  })
}

export function get(id) {
  return request({
    url: '/urlClassifyLib/get',
    method: 'get',
    params: {
      id: id
    }
  })
}

export function save(data) {
  return request({
    url: '/urlClassifyLib/save',
    method: 'post',
    data: data
  })
}

export function saveList(data) {
  return request({
    url: '/urlClassifyLib/saveList',
    method: 'post',
    data: data
  })
}

export function update(data) {
  return request({
    url: '/urlClassifyLib/update',
    method: 'put',
    data: data
  })
}

export function del(id) {
  return request({
    url: '/urlClassifyLib/delete',
    method: 'delete',
    params: {
      id: id
    }
  })
}

export function delList(id) {
  return request({
    url: '/urlClassifyLib/deleteList',
    method: 'delete',
    params: {
      ids: id
    },
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }
  })
}
