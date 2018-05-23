import oldhouseRoutes from './oldhouse/oldhouse.routes'
import plotRoutes from './plot/plot.routes'
import homeworkstation from './homeworkstation'
import housemanageRoutes from './housemanage/housemanage.routes'
import basehouseRoutes from './basehouse/basehouse.routes'
export default [{
  path: 'homeworkstation',
  name: 'homeworkstation',
  component: homeworkstation,
  children: [
    ...oldhouseRoutes,
    ...plotRoutes,
    ...housemanageRoutes,
    ...basehouseRoutes
  ]
}]
