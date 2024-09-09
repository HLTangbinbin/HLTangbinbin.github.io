
import { createRouter, createWebHashHistory } from 'vue-router'; 
// 武汉
import WH from '../components/WH/WH.vue';
import WHNewHouse from '../components/WH/WHNewHouse.vue';
import WHSecondHandHouse from '../components/WH/WHSecondHandHouse.vue';
import WHGDP from '../components/WH/WHGDP.vue';
import WHPopulation from '../components/WH/WHPopulation.vue';
import WHRealEstate from '../components/WH/WHRealEstate.vue';
import WHRealEstateInvest from '../components/WH/WHRealEstateInvest.vue';
import WHRealEstateSell from '../components/WH/WHRealEstateSell.vue';

import WHFinance from '../components/WH/WHFinance.vue';
import WHEducation from '../components/WH/WHEducation.vue';
import WHMedical from '../components/WH/WHMedical.vue';

// 一线城市
import FirstTierCity from '../components/FirstTierCity/FirstTierCity.vue';
import CityRealEstatePriceIndices from '../components/FirstTierCity/CityRealEstatePriceIndices.vue';
import CityGDP from '../components/FirstTierCity/CityGDP.vue';
import CityPopulation from '../components/FirstTierCity/CityPopulation.vue';
import CityRealEstate from '../components/FirstTierCity/CityRealEstate.vue';
import CityRealEstateInvest from '../components/FirstTierCity/CityRealEstateInvest.vue';
import CityRealEstateSell from '../components/FirstTierCity/CityRealEstateSell.vue';
import CityFinance from '../components/FirstTierCity/CityFinance.vue';
import CityEducation from '../components/FirstTierCity/CityEducation.vue';
import CityMedical from '../components/FirstTierCity/CityMedical.vue';

// 省份
import MajorProvincial from '../components/MajorProvincial/MajorProvincial.vue';
import ProvincialGDP from '../components/MajorProvincial/ProvincialGDP.vue';
import ProvincialPopulation from '../components/MajorProvincial/ProvincialPopulation.vue';
import ProvincialRealEstate from '../components/MajorProvincial/ProvincialRealEstate.vue';
import ProvincialRealEstateInvest from '../components/MajorProvincial/ProvincialRealEstateInvest.vue';
import ProvincialRealEstateSell from '../components/MajorProvincial/ProvincialRealEstateSell.vue';
import ProvincialFinance from '../components/MajorProvincial/ProvincialFinance.vue';
import ProvincialLiving from '../components/MajorProvincial/ProvincialLiving.vue';
import ProvincialEducation from '../components/MajorProvincial/ProvincialEducation.vue';
import ProvincialMedical from '../components/MajorProvincial/ProvincialMedical.vue';

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
      {
        path: 'WHRealEstate',
        redirect: '/WH/WHRealEstate/WHRealEstateInvest', // 默认显示房价
        component: WHRealEstate,
        children: [
          {
            path: 'WHRealEstateInvest',
            component: WHRealEstateInvest,
          },
          {
            path: 'WHRealEstateSell',
            component: WHRealEstateSell,
          }
        ]
      },
      { path: 'WHFinance', component: WHFinance },
      { path: 'WHEducation', component: WHEducation },
      { path: 'WHMedical', component: WHMedical }
    ]
  },
  { path: '/FirstTierCity', component: FirstTierCity,
    redirect: '/FirstTierCity/CityGDP', // 默认显示房价
    children: [
      { path: 'CityGDP', component: CityGDP },
      { path: 'CityPopulation', component: CityPopulation },
      {
        path: 'CityRealEstate',
        redirect: '/FirstTierCity/CityRealEstate/CityRealEstateInvest', // 默认显示房价
        component: CityRealEstate,
        children: [
          {
            path: 'CityRealEstateInvest',
            component: CityRealEstateInvest,
          },
          {
            path: 'CityRealEstateSell',
            component: CityRealEstateSell,
          },
          {
            path: 'CityRealEstatePriceIndices',
            component: CityRealEstatePriceIndices,
          }
        ]
      },
      { path: 'CityFinance', component: CityFinance },
      { path: 'CityEducation', component: CityEducation },
      { path: 'CityMedical', component: CityMedical },

    ]
  },
  // 省份
  { path: '/MajorProvincial', component: MajorProvincial,
    redirect: '/MajorProvincial/ProvincialGDP', // 默认显示GDP
    children: [
      { path: 'ProvincialGDP', component: ProvincialGDP },
      { path: 'ProvincialPopulation', component: ProvincialPopulation },
      {
        path: 'ProvincialRealEstate',
        redirect: '/MajorProvincial/ProvincialRealEstate/ProvincialRealEstateInvest', // 默认显示房价
        component: ProvincialRealEstate,
        children: [
          {
            path: 'ProvincialRealEstateInvest',
            component: ProvincialRealEstateInvest,
          },
          {
            path: 'ProvincialRealEstateSell',
            component: ProvincialRealEstateSell,
          }
        ]
      },
      { path: 'ProvincialFinance', component: ProvincialFinance },
      { path: 'ProvincialLiving', component: ProvincialLiving },
      { path: 'ProvincialEducation', component: ProvincialEducation },
      { path: 'ProvincialMedical', component: ProvincialMedical },

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
