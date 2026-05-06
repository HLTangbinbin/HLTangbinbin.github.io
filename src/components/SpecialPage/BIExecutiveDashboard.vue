<template>
  <div class="design-page">
    <section class="design-hero">
      <div class="hero-copy">
        <div class="hero-kicker">Matched Design Draft</div>
        <h1>统计分析工作台设计稿</h1>
        <p>
          这版设计稿不再模拟独立经营大屏，而是严格对应当前站点的真实结构:
          顶部站点头部、三级导航、页面级筛选、图表卡片流、联动分析、城市对比与智能分析面板。
        </p>
      </div>
      <div class="hero-meta">
        <div class="meta-chip">对应路由: /BIConcept</div>
        <div class="meta-chip">适配主题: 日间 / 暗黑</div>
        <div class="meta-chip">{{ todayText }}</div>
      </div>
    </section>

    <section class="workspace-frame">
      <header class="shell-header">
        <div class="shell-brand">
          <div class="brand-mark">DT</div>
          <div>
            <div class="brand-title">大唐统计局</div>
            <div class="brand-subtitle">多层级统计分析平台</div>
          </div>
        </div>
        <div class="shell-actions">
          <div class="ghost-chip">主题切换</div>
          <div class="ghost-chip">系统初始化</div>
        </div>
      </header>

      <div class="shell-nav">
        <div v-for="item in topNav" :key="item.label" class="nav-pill" :class="{ active: item.active }">
          {{ item.label }}
        </div>
      </div>

      <div class="shell-subnav">
        <div class="subnav-track">
          <div v-for="item in secondNav" :key="item.label" class="subnav-pill" :class="{ active: item.active }">
            {{ item.label }}
          </div>
        </div>
        <div class="subnav-divider"></div>
        <div class="subnav-track compact">
          <div v-for="item in thirdNav" :key="item.label" class="subnav-pill minor" :class="{ active: item.active }">
            {{ item.label }}
          </div>
        </div>
      </div>

      <div class="workspace-body">
        <div class="workspace-main">
          <section class="surface page-summary">
            <div class="summary-head">
              <div>
                <div class="surface-label">页面级信息</div>
                <h2>全国 / 金融 / 证券 / 年度</h2>
                <p>对应 `ChartPage` 页头，展示路径、最新期次、联动状态以及月度/年度切换。</p>
              </div>
              <div class="summary-switch">
                <span class="switch-pill">月度</span>
                <span class="switch-pill active">年度</span>
              </div>
            </div>

            <div class="summary-grid">
              <div class="stat-card">
                <span class="stat-label">最新期次</span>
                <strong>2025 年</strong>
              </div>
              <div class="stat-card">
                <span class="stat-label">联动中</span>
                <strong>北京 · GDP总量</strong>
              </div>
              <div class="stat-card">
                <span class="stat-label">图表数</span>
                <strong>6 张</strong>
              </div>
              <div class="stat-card">
                <span class="stat-label">数据频率</span>
                <strong>年度 / 月度混合</strong>
              </div>
            </div>
          </section>

          <section class="chart-grid">
            <article class="surface chart-card wide">
              <div class="card-head">
                <div>
                  <div class="surface-label">图表卡片 A</div>
                  <h3>主趋势图 + 工具栏</h3>
                </div>
                <div class="head-tag">对应 `ChartContainer`</div>
              </div>

              <div class="toolbar-preview">
                <span class="toolbar-group strong">视图: 表格 / 柱状 / 条形 / 折线 / 地图</span>
                <span class="toolbar-group">时间: 最近 12 期</span>
                <span class="toolbar-group">操作: 全选 / 智能分析 / 连续 / 同比 / 指标 / 偏移</span>
                <span class="toolbar-group accent">添加城市对比</span>
              </div>

              <div class="plot-shell">
                <div class="plot-grid"></div>
                <div class="plot-lines">
                  <svg viewBox="0 0 720 240" preserveAspectRatio="none">
                    <path
                      d="M18 184 C78 168,122 152,162 146 S238 110,286 118 S378 176,422 150 S534 70,580 94 S660 126,702 82"
                      fill="none"
                      stroke="var(--line-main)"
                      stroke-width="4"
                      stroke-linecap="round"
                    />
                    <path
                      d="M18 202 C74 198,122 182,162 176 S242 148,286 154 S374 184,422 170 S536 120,580 128 S658 146,702 134"
                      fill="none"
                      stroke="var(--line-sub)"
                      stroke-width="4"
                      stroke-linecap="round"
                    />
                  </svg>
                </div>
                <div class="plot-legend">
                  <span><i class="dot dot-main"></i>GDP总量</span>
                  <span><i class="dot dot-sub"></i>人均GDP</span>
                  <span><i class="dot dot-accent"></i>点击后可联动其他图</span>
                </div>
              </div>
            </article>

            <article class="surface chart-card">
              <div class="card-head">
                <div>
                  <div class="surface-label">图表卡片 B</div>
                  <h3>表格视图</h3>
                </div>
                <div class="head-tag">对应 `DataTableView`</div>
              </div>

              <div class="mini-table">
                <div class="table-row table-head">
                  <span>年份</span>
                  <span>北京</span>
                  <span>上海</span>
                  <span>深圳</span>
                </div>
                <div v-for="row in tableRows" :key="row.year" class="table-row">
                  <span>{{ row.year }}</span>
                  <span>{{ row.beijing }}</span>
                  <span>{{ row.shanghai }}</span>
                  <span>{{ row.shenzhen }}</span>
                </div>
              </div>
            </article>

            <article class="surface chart-card">
              <div class="card-head">
                <div>
                  <div class="surface-label">图表卡片 C</div>
                  <h3>地图 / 城市对比</h3>
                </div>
                <div class="head-tag">对应地图模式 + 城市抽屉</div>
              </div>

              <div class="map-preview">
                <div class="map-board">
                  <div class="map-shape shape-a"></div>
                  <div class="map-shape shape-b"></div>
                  <div class="map-shape shape-c"></div>
                  <div class="map-point point-a">北京</div>
                  <div class="map-point point-b">武汉</div>
                  <div class="map-point point-c">深圳</div>
                </div>
                <div class="compare-sheet">
                  <div class="sheet-title">对比中 (3/5)</div>
                  <div class="sheet-chip">北京</div>
                  <div class="sheet-chip">上海</div>
                  <div class="sheet-chip">深圳</div>
                  <div class="sheet-note">抽屉用于追加城市，不与主图抢空间。</div>
                </div>
              </div>
            </article>

            <article class="surface chart-card">
              <div class="card-head">
                <div>
                  <div class="surface-label">图表卡片 D</div>
                  <h3>智能分析 / 数据状态</h3>
                </div>
                <div class="head-tag">对应 `SmartNarrativePanel` 等</div>
              </div>

              <div class="narrative-list">
                <div v-for="item in narrativeItems" :key="item.title" class="narrative-item">
                  <strong>{{ item.title }}</strong>
                  <p>{{ item.text }}</p>
                </div>
              </div>
            </article>
          </section>
        </div>

        <aside class="workspace-side">
          <section class="surface side-card">
            <div class="surface-label">真实功能映射</div>
            <div class="mapping-list">
              <div v-for="item in mappings" :key="item.title" class="mapping-item">
                <strong>{{ item.title }}</strong>
                <p>{{ item.text }}</p>
              </div>
            </div>
          </section>

          <section class="surface side-card">
            <div class="surface-label">设计约束</div>
            <div class="constraint-list">
              <div v-for="item in constraints" :key="item" class="constraint-item">{{ item }}</div>
            </div>
          </section>
        </aside>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const topNav = [
  { label: 'BI设计稿', active: true },
  { label: '武汉', active: false },
  { label: '城市', active: false },
  { label: '省市', active: false },
  { label: '全国', active: false }
];

