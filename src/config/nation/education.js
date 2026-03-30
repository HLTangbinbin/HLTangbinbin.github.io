import { params_education } from '@/config/apiParams.js';

export const EducationSchoolCharts = {
  source: {
    localJson: './json/nation.json',
    apiParams: params_education
  },
  charts: [
    {
      id: 'ES-SC',
      title: '各类学校数(个)',
      subtitle: '',
      period: 'yearly',
      zbcodeArr: ['A0M0508', 'A0M0506', 'A0M0504', 'A0M0503', 'A0M0501'],
      dbCode: 'nd',
      chartType: 'bar',
      exceptName: '学校数',
    },
    {
      id: 'ES-TAS',
      title: '各类学校生师比',
      subtitle: '',
      period: 'yearly',
      zbcodeArr: ['A0M0W01', 'A0M0W02', 'A0M0W03', 'A0M0W06'],
      dbCode: 'nd',
      chartType: 'bar',
      exceptName: '生师比',
    },
  ]
};

export const EducationTeacherCharts = {
  source: {
    localJson: './json/nation.json',
    apiParams: params_education
  },
  charts: [
    {
      id: 'ES-TC',
      title: '各类教师数(万人)',
      subtitle: '',
      period: 'yearly',
      zbcodeArr: ['A0M0608', 'A0M0606', 'A0M0604', 'A0M0603', 'A0M0601'],
      dbCode: 'nd',
      chartType: 'bar',
      exceptName: '普通教育专任教师数',
    },
  ]
};

export const EducationStudentCharts = {
  source: {
    localJson: './json/nation.json',
    apiParams: params_education
  },
  charts: [
    {
      id: 'ES-ZS',
      title: '招生数(万人)',
      subtitle: '',
      period: 'yearly',
      zbcodeArr: ['A0M020119', 'A0M020111', 'A0M02010U', 'A0M02010I', 'A0M020105', 'A0M020102', 'A030109'],
      dbCode: 'nd',
      chartType: 'bar',
      exceptName: '招生数',
      pieConfig: {
        enabled: true,
        pies: [{
          triggerZbCodes: ['A0M020119', 'A0M020111', 'A0M02010U', 'A0M02010I', 'A0M020105', 'A0M020102'],
        }]
      },
      enableOffset: true,
    },
    {
      id: 'ES-ZX',
      title: '在校学生数(万人)',
      subtitle: '',
      period: 'yearly',
      zbcodeArr: ['A0M02021A', 'A0M020212', 'A0M02020V', 'A0M02020J', 'A0M020205', 'A0M020202', 'A030109'],
      dbCode: 'nd',
      chartType: 'bar',
      exceptName: '在校学生数',
      pieConfig: {
        enabled: true,
        pies: [{
          triggerZbCodes: ['A0M02021A', 'A0M020212', 'A0M02020V', 'A0M02020J', 'A0M020205', 'A0M020202'],
        }]
      },
      enableOffset: true,
    },
    {
      id: 'ES-BY',
      title: '毕业生数(万人)',
      subtitle: '',
      period: 'yearly',
      zbcodeArr: ['A0M02031A', 'A0M020312', 'A0M02030V', 'A0M02030J', 'A0M020305', 'A0M020302', 'A030109'],
      dbCode: 'nd',
      chartType: 'bar',
      exceptName: '毕业生数',
      pieConfig: {
        enabled: true,
        pies: [{
          triggerZbCodes: ['A0M02031A', 'A0M020312', 'A0M02030V', 'A0M02030J', 'A0M020305', 'A0M020302'],
        }]
      },
      enableOffset: true,
    }
  ]
};
