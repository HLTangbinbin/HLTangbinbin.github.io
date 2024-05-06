// 定义排序函数
export function sortYearMonths(date1, date2) {
        // 自定义比较函数
        function compareYearMonth(a, b) {
          // 将日期字符串转换为统一的格式
          a = a.replace('-', '');
          b = b.replace('-', '');
  
          // 将年份和月份解析为整数
          var aYear = parseInt(a.substring(0, 4));
          var aMonth = parseInt(a.substring(4));
          var bYear = parseInt(b.substring(0, 4));
          var bMonth = parseInt(b.substring(4));
  
          // 首先按照年份升序排序
          if (aYear !== bYear) {
            return aYear - bYear;
          } else {
            // 如果年份相同，则按照月份升序排序
            return aMonth - bMonth;
          }
        }
        
        // 返回排序后的结果
        return compareYearMonth(date1, date2);
}
