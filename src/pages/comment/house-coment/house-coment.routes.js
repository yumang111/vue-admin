import houseComent from './house-coment.vue'
import commentManagerRoutes from './comment-manager/comment-manager.routes'
import filterLabelRoutes from './filter-label/filter-label.routes'
export default [{
  path: 'houseComent',
  name: 'houseComent',
  component: houseComent,
  children: [
    ...commentManagerRoutes,
    ...filterLabelRoutes
  ]
}]
