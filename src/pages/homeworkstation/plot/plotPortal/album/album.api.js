import {
  fdcJsonp,
  fdcHttp
} from 'fdc-common/http'
let plotid = sessionStorage.getItem('plotid')

export function getHousePhotoTypeList() {
  return fdcJsonp(process.env.API_ROOT_DICT, 'usmaction.inter.dict.getDictItemByDictCatCode', {
    dictCatCode: 999
  })
    .then(res => res.data)
}
// 上传图片
export function uploadImg(params) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homebaseaction.base.homeimg.upload.v1', { ...params,
    residentialInfoId: plotid
  })
}
// 获取相册内图片
export function getAlbumPic(params) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.homealbum.getimglistbyid', params)
}
// 删除相册内图片
export function deleteAlbumPic(params) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.relalbumimg.del', { ...params,
    residentialInfoId: plotid
  })
}
// 相册内添加图片
export function addPicInfo(params) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.relalbumimg.add', { ...params,
    residentialInfoId: plotid
  })
}
// 相册内图片排序
export function sortAlbumInfo(params) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.relalbumimg.sort', { ...params,
    residentialInfoId: plotid
  })
}
// 新增相册
export function addAlbum(params) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.homealbum.add', { ...params,
    residentialInfoId: plotid
  })
}
// 相册更新
export function updateAlbumInfo(params) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.homealbum.update', { ...params,
    residentialInfoId: plotid
  })
}
// 删除相册
export function deleteAlbumInfo(params) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.homealbum.delete', { ...params,
    residentialInfoId: plotid
  })
}
// 指定类型所有图片
export function getPic(params) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.homeimg.allpage', params)
    .then(res => res.data)
}
// 获取户型图
export function getHouseTypePic(params) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.housingTypeImg.show', params)
}
// 更新图片信息
export function updatePic(params) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.homeimg.update', { ...params,
    residentialInfoId: plotid
  })
}
// 根据 type 获取图片和相册列表
export function getImgListByType(params) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.homeimg.limitpage.new', params)
    .then(res => res.data)
}

// 获取相册内的图片列表
export function getAlbumList(params) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.homealbum.getimglistbyid', params)
    .then(res => res.data)
}
// 图片排序更新
export function updateImgSort(params) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.homeimg.batchupdate', { ...params,
    residentialInfoId: plotid
  })
}

// 删除图片
export function deleteImg(params) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.homeimg.delete', { ...params,
    residentialInfoId: plotid
  })
    .then((res) => {
      // console.log(res)
      if (res && Number(res.data) === 1) {
        return Promise.resolve()
      } else {
        return Promise.reject()
      }
    })
}
// 设为封面
// export function setAsCover(params) {
//   return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.homeimg.change', params)
//     .then((res) => {
//       // console.log(res)
//       if (res && Number(res.data) === 1) {
//         return Promise.resolve()
//       } else {
//         return Promise.reject()
//       }
//     })
// }
// 获取户型
export function fetchHouseType(params) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORKBASE + '/homebaseaction', 'homebaseaction.base.housingtypeinfo.getlist', params)
    .then(res => res.data)
}
// // 户型相册类型
// export function fetchAlbumData(params) {
//   return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.homealbum.getlist', params)
//     .then(res => res.data)
// }
export function getTplType(type) {
  if (type === 1 || type === 2 || type === 5 || type === 6) {
    return 0
  } else if (type === 3 || type === 4 || type === 8 || type === 9) {
    return 1
  } else if (type === 7) {
    return 2
  } else if (type === 10 || type === 10) {
    return 3
  }
}
// 上传图片
export function upLoadPic(params) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.homeimg.upload.v1', { ...params,
    residentialInfoId: plotid
  })
    .then(res => res.data)
}
