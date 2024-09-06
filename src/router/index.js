
import { createRouter, createWebHashHistory } from 'vue-router'; 
// 武汉
import WH from '../components/WH/WH.vue';
import WHNewHouse from '../components/WH/WHNewHouse.vue';
import WHSecondHandHouse from '../components/WH/WHSecondHandHouse.vue';
import WHGDP from '../components/WH/WHGDP.vue';
import WHPopulation from '../components/WH/WHPopulation.vue';
import WHRealEstate from '../components/WH/WHRealEstate.vue';
import WHNationalFinance from '../components/WH/WHNationalFinance.vue';
import WHEHC from '../components/WH/WHEHC.vue';
// 一线城市
import FirstTierCity from '../components/FirstTierCity/FirstTierCity.vue';
import CityNewHouse from '../components/FirstTierCity/CityNewHouse.vue';

// 全国
import NationWide from '../components/NationWide/NationWide.vue';
import RealEstate from '../components/NationWide/RealEstate.vue';
import RealEstateInvest from '../components/NationWide/RealEstateInvest.vue';
import RealEstateSell from '../components/NationWide/RealEstateSell.vue';
import GrossDomesticProduct from '../components/NationWide/GrossDomesticProduct.vue';
import NationalFinance from '../components/NationWide/NationalFinance.vue';
import FinancialIndustry from '../components/NationWide/FinancialIndustry.vue';
import ForeignTrade from '../components/NationWide/ForeignTrade.vue';
import PopulationCorrelation from '../components/NationWide/PopulationCorrelation.vue';
import EducationSector from '../components/NationWide/EducationSector.vue';
import MedicalTreatment from '../components/NationWide/MedicalTreatment.vue';
import IndicesData from '../components/NationWide/IndicesData.vue';
import LivingStandards from '../components/NationWide/LivingStandards.vue';


const routes = [
  { path: '/', redirect: '/WH' }, 
  { path: '/WH', component: WH,
    redirect: '/WH/WHNewHouse', // 默认显示投资页面
    children: [
      { path: 'WHNewHouse', component: WHNewHouse },
      { path: 'WHSecondHandHouse', component: WHSecondHandHouse },
      { path: 'WHGDP', component: WHGDP },
      { path: 'WHPopulation', component: WHPopulation },
      { path: 'WHRealEstate', component: WHRealEstate },
      { path: 'WHNationalFinance', component: WHNationalFinance },
      { path: 'WHEHC', component: WHEHC }
    ]
  },
  { path: '/FirstTierCity', component: FirstTierCity,
    redirect: '/FirstTierCity/CityNewHouse', // 默认显示房价
    children: [
      { path: 'CityNewHouse', component: CityNewHouse },
    ]
  },
  {
    path: '/NationWide',
    component: NationWide,
    redirect: '/NationWide/RealEstate', // 默认显示投资页面
    children: [
      {
        path: 'RealEstate',
        redirect: '/NationWide/RealEstate/RealEstateInvest', // 默认显示房价
        component: RealEstate,
        children: [
          {
            path: 'RealEstateInvest',
            component: RealEstateInvest,
          },
          {
            path: 'RealEstateSell',
            component: RealEstateSell,
          }
        ]
      },
      { path: 'GrossDomesticProduct', component: GrossDomesticProduct },
      { path: 'NationalFinance', component: NationalFinance },
      { path: 'FinancialIndustry', component: FinancialIndustry },
      { path: 'ForeignTrade', component: ForeignTrade },
      { path: 'PopulationCorrelation', component: PopulationCorrelation },
      { path: 'EducationSector', component: EducationSector },
      { path: 'MedicalTreatment', component: MedicalTreatment },
      { path: 'IndicesData', component: IndicesData },
      { path: 'LivingStandards', component: LivingStandards },
    ]
  },
  
];


// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  model: 'hash',
  routes,
});

export default router;
