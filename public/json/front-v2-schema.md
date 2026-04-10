# Front V2 Schema

新版统计资源文件不再以 `businessKey / metricKey` 作为指标主键。

唯一指标身份改为：

- `metricId = "{requestKey}:{sourceNodeId}"`

示例：

- `nation_student_enrollment_nd:ffa67f6d40104ba7b38b4e0ca4ed29c4`

## 顶层结构

```json
{
  "version": "v6",
  "meta": {
    "schema": "dt-front-v2",
    "frontMetricIds": []
  },
  "metrics": {},
  "charts": {},
  "pages": {},
  "datasets": {}
}
```

## `metrics`

`metrics` 的 key 就是 `metricId`。

每项至少包含：

- `metricId`
- `requestKey`
- `sourceNodeId`
- `queryKey`
- `displayName`
- `unit`
- `scope`
- `periods`
- `aliasKey`

说明：

- `aliasKey` 仅用于后端内部从旧 chart contract 解析到新身份，不再是前端主键。
- Vue 侧不要再把 `aliasKey` 当成唯一 ID。

## `datasets`

`datasets` 的 key 也是 `metricId`。

每项结构：

- `metricId`
- `requestKey`
- `sourceNodeId`
- `displayName`
- `unit`
- `timeline`
- `series`

其中 `series` 为按地区展开后的时序点位。

## `charts`

`charts[chartKey]` 不再输出 `metricKeys / indicatorKeys`，改为：

- `seriesRefs`
- `datasets`

`seriesRefs` 每项结构：

- `metricId`
- `requestKey`
- `sourceNodeId`
- `queryKey`
- `displayName`
- `unit`
- `aliasKey`

Vue 侧应当以 `seriesRefs[].metricId` 关联到 `datasets[metricId]` 或 `metrics[metricId]`。

## `pages`

`pages[pageKey].charts[]` 同样不再输出 `metricKeys / indicatorKeys`，只输出：

- `chartKey`
- `title`
- `derived`
- `seriesRefs`
- `datasets`

## Vue 侧改造要点

需要改的只有资源消费层：

1. 不再读取 `meta.frontMetrics`，改读 `meta.frontMetricIds`
2. 不再读取 `chart.metricKeys / chart.indicatorKeys`
3. 改读 `chart.seriesRefs`
4. 用 `seriesRefs[].metricId` 作为列表渲染 key
5. 从 `datasets[metricId]` 取图表数据
6. 从 `metrics[metricId]` 取展示信息

## 保证

统计局接口若发生字段或顺序变化：

- 采集层只要还能拿到 `requestKey + sourceNodeId`
- 前端就不需要再跟着改主键逻辑

真正需要调整时，只应改后端采集适配层，而不是 Vue 图表消费层。
