import comment from './comment.vue'
import sensitiveWordsRoutes from './sensitive-words/sensitive-words.routes'
import houseComentRoutes from './house-coment/house-coment.routes'
export default [{
  path: 'comment',
  name: 'comment',
  component: comment,
  children: [
    ...sensitiveWordsRoutes,
    ...houseComentRoutes
  ]
}]