const secondNav = [
  { label: 'GDP', active: false },
  { label: '人口', active: false },
  { label: '财政', active: false },
  { label: '房地产', active: false },
  { label: '教育', active: false },
  { label: '医疗', active: false },
  { label: '婚姻', active: false },
  { label: '社零', active: false },
  { label: '金融', active: true }
];

const thirdNav = [
  { label: '货币', active: false },
  { label: '社融', active: false },
  { label: '证券', active: true },
  { label: '保险', active: false }
];

const tableRows = [
  { year: '2022', beijing: '41610', shanghai: '44652', shenzhen: '32388' },
  { year: '2023', beijing: '43761', shanghai: '47219', shenzhen: '34606' },
  { year: '2024', beijing: '45230', shanghai: '48980', shenzhen: '36112' }
];

const narrativeItems = [
  {
    title: '趋势结论置于图表之后',
    text: '智能分析作为图表附属层，不替代图表本身，避免页面一进来只看文字结论。'
  },
  {
    title: '联动提示常驻页头',
    text: '点击图表数据点后，其他图按相同地区或类目过滤，页头保留“联动中”状态与清除入口。'
  },
  {
    title: '数据状态独立于视觉稿',
    text: '数据缺失、加载中、配置缺失都要有清晰空状态，不能被视觉装饰掩盖。'
  }
];

