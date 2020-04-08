import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

/**
 * 重写路由的push方法
 */
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
    return routerPush.call(this, location).catch(error => error)
}

const routes = [{
    path: '/',
    redirect: {
        //name: 'projectInfo'
    }
},
{
    path: '/error/:code',
    name: 'error',
    component: () => import('@/views/error/index.vue')
},
{
    path: '/authArror',
    name: 'authArror',
    component: () => import('@/views/authArror/index.vue')
},
{
    path: '/projectInfo',
    name: 'projectInfo',
    component: () => import('@/views/projectInfo/index')
},
{
    path: '/hoistingSequence',
    name: 'hoistingSequence',
    component: () => import('@/views/hoistingSequence/index')
},
{
    path: '/overallProgress',
    name: 'overallProgress',
    component: () => import('@/views/overallProgress/index')
},
{
    path: '/basicProgress',
    name: 'basicProgress',
    component: () => import('@/views/basicProgress/index')
}, {
    path: '/edit',
    name: 'edit',
    component: () => import('@/views/edit/index'),
    meta:{
        requireAuth: true
    },
    children: [{
        path: 'fieldArea',
        name: 'fieldArea',
        component: () => import('@/views/edit-field-area/index'),
        meta:{
            requireAuth: true
        }
    }, {
        path: 'road',
        name: 'road',
        component: () => import('@/views/edit-road/index'),
        meta:{
            requireAuth: true
        }
    }, {
        path: 'projectLocation',
        name: 'projectLocation',
        component: () => import('@/views/edit-project-location/index'),
        meta:{
            requireAuth: true
        }
    }, {
        path: 'station',
        name: 'station',
        component: () => import('@/views/edit-station/index'),
        meta:{
            requireAuth: true
        }
    }, {
        path: 'turbines',
        name: 'turbines',
        component: () => import('@/views/edit-turbines/index'),
        meta:{
            requireAuth: true
        }
    }]
},
{
    path: '/bigPart',
    name: 'bigPart',
    component: () => import('@/views/bigPart/index')
},
{
    path: '/satelliteMonitoring',
    name: 'satelliteMonitoring',
    component: () => import('@/views/satelliteMonitoring/index')
}
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
