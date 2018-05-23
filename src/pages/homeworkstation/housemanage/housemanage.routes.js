import housemanage from './housemanage.component.vue'
import newhouselistRoutes from '../housemanage/newhouselist/newhouselist.routes.js'
import oldhouselistRoutes from '../housemanage/oldhouselist/oldhouselist.routes.js'
import renthouselistRoutes from '../housemanage/renthouselist/renthouselist.routes.js'
// import newhousedataRoutes from '../basedata/newhousedata/newhousedata.routes.js';

const housemanageRoutes = [
  {
    path: 'housemanage',
    name: 'housemanage',
    component: housemanage,
    children: [
      ...newhouselistRoutes,
      ...oldhouselistRoutes,
      ...renthouselistRoutes
    ]
  }
]
export default housemanageRoutes
