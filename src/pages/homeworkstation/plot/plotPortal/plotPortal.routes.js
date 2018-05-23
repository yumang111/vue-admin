import plotPortal from './plotPortal'
import albumRoutes from './album/album.routes.js'
import installmentRoutes from './installment/installment.routes.js'
import baseInfoRoutes from './baseInfo/baseInfo.routes.js'
import houseTypeRoutes from './houseType/houseType.routes.js'
import openHouseRoutes from './openHouse/openHouse.routes.js'
import buildingInfoRoutes from './buildingInfo/buildingInfo.routes.js'
import sandTableFigureRoutes from './sandTableFigure/sandTableFigure.routes.js'
import addAlbumRoutes from './addAlbum/addAlbum.router'
import checkAlbumRoutes from './checkAlbum/checkAlbum.router'
import addHouseTypeRoutes from './addHouseType/addHouseType.routes'
import aroundRoutes from './around/around.routes'
import dynamicRoutes from './dynamic/dynamic.routes'
import trafficRoutes from './traffic/traffic.routes'
import trafficAddRoutes from './traffic-add/traffic-add.routes'

const plotPortalRoutes = [{
  path: 'plotPortal',
  component: plotPortal,
  children: [
    ...albumRoutes,
    ...installmentRoutes,
    ...baseInfoRoutes,
    ...houseTypeRoutes,
    ...buildingInfoRoutes,
    ...sandTableFigureRoutes,
    ...openHouseRoutes,
    ...addAlbumRoutes,
    ...checkAlbumRoutes,
    ...addHouseTypeRoutes,
    ...aroundRoutes,
    ...dynamicRoutes,
    ...trafficRoutes,
    ...trafficAddRoutes
  ]
}]
export default plotPortalRoutes
