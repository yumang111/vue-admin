import tagmanagerListRoutes from './tagmanagerList/tagmanagerList.routes'
import othercompanyRoutes from './othercompany/othercompany.routes'
import basehouse from './basehouse'
export default [{
  path: 'basehouse',
  component: basehouse,
  children: [
    ...tagmanagerListRoutes,
    ...othercompanyRoutes
  ]
}]
