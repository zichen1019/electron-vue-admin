import request from '@/utils/request'

export function getTodo(data) {
  return request({
    url: '/todo/get',
    method: 'get',
    params: data
  })
}

export function getInfoTodo(id) {
  return request({
    url: '/todo/getinfo',
    method: 'get',
    params: {
      id: id
    }
  })
}

export function saveTodo(data) {
  return request({
    url: '/todo/save',
    method: 'post',
    data: data
  })
}

export function updateTodo(data) {
  return request({
    url: '/todo/update',
    method: 'put',
    data: data
  })
}

export function deleteTodo(id) {
  return request({
    url: '/todo/delete',
    method: 'delete',
    params: {
      id: id
    }
  })
}
