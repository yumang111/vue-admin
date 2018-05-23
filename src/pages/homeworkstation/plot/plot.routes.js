
import plot from './plot'
import plotPortalRoutes from './plotPortal/plotPortal.routes'
import plotlistRoutes from './plotList/plotList.routes'
import addcmnameRoutes from './createPlot/addcmname/addcmname.routes'
import cmlocateRoutes from './createPlot/cmlocate/cmlocate.routes'

const plotRoutes = [{
  path: 'plot',
  component: plot,
  children: [
    ...plotPortalRoutes,
    ...plotlistRoutes,
    ...addcmnameRoutes,
    ...cmlocateRoutes
  ]
}]
export default plotRoutes
