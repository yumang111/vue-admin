import oldhouse from './oldhouse'
import HahaRoutes from './haha/haha.routes'
import HeheRoutes from './hehe/hehe.routes'
export default [{
  path: 'oldhouse',
  component: oldhouse,
  children: [
    ...HahaRoutes,
    ...HeheRoutes
  ]
}]
