import Vue from 'vue';
import VueRouter from 'vue-router'
// import Home from '@/components/HelloWorld';
import Login from '@/components/login';
import Dashboard from '@/components/Dashboard';
import Products from '@/components/page/Products';
import CustomerOrder from '@/components/page/customerOrder'
import Coupons from '@/components/page/coupons';
import CustomerPayOut from '@/components/page/customerpayout';
import OrderList from '@/components/page/orderList';



Vue.use(VueRouter);

export default new VueRouter({
    routes:[
        {
            path:'*',
            redirect:'/login'
        },
        // {
        //     name:'home',
        //     path:'/',
        //     component:Home,
        //     meta: { requiresAuth: true }
        // },
        {
            name:'login',
            path:'/login',
            component:Login,
        },
        {
            name:'Dashboard',
            path:'/admin',
            component:Dashboard,
            children:[
                {
                    name:'products',
                    path:'products',
                    component:Products,
                    meta: { requiresAuth: true }, //要加在這邊不然繞過admin驗證會跳錯
                },
                {
                    name:'orderList',
                    path:'orderlist',
                    component:OrderList,
                    meta: { requiresAuth: true },
                },
                {
                    name:'coupons',
                    path:'coupons',
                    component:Coupons,
                    meta: { requiresAuth: true },
                }
            ]
        },
        {
            name:'Dashboard',
            path:'/',
            component:Dashboard,
            children:[
                {
                    name:'CustomerOrder',
                    path:'customer_order',
                    component:CustomerOrder,
                },
                {
                    name:'CustomerPayout',
                    path:'customer_payout/:orderId',
                    component:CustomerPayOut,
                },
            ]
        },

    ],
    
});