const mappings = [
  {
    title: '站点级框架',
    text: '保留现有标题、主题切换与三级导航，不再引入与产品无关的左侧驾驶舱导轨。'
  },
  {
    title: '页面级控制',
    text: '页头集中承载路径、最新期次、联动状态、月度/年度切换，符合 `ChartPage` 当前实现。'
  },
  {
    title: '图表级能力',
    text: '每张卡片都默认具备视图切换、时间范围、同比/连续、指标选择、导出或城市对比入口。'
  },
  {
    title: '扩展面板',
    text: '城市抽屉、智能分析和数据完整性属于增强层，设计上放在图表旁或图表后，而不是抢首页主视觉。'
  }
];

const constraints = [
  '沿用现有浅色/深色主题变量，不另起一套深海大屏色板。',
  '页面主流程是“选栏目 -> 看图 -> 联动 -> 切表/切图/对比”，不是 KPI 总览大屏。',
  '卡片宽度、留白和响应式结构需适配当前普通 Web 页面，而不是固定 16:9 展示墙。',
  '设计稿中的每个模块都必须能在现有 Vue 组件中找到映射关系。'
];

const todayText = computed(() => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
});
</script>

<style scoped>
.design-page {
  width: min(96%, 1480px);
  margin: 0 auto;
  padding: 6px 0 40px;
  color: var(--text-primary);
  --line-main: #2e95a7;
  --line-sub: #8ab8c2;
}

.design-hero {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 18px;
  padding: 10px 4px 0;
}

.hero-copy {
  max-width: 760px;
}

.hero-kicker,
.surface-label {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  background: var(--color-accent-soft);
  color: var(--color-accent-strong);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.design-hero h1 {
  margin: 14px 0 10px;
  font-size: clamp(30px, 4vw, 46px);
  line-height: 1.04;
  letter-spacing: -0.04em;
}

.design-hero p {
  margin: 0;
  font-size: 15px;
  line-height: 1.85;
  color: var(--text-muted);
}

.hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;
}

.meta-chip,
.ghost-chip,
.head-tag,
.toolbar-group,
.sheet-chip,
.constraint-item {
  border: 1px solid var(--border-default);
  background: var(--bg-card);
  color: var(--text-secondary);
  box-shadow: var(--shadow-soft);
}

.meta-chip,
.ghost-chip,
.head-tag,
.sheet-chip {
  height: 36px;
  padding: 0 14px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  white-space: nowrap;
}

.workspace-frame {
  border-radius: 28px;
  padding: 18px;
  background:
    radial-gradient(circle at top right, rgba(var(--color-accent-rgb), 0.1), transparent 24%),
    linear-gradient(180deg, var(--bg-card-soft), var(--bg-page));
  border: 1px solid var(--border-default);
  box-shadow: var(--shadow-medium);
}

