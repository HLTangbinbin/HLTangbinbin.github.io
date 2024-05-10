
import { createRouter, createWebHashHistory } from 'vue-router'; 
import NewHouse from '../components/NewHouse.vue';
import SecondHandHouse from '../components/SecondHandHouse.vue';
import GrossDomesticProduct from '../components/GrossDomesticProduct.vue';
import FinancialIndustry from '../components/FinancialIndustry.vue';
import PopulationCorrelation from '../components/PopulationCorrelation.vue';
import IndicesData from '../components/IndicesData.vue';
import LivingStandards from '../components/LivingStandards.vue';
import CityHouse from '../components/CityHouse.vue';

const routes = [
  { path: '/', redirect: '/newhouse' }, 
  { path: '/NewHouse', component: NewHouse },
  { path: '/SecondHandHouse', component: SecondHandHouse },
  { path: '/GrossDomesticProduct', component: GrossDomesticProduct },
  { path: '/FinancialIndustry', component: FinancialIndustry },
  { path: '/PopulationCorrelation', component: PopulationCorrelation },
  { path: '/IndicesData', component: IndicesData },
  { path: '/LivingStandards', component: LivingStandards },
  { path: '/CityHouse', component: CityHouse }
  
];


// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  model: 'hash',
  routes,
});

export default router;
