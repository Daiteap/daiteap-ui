import { DropdownPlugin } from 'bootstrap-vue'
import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/platform/Login'
import DaiteapWebLandingPage from '@/components/platform/DaiteapWebLandingPage'
import ChangePassword from '@/components/platform/ChangePassword'
import ChangeTenant from '@/components/platform/ChangeTenant'
import CloudProfile from '@/components/platform/CloudProfile'
import ProjectDetails from '@/components/platform/ProjectDetails'
import TemplateDetails from '@/components/platform/TemplateDetails'
import ClusterDetails from '@/components/platform/ClusterDetails'
import ComputeDetails from '@/components/platform/ComputeDetails'
import ProjectList from '@/components/platform/ProjectList'
import Templates from '@/components/platform/Templates'
import CreateCluster from '@/components/platform/CreateCluster'
import CreateCAPI from '@/components/platform/CreateCAPI'
import CreateK3s from '@/components/platform/CreateK3s'
import CreateVMs from '@/components/platform/CreateVMs'
import AzureAdminConsent from '@/components/platform/oauth/AzureAdminConsent'
import AzureAuthorize from '@/components/platform/oauth/AzureAuthorize'
import AzureCreateApp from '@/components/platform/oauth/AzureCreateApp'
import GoogleProjects from '@/components/platform/oauth/GoogleProjects'
import AddNewProject from '@/components/platform/AddNewProject'
import ComputeOverviewAll from '@/components/platform/ComputeOverviewAll'
import StorageOverall from '@/components/platform/StorageOverall'
import AddNewUser from '@/components/platform/AddNewUser'
import SelectNewUser from '@/components/platform/SelectNewUser'
import UsersList from '@/components/platform/UsersList'
import KubernetesClusterList from '@/components/platform/KubernetesClusterList'
import Profile from '@/components/platform/Profile'
import ReleaseNotes from '@/components/platform/ReleaseNotes'
import SubmitCAPICluster from '@/components/platform/SubmitCAPICluster'
import SubmitYaookCluster from '@/components/platform/SubmitYaookCluster'
import SubmitKubernetesCluster from '@/components/platform/SubmitKubernetesCluster'
import SubmitK3sCluster from '@/components/platform/SubmitK3sCluster'
import AddCloudCredentials from '@/components/platform/AddCloudCredentials'
import SubmitVMs from '@/components/platform/SubmitVMs'
import ServiceDetails from '@/components/platform/ServiceDetails'
import ServiceCatalog from '@/components/platform/ServiceCatalog'
import EmptyPlaceholderPage from '@/components/platform/EmptyPlaceholderPage'
import AddNewProjectUser from '@/components/platform/AddNewProjectUser'
import ResizeCapiCluster from '@/components/platform/ResizeCapiCluster'
import ResizeYaookCluster from '@/components/platform/ResizeYaookCluster'
import ResizeDLCMCluster from '@/components/platform/ResizeDLCMCluster'
import AddNewBucket from '@/components/platform/storage/AddNewBucket'
import BucketDetails from '@/components/platform/storage/BucketDetails'
import UserQuotas from '@/components/platform/UserQuotas'
import ResourceQuotas from '@/components/platform/ResourceQuotas'
import Unsubscribe from '@/components/platform/email/Unsubscribe'
import ClusterStatus from '@/components/platform/email/ClusterStatus'

const Layout = () => import('@/views/Layout')