.shell-header,
.shell-nav,
.shell-subnav,
.workspace-body {
  border-radius: 22px;
  border: 1px solid var(--border-default);
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(18px);
}

html[data-theme='dark'] .shell-header,
html[data-theme='dark'] .shell-nav,
html[data-theme='dark'] .shell-subnav,
html[data-theme='dark'] .workspace-body {
  background: rgba(17, 24, 39, 0.75);
}

.shell-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 16px 18px;
}

.shell-brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.brand-mark {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, var(--color-accent), rgba(var(--color-accent-rgb), 0.35));
  color: var(--text-inverse);
  font-weight: 800;
  letter-spacing: 0.08em;
}

.brand-title {
  font-size: 20px;
  font-weight: 700;
}

.brand-subtitle {
  margin-top: 4px;
  font-size: 12px;
  color: var(--text-muted);
}

.shell-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.shell-nav,
.shell-subnav {
  margin-top: 14px;
  padding: 12px;
}

.shell-nav,
.subnav-track {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.nav-pill,
.subnav-pill,
.switch-pill {
  height: 38px;
  padding: 0 16px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  color: var(--text-secondary);
  background: transparent;
  font-size: 14px;
  font-weight: 600;
}

.nav-pill.active,
.subnav-pill.active,
.switch-pill.active {
  background: var(--color-accent-fill);
  color: var(--color-accent-contrast);
  border-color: rgba(var(--color-accent-rgb), 0.14);
}

.shell-subnav {
  display: flex;
  align-items: center;
  gap: 14px;
}

.subnav-track.compact {
  flex-wrap: nowrap;
}

.subnav-divider {
  width: 1px;
  align-self: stretch;
  background: var(--border-default);
}

.subnav-pill.minor {
  height: 34px;
  padding: 0 14px;
  font-size: 13px;
}

.workspace-body {
  margin-top: 16px;
  padding: 18px;
  display: grid;
  grid-template-columns: minmax(0, 1.85fr) minmax(300px, 0.9fr);
  gap: 18px;
}

.workspace-main,
.workspace-side,
.chart-grid {
  display: grid;
  gap: 18px;
}

.surface {
  border-radius: 24px;
  padding: 20px;
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  box-shadow: var(--shadow-soft);
}

.summary-head,
.card-head {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 12px;
}

.summary-head h2,
.card-head h3 {
  margin: 12px 0 8px;
  font-size: 24px;
  line-height: 1.1;
}

.summary-head p,
.mapping-item p,
.narrative-item p,
.sheet-note {
  margin: 0;
  color: var(--text-muted);
  font-size: 14px;
  line-height: 1.75;
}

.summary-switch {
  display: flex;
  gap: 8px;
  padding: 4px;
  border-radius: 999px;
  background: var(--bg-card-soft);
}

.summary-grid {
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.stat-card {
  padding: 16px;
  border-radius: 18px;
  background: var(--bg-card-soft);
  border: 1px solid var(--border-default);
}

.stat-label {
  display: block;
  font-size: 12px;
  color: var(--text-muted);
}

.stat-card strong {
  display: block;
  margin-top: 10px;
  font-size: 20px;
}

.chart-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.chart-card.wide {
  grid-column: span 2;
}

.toolbar-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

.toolbar-group {
  min-height: 38px;
  padding: 8px 14px;
  border-radius: 14px;
  font-size: 13px;
  line-height: 1.5;
}

.toolbar-group.strong {
  color: var(--text-primary);
  font-weight: 700;
}

.toolbar-group.accent {
  background: var(--color-accent-fill);
  color: var(--color-accent-contrast);
}

.plot-shell {
  position: relative;
  margin-top: 18px;
  min-height: 300px;
  border-radius: 20px;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(var(--color-accent-rgb), 0.04), transparent 36%), var(--bg-card-soft);
  border: 1px solid var(--border-default);
}

.plot-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(var(--color-accent-rgb), 0.08) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(var(--color-accent-rgb), 0.08) 1px, transparent 1px);
  background-size: 16.6% 100%, 100% 20%;
}

