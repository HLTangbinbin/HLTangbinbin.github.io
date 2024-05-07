
import { createRouter, createWebHashHistory } from 'vue-router'; 
import NewHouse from '../components/NewHouse.vue';
import SecondHandHouse from '../components/SecondHandHouse.vue';
import SocialFinancing from '../components/SocialFinancing.vue';
import CurrencyIssue from '../components/CurrencyIssue.vue';
import PopulationCorrelation from '../components/PopulationCorrelation.vue';
import IndicesData from '../components/IndicesData.vue';


const routes = [
  { path: '/', redirect: '/newhouse' }, 
  { path: '/newhouse', component: NewHouse },
  { path: '/secondhand', component: SecondHandHouse },
  { path: '/socialfinancing', component: SocialFinancing },
  { path: '/currencyissue', component: CurrencyIssue },
  { path: '/populationcorrelation', component: PopulationCorrelation },
  { path: '/indicesdata', component: IndicesData }
  
];


// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  model: 'hash',
  routes,
});

export default router;