Vue.use(DropdownPlugin)
Vue.use(Router)
const router = new Router({
  routes: [
    {
      name: 'Login',
      path: '/app/login',
      component: Login,
    },
    {
      name: 'k_logout',
      path: '/app/login',
      component: Login,
    },
    {
      path: '/app/platform',
      name: 'Layout',
      component: Layout,
      children: [
        {
          path: 'createcluster',
          name: 'CreateCluster',
          component: CreateCluster,
          props: true,
        },
        {
          path: 'createcapi',
          name: 'CreateCAPI',
          component: CreateCAPI,
        },
        {
          path: 'createk3s',
          name: 'CreateK3s',
          component: CreateK3s,
        },
        {
          path: 'projectlist',
          name: 'ProjectList',
          component: ProjectList,
        },
        {
          path: 'clusterdetails/:clusterID/:detailPage',
          name: 'ClusterDetails',
          component: ClusterDetails,
          props: true,
        },
        {
            path: 'computedetails/:clusterID/:detailPage',
            name: 'ComputeDetails',
            component: ComputeDetails,
            props: true
        },
        {
          path: 'servicedetails/:clusterID/:serviceName',
          name: 'ServiceDetails',
          component: ServiceDetails,
          props: true,
        },
        {
          path: 'servicecatalog',
          name: 'ServiceCatalog',
          component: ServiceCatalog,
          props: true,
        },
        {
          path: 'project/:projectID',
          name: 'ProjectDetails',
          component: ProjectDetails,
          props: true,
        },
        {
          path: 'template/:templateID',
          name: 'TemplateDetails',
          component: TemplateDetails,
          props: true,
        },
        {
          path: 'addusertoproject/:projectID',
          name: 'AddNewProjectUser',
          component: AddNewProjectUser,
          props: true,
        },
        {
          path: 'createvms',
          name: 'CreateVMs',
          component: CreateVMs,
          props: true,
        },
        {
          path: 'submitkubernetescluster/:ID',
          name: 'SubmitKubernetesCluster',
          component: SubmitKubernetesCluster,
          props: true,
        },
        {
          path: 'submitcapicluster/:ID',
          name: 'SubmitCAPICluster',
          component: SubmitCAPICluster,
          props: true,
        },
        {
          path: 'submityaookcluster/:ID',
          name: 'SubmitYaookCluster',
          component: SubmitYaookCluster,
          props: true,
        },
        {
          path: 'submitk3scluster/:ID',
          name: 'SubmitK3sCluster',
          component: SubmitK3sCluster,
          props: true,
        },
        {
          path: 'submitvms/:ID',
          name: 'SubmitVMs',
          component: SubmitVMs,
          props: true,
        },
        {
          path: 'resizecapicluster/:clusterID',
          name: 'ResizeCapiCluster',
          component: ResizeCapiCluster,
          props: true,
        },
        {
          path: 'resizeyaookcluster/:clusterID',
          name: 'ResizeYaookCluster',
          component: ResizeYaookCluster,
          props: true,
        },
        {
          path: 'resizedlcmcluster/:clusterID',
          name: 'ResizeDLCMCluster',
          component: ResizeDLCMCluster,
          props: true,
        },
        {
          path: 'templates',
          name: 'Templates',
          component: Templates,
        },
        {
          path: 'profile',
          name: 'Profile',
          component: Profile,
        },
        {
          path: 'cloudprofile',
          name: 'CloudProfile',
          component: CloudProfile,
        },
        {
          path: 'addnewproject',
          name: 'AddNewProject',
          component: AddNewProject,
          props: true,
        },
        {
          path: 'kubernetesclusterlist',
          name: 'KubernetesClusterList',
          component: KubernetesClusterList,
          props: true,
        },
        {
          path: 'addcloudcredentials',
          name: 'AddCloudCredentials',
          component: AddCloudCredentials,
          props: true,
        },
        {
          path: 'computeoverviewall',
          name: 'ComputeOverviewAll',
          component: ComputeOverviewAll,
          props: true,
        },
        {
          path: 'storageoverall',
          name: 'StorageOverall',
          component: StorageOverall,
          props: true,
        },
        {
          path: 'userslist',
          name: 'UsersList',
          component: UsersList,
          props: true,
        },
        {
          path: 'selectnewuser',
          name: 'SelectNewUser',
          component: SelectNewUser,
          props: true,
        },
        {
          path: 'addnewuser',
          name: 'AddNewUser',
          component: AddNewUser,
          props: true,
        },
        {
          path: 'cloudprofile/oauth/google/projects',
          name: 'GoogleProjects',
          component: GoogleProjects,
        },
        {
          path: 'cloudprofile/oauth/azure/adminconsent',
          name: 'AdminConsent',
          component: AzureAdminConsent,
        },
        {
          path: 'cloudprofile/oauth/azure/createapp',
          name: 'CreateApp',
          component: AzureCreateApp,
        },
        {
          path: 'cloudprofile/oauth/azure/authorize',
          name: 'Authorize',
          component: AzureAuthorize,
        },
        {
          path: 'profile/changepassword',
          name: 'ChangePassword',
          component: ChangePassword,
        },
        {
          path: 'changetenant',
          name: 'ChangeTenant',
          component: ChangeTenant,
        },
        {
          path: 'releaseNotes',
          name: 'ReleaseNotes',
          component: ReleaseNotes,
        },
        {
          path: 'overview',
          name: 'DaiteapWebLandingPage',
          component: DaiteapWebLandingPage,
        },
        {
          path: 'coming-soon',
          name: 'EmptyPlaceholderPage',
          component: EmptyPlaceholderPage,
        },
        {
          path: 'addnewbucket',
          name: 'AddNewBucket',
          component: AddNewBucket,
          props: true,
        },
        {
          path: 'bucketdetails',
          name: 'BucketDetails',
          component: BucketDetails,
          props: true,
        },
        {
          path: 'userquotas/:userID',
          name: 'UserQuotas',
          component: UserQuotas,
          props: true,
        },
        {
          path: 'resourcequotas',
          name: 'ResourceQuotas',
          component: ResourceQuotas,
          props: true,
        },
        {
          path: 'email/unsubscribe',
          name: 'Unsubscribe',
          component: Unsubscribe,
          props: true,
        },
        {
          path: 'email/cluster-status/:ClusterID',
          name: 'ClusterStatus',
          component: ClusterStatus,
          props: true,
        },
      ],
    },

    {
      path: '*',
      redirect: '/app/login',
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (!Vue.SingleUserMode) {
    if (to.meta.isAuthenticated) {
      // Get the actual url of the app, it's needed for Keycloak
      const basePath = window.location.toString()
      if (!Vue.$keycloak.authenticated) {
        // The page is protected and the user is not authenticated. Force a login.
        Vue.$keycloak.login({ redirectUri: basePath.slice(0, -1) + to.path })
      } else if (Vue.$keycloak.hasResourceRole('vue-demo-user')) {
        // The user was authenticated, and has the app role (is authorized). Update the token.
        next()
      } else {
        // The user was authenticated, but did not have the correct role (is not authorized)
        // Redirect the user to an error page
        next({ name: 'Unauthorized' })
      }
    } else {
      // This page did not require authentication
      next()
    }
  } else {
    next()
  }
})

export default router
