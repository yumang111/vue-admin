import tagmanagerList from './tagmanagerList'
import tagManagerListRoutes from './tag-manager-list/tag-manager-list.routes'
import tagTypeManagerRoutes from './tag-type-manager/tag-type-manager.routes'
export default [
  {
    path: 'tagmanagerlist',
    component: tagmanagerList,
    children: [
      ...tagManagerListRoutes,
      ...tagTypeManagerRoutes
    ]
  }
]
