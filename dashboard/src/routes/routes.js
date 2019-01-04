import DashboardLayout from 'src/pages/Layout/DashboardLayout.vue'
import AuthLayout from 'src/pages/Layout/AuthLayout.vue'

// Page Headers
import DefaultHeader from 'src/pages/Layout/DefaultHeader'
import DashboardHeader from 'src/pages/Layout/DashboardHeader.vue'

// Dashboard pages
import Dashboard from 'src/pages/Dashboard.vue'

// Pages
const User = ()=>  import('src/pages/UserProfile.vue');
const Login = ()=>  import('src/pages/Login.vue');
const Register = ()=>  import('src/pages/Register.vue');
const Lock = ()=>  import('src/pages/Lock.vue');
import NotFound from 'src/pages/NotFoundPage.vue'


// Charts
const Charts = () => import('src/pages/Dashboard/Charts.vue');

let pagesMenu = {
  path: '/pages',
  component: DashboardLayout,
  name: 'Pages',
  redirect: '/pages/user',
  children: [
    {
      path: 'user',
      name: 'User Page',
      components: {default: User, header: DefaultHeader}
    },
  ]
}

let authPages = {
  path: '/',
  component: AuthLayout,
  name: 'Authentication',
  children: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/lock',
      name: 'Lock',
      component: Lock
    }
  ]
}

const routes = [
  {
    path: '/',
    redirect: '/login',
    name: 'Home'
  },
  pagesMenu,
  authPages,
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        meta: {
          auth: true
        },
        components: {default: Dashboard, header: DashboardHeader}
      },
      {
        path: 'charts',
        name: 'Charts',
        components: {default: Charts, header: DefaultHeader}
      },
    ]
  },
  {path: '*', component: NotFound}
];

export default routes
