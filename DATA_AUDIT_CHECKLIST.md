# Vue3 统计项目数据排查清单

更新时间：2026-04-07

这份清单用于区分：
- 前端 Vue3 项目已经修复的问题
- 前端注册表仍需补充的问题
- JSON 数据根本未产出的问题
- JSON 已产出但口径或映射明显可疑的问题

## 已确认的前端问题

### 1. 多地区图时间范围拉长后曲线平移

现象：
- 城市人口选择 28 年后，除北京/上海外其余城市曲线错位
- 城市房地产投资/销售选择 23 年后曲线错位
- 城市教育选择 19 年后曲线错位

原因：
- 多地区图之前按数组索引拼线，没有按日期对齐

状态：
- 已在 `src/utils/chartBuilder.js` 修复

### 2. Vue3 注册表未接入但 JSON 实际存在的数据

已补入：
- 城市常住人口
- 武汉财政收支与赤字合图
- 全国出生人口与死亡人口
- 全国商品房平均销售价格
- 全国医院数
- 全国每万人口医疗卫生机构床位数
- 全国社会消费品零售总额
- 全国外汇储备
- 全国上证综合指数 / 深证综合指数

相关文件：
- `src/config/v3PageRegistry.js`

### 3. 饼图整体缺失

原因：
- Vue3 新版注册表最初几乎没有 `pieConfig`

状态：
- 第一批地区类和全国结构类饼图已补
- 运行时已支持：
  - `triggerIndicatorKeys`
  - `TopN + 其他`

相关文件：
- `src/config/v3PageRegistry.js`
- `src/utils/chartPlugins.js`
- `src/components/common/ChartView.vue`

## 数据缺失问题

以下问题不是 Vue3 项目导致，当前 JSON 中没有对应 dataset。

### 武汉

- 武汉 GDP 第一产业 / 第二产业 / 第三产业
- 武汉各区域新房年度成交量

### 城市

- 二手房上月指数图表
  - `city_second_hand_house_price_mom_unverified` 不存在

### 全国

- GDP 三产业
  - `nation_gdp_primary`
  - `nation_gdp_secondary`
  - `nation_gdp_tertiary`
- 男 / 女性人口
  - `nation_male_population`
  - `nation_female_population`
- 城镇 / 乡村人口
  - `nation_urban_population`
  - `nation_rural_population`
- 抽样页相关数据
- M0 / M1 / M2
  - `nation_m0`
  - `nation_m1`
  - `nation_m2`
- 城乡恩格尔系数
  - `nation_engel_urban`
  - `nation_engel_rural`
- 餐宿相关数据
- 交通相关数据

## 数据已存在但口径可疑

以下数据前端已能读取，但名称、数量级或业务口径和目标不一致，优先回脚本项目排查。

### 全国财政

相关 key：
- `nation_budget_income_total`
- `nation_budget_income_central`
- `nation_budget_income_local`
- `nation_budget_expenditure_total`
- `nation_budget_expenditure_central`
- `nation_budget_expenditure_local`

当前现象：
- “全国财政收入”到 2024 年仅 `3063.08`
- “中央财政收入 / 地方财政收入”呈现出很像比例而不是收入额的序列

判断：
- 高概率是抓取了错误表、错误单位或比例字段

### 全国房地产

相关 key：
- `nation_real_estate_investment_total`
- `nation_new_home_sales_area_total`
- `nation_new_home_sales_amount_total`
- `nation_new_home_avg_price_total`

当前实际名称：
- `nation_real_estate_investment_total` => `本年完成投资额`
- `nation_new_home_sales_area_total` => `房屋销售面积`
- `nation_new_home_sales_amount_total` => `房地产企业商品房销售额`
- `nation_new_home_avg_price_total` => `商品房平均销售价格`

判断：
- 如果目标是“住宅”口径，当前脚本映射不对
- 前端已按 JSON 实际口径修正标题，根因仍在数据端

### 省市房地产平均销售价格

相关 key：
- `province_residential_avg_price`

当前实际名称：
- `商品房平均销售价格`

判断：
- 如果目标是“住宅平均销售价格”，当前脚本请求参数或字段映射不对

### 婚姻

相关 key：
- `nation_divorce_count`

判断：
- JSON 有值，前端也已接入
- 若业务上判断错误，应回源核对原始统计口径

### 社融

相关 key：
- `nation_social_financing_increment`

当前实际名称：
- `社会融资规模增量`

判断：
- 若你认为页面显示的不是目标指标，需要先确认脚本想抓的是“增量”还是“存量”或“规模余额”

### 保险总资产

相关 key：
- `nation_insurance_total_assets`

当前实际名称：
- `保险公司总资产`

判断：
- 若业务判断不对，优先检查脚本映射，而不是前端

## 标题已修正但数据口径仍需确认

以下页面标题已改成和 JSON 当前实际口径一致，但不代表数据已经满足业务目标。

### 城市 / 武汉

- 商品房销售面积
- 商品房平均销售价格

### 省市

- 房屋销售面积
- 商品房平均销售价格
- 商品房销售额

### 全国

- 房地产开发本年完成投资额
- 房屋销售面积
- 房地产企业商品房销售额
- 商品房平均销售价格

## 建议回脚本项目优先核查的指标

按优先级排序：

1. 全国财政 6 个 key
2. 全国房地产 4 个 key
3. 省市平均销售价格
4. 离婚登记
5. 社融
6. 保险总资产
7. 武汉 GDP 三产业
8. 全国 GDP 三产业
9. 男 / 女、城镇 / 乡村人口
10. M0 / M1 / M2

## 脚本项目建议输出的对照表

建议在脚本项目里补一张映射表，至少包含：

- 页面模块
- 目标业务指标名
- 当前 JSON key
- JSON 实际 name
- unit
- period
- 原始接口参数
- 原始返回字段
- 是否与业务目标一致

推荐最少先覆盖：
- 财政
- 房地产
- 婚姻
- 社融
- 保险
- 指数

