import * as echarts from 'echarts/core';
import axios from 'axios'; // 使用你项目中已有的 axios

// 智能判断当前图表该用哪张底图 (保留原有逻辑)
export const resolveMapType = (localJsonPath) => {
  if (!localJsonPath) return null;
  if (localJsonPath.includes('province.json')) return 'province';
  return null;
};

// 🌟 架构升级：异步并发加载底图
export const registerAllMaps = async () => {
  try {
    console.log('🗺️ 大唐统计局：开始通过网络异步拉取底图...');
    
    // 使用 Promise.all 并发发起 1 个请求，极致压缩加载时间
    // 注意：这里的路径以 / 开头，代表直接访问 public 目录下的文件
    const [provinceRes] = await Promise.all([
      axios.get('/json/geo_province.json'),
    ]);

    // 拿到数据后，注册到 ECharts
    echarts.registerMap('province', provinceRes.data);
    
    console.log('✅ 大唐统计局：底图物料异步装载完毕！');
  } catch (error) {
    console.error('❌ 底图加载失败，请检查 public/json 目录下是否存在对应文件:', error);
  }
};