.plot-lines {
  position: relative;
  z-index: 1;
  height: 240px;
  margin: 28px 18px 0;
}

.plot-lines svg {
  width: 100%;
  height: 100%;
}

.plot-legend {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  padding: 0 18px 18px;
  color: var(--text-muted);
  font-size: 13px;
}

.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-right: 8px;
  border-radius: 50%;
}

.dot-main {
  background: var(--line-main);
}

.dot-sub {
  background: var(--line-sub);
}

.dot-accent {
  background: var(--color-accent-strong);
}

.mini-table {
  margin-top: 16px;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid var(--border-default);
}

.table-row {
  display: grid;
  grid-template-columns: 0.9fr repeat(3, 1fr);
  gap: 10px;
  padding: 14px 16px;
  font-size: 13px;
  background: var(--bg-card);
  border-top: 1px solid var(--border-default);
}

.table-head {
  background: var(--bg-card-soft);
  border-top: 0;
  font-weight: 700;
}

.map-preview {
  margin-top: 16px;
  display: grid;
  grid-template-columns: 1.3fr 0.9fr;
  gap: 14px;
}

.map-board,
.compare-sheet {
  border-radius: 18px;
  border: 1px solid var(--border-default);
  background: var(--bg-card-soft);
}

.map-board {
  position: relative;
  min-height: 238px;
  overflow: hidden;
}

.map-shape {
  position: absolute;
  border-radius: 44% 56% 48% 52% / 52% 42% 58% 48%;
  background: linear-gradient(135deg, rgba(var(--color-accent-rgb), 0.2), rgba(var(--color-accent-rgb), 0.06));
  border: 1px solid rgba(var(--color-accent-rgb), 0.22);
}

.shape-a {
  inset: 22px auto auto 24px;
  width: 150px;
  height: 110px;
}

.shape-b {
  inset: 88px auto auto 148px;
  width: 132px;
  height: 92px;
}

.shape-c {
  inset: 46px 34px auto auto;
  width: 138px;
  height: 122px;
}

.map-point {
  position: absolute;
  padding: 6px 10px;
  border-radius: 999px;
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  box-shadow: var(--shadow-soft);
  font-size: 12px;
  font-weight: 700;
}

.point-a {
  top: 32px;
  left: 70px;
}

.point-b {
  top: 142px;
  left: 140px;
}

.point-c {
  top: 96px;
  right: 54px;
}

.compare-sheet {
  padding: 16px;
  display: grid;
  align-content: start;
  gap: 10px;
}

.sheet-title {
  font-size: 15px;
  font-weight: 700;
}

.narrative-list,
.mapping-list {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}

.narrative-item,
.mapping-item {
  padding: 14px 16px;
  border-radius: 18px;
  background: var(--bg-card-soft);
  border: 1px solid var(--border-default);
}

.narrative-item strong,
.mapping-item strong {
  display: block;
  margin-bottom: 8px;
  font-size: 15px;
}

.side-card {
  align-content: start;
}

.constraint-list {
  display: grid;
  gap: 10px;
  margin-top: 16px;
}

.constraint-item {
  min-height: 52px;
  padding: 12px 14px;
  border-radius: 16px;
  font-size: 13px;
  line-height: 1.65;
}

@media (max-width: 1180px) {
  .workspace-body,
  .map-preview {
    grid-template-columns: 1fr;
  }

  .summary-grid,
  .chart-grid {
    grid-template-columns: 1fr;
  }

  .chart-card.wide {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .design-page {
    width: 96%;
  }

  .design-hero,
  .shell-header,
  .summary-head,
  .card-head,
  .shell-subnav {
    display: grid;
  }

  .workspace-frame,
  .workspace-body,
  .surface {
    padding: 14px;
    border-radius: 18px;
  }

  .summary-grid {
    grid-template-columns: 1fr 1fr;
  }

  .table-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
