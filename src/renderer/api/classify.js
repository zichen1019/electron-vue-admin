import request from '@/utils/request'

export function getAll(data) {
  return request({
    url: '/classify/getAll',
    method: 'get',
    params: data
  })
}

export function get(id) {
  return request({
    url: '/classify/get',
    method: 'get',
    params: {
      id: id
    }
  })
}

export function save(data) {
  return request({
    url: '/classify/save',
    method: 'post',
    data: data
  })
}

export function update(data) {
  return request({
    url: '/classify/update',
    method: 'put',
    data: data
  })
}

export function del(id) {
  return request({
    url: '/classify/delete',
    method: 'delete',
    params: {
      id: id
    }
  })
}
