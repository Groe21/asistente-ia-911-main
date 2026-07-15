import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import Icon from '../../../components/AppIcon';

const UrgencyDistribution = ({ data }) => {
  const chartData = [
    { name: 'Crítico', value: data?.criticalCases, color: '#DC2626' },
    { name: 'Alto', value: data?.highCases, color: '#D97706' },
    { name: 'Moderado', value: data?.moderateCases, color: '#0891B2' },
    { name: 'Bajo', value: data?.lowCases, color: '#059669' }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0];
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-clinical-lg">
          <p className="font-medium text-popover-foreground">
            {data?.name}: {data?.value} casos
          </p>
          <p className="text-sm text-muted-foreground">
            {((data?.value / chartData?.reduce((sum, item) => sum + item?.value, 0)) * 100)?.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const totalCases = chartData?.reduce((sum, item) => sum + item?.value, 0);

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-clinical">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="PieChart" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground">
          Distribución por Urgencia
        </h3>
      </div>
      {totalCases > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend and Stats */}
          <div className="space-y-3">
            {chartData?.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item?.color }}
                  />
                  <span className="font-medium text-foreground">{item?.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-foreground">{item?.value}</div>
                  <div className="text-sm text-muted-foreground">
                    {totalCases > 0 ? ((item?.value / totalCases) * 100)?.toFixed(1) : 0}%
                  </div>
                </div>
              </div>
            ))}
            
            <div className="pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="font-medium text-muted-foreground">Total de Casos:</span>
                <span className="font-bold text-lg text-foreground">{totalCases}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <Icon name="PieChart" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            No hay datos suficientes para mostrar la distribución
          </p>
        </div>
      )}
    </div>
  );
};

export default UrgencyDistribution;