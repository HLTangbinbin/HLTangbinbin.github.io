
import { createRouter, createWebHashHistory } from 'vue-router'; 
import WH from '../components/WH/WH.vue';
import NewHouse from '../components/WH/NewHouse.vue';
import SecondHandHouse from '../components/WH/SecondHandHouse.vue';
import WHGDP from '../components/WH/WHGDP.vue';
import WHPopulation from '../components/WH/WHPopulation.vue';
import WHRealEstate from '../components/WH/WHRealEstate.vue';
import WHNationalFinance from '../components/WH/WHNationalFinance.vue';
import WHEHC from '../components/WH/WHEHC.vue';
import RealEstate from '../components/RealEstate.vue';
import RealEstateInvest from '../components/RealEstateInvest.vue';
import RealEstateSell from '../components/RealEstateSell.vue';
import GrossDomesticProduct from '../components/GrossDomesticProduct.vue';
import NationalFinance from '../components/NationalFinance.vue';
import FinancialIndustry from '../components/FinancialIndustry.vue';
import ForeignTrade from '../components/ForeignTrade.vue';
import PopulationCorrelation from '../components/PopulationCorrelation.vue';
import EducationSector from '../components/EducationSector.vue';
import MedicalTreatment from '../components/MedicalTreatment.vue';
import IndicesData from '../components/IndicesData.vue';
import LivingStandards from '../components/LivingStandards.vue';
import CityHouse from '../components/CityHouse.vue';


const routes = [
  { path: '/', redirect: '/WH' }, 
  { path: '/WH', component: WH,
    redirect: '/WH/newhouse', // 默认显示投资页面
    children: [
      { path: 'newhouse', component: NewHouse },
      { path: 'secondhandhouse', component: SecondHandHouse },
      { path: 'gdp', component: WHGDP },
      { path: 'population', component: WHPopulation },
      { path: 'realestate', component: WHRealEstate },
      { path: 'nationalfinance', component: WHNationalFinance },
      { path: 'ehc', component: WHEHC }
    ]
  },
  { path: '/RealEstate', component: RealEstate,
    redirect: '/RealEstate/invest', // 默认显示投资页面
    children: [
      { path: 'invest', component: RealEstateInvest },
      { path: 'sell', component: RealEstateSell }
    ]
  },
  { path: '/GrossDomesticProduct', component: GrossDomesticProduct },
  { path: '/NationalFinance', component: NationalFinance },
  { path: '/FinancialIndustry', component: FinancialIndustry },
  { path: '/ForeignTrade', component: ForeignTrade },
  { path: '/PopulationCorrelation', component: PopulationCorrelation },
  { path: '/EducationSector', component: EducationSector },
  { path: '/MedicalTreatment', component: MedicalTreatment },
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
