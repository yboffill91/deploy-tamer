'use client';
import { TrendingUp, TrendingDown, PieChart as Piet, BarChart3, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, Label } from 'recharts';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminGeneralEnhanced } from '@/hooks/use-admin-general-enhanced';

// Colores para los gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Configuración para los gráficos

const retentionChartConfig = {
  '30 días': { label: '30 días', color: 'var(--primary)' },
  '90 días': { label: '90 días', color: 'var(--accent)' },
};

type UpgradeKey = 'Lite' | 'Pro' | 'Max';
const upgradesChartConfig: Record<UpgradeKey, { label: string; color: string }> = {
  Lite: { label: 'Lite', color: '#0088FE' },
  Pro: { label: 'Pro', color: '#00C49F' },
  Max: { label: 'Max', color: '#FFBB28' },
};

export function MVPSuccessMetrics() {
  const { data, loading, isCached } = useAdminGeneralEnhanced();
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    if (!loading && data) {
      setShowSkeleton(false);
    }
  }, [loading, data]);

  // Datos para el gráfico de retención
  type RetentionKey = '30 días' | '90 días';
  const retentionData: { name: RetentionKey; value: number }[] = [
    { name: '30 días', value: data?.retention?.day30 || 0 },
    { name: '90 días', value: data?.retention?.day90 || 0 },
  ];

  // Datos para el gráfico de upgrades
  const upgradesData: { name: UpgradeKey; value: number; fill: string }[] = [
    { name: 'Lite', value: data?.upgrades?.lite || 25, fill: 'var(--secondary)' },
    { name: 'Pro', value: data?.upgrades?.pro || 15, fill: 'var(--accent)' },
    { name: 'Max', value: data?.upgrades?.max || 8, fill: 'var(--primary)' },
  ];

  const totalUpgrades = upgradesData.reduce((sum, item) => sum + item.value, 0);

  if (showSkeleton) {
    return (
      <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs sm:grid-cols-2 xl:grid-cols-5">
        {/* Skeleton para la card de retención */}
        <Card className="col-span-1 xl:col-span-2">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>

        {/* Skeleton para la card de free trial */}
        <Card className="col-span-1">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-4 w-full" />
          </CardFooter>
        </Card>

        {/* Skeleton para la card de upgrades */}
        <Card className="col-span-1 xl:col-span-2">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="max-h-48">
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-b *:data-[slot=card]:shadow-xs sm:grid-cols-2 xl:grid-cols-5">
      {/* Card: % retención a 30 y 90 días con gráfica de barras */}
      <Card className="@container/card col-span-1 xl:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" /> User Retention
          </CardTitle>
          <CardDescription>30 vs 90 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={retentionChartConfig} className="h-48">
            <BarChart data={retentionData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <ChartTooltip cursor={{ fill: 'transparent' }} content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="value" name="Retention" radius={[4, 4, 0, 0]}>
                {retentionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={retentionChartConfig[entry.name].color} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[var(--primary)]"></div>
            <span>30d: {data?.retention?.day30 ?? 75}%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[var(--accent)]"></div>
            <span>90d: {data?.retention?.day90 ?? 45}%</span>
          </div>
        </CardFooter>
      </Card>

      {/* Card: Free Trial - Nueva card añadida */}
      <Card className="@container/card col-span-1 flex flex-col justify-between">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" /> Free Trial
          </CardTitle>
          <CardDescription>Active trials</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            <div className="text-4xl font-bold tabular-nums">{data?.trialCardUsers?.percentage ?? 65}%</div>
            <Badge variant={(data?.trialCardUsers?.trend ?? 0 >= 0) ? 'default' : 'destructive'} className="text-sm">
              {(data?.trialCardUsers?.trend ?? 0 >= 0) ? (
                <TrendingUp className="mr-1 h-3 w-3" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3" />
              )}
              {(data?.trialCardUsers?.trend ?? 0 >= 0) ? '+' : ''}
              {data?.trialCardUsers?.trend ?? 5.2}%
            </Badge>
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-muted-foreground w-full text-center text-sm">
            {data?.trialCardUsers?.totalUsers?.toLocaleString() ?? '1,200'} active trials
          </div>
        </CardFooter>
      </Card>

      {/* Card: % upgrades a Lite/Pro/Max con gráfica de pastel y leyenda */}
      <Card className="@container/card col-span-1 xl:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Piet className="h-5 w-5" /> Plan Upgrades
          </CardTitle>
          <CardDescription>By subscription tier</CardDescription>
        </CardHeader>
        <CardContent className="max-h-48">
          <ChartContainer config={upgradesChartConfig} className="size-full">
            <PieChart
              className="m-0"
              margin={{
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            >
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={upgradesData}
                dataKey="value"
                nameKey="name"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={2}
                cornerRadius={4}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold tabular-nums"
                          >
                            {totalUpgrades}%
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 24} className="fill-muted-foreground">
                            Total
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
                {upgradesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                content={() => (
                  <ul className="ml-8 flex flex-col gap-2">
                    {upgradesData.map((item) => (
                      <li key={item.name} className="flex w-36 items-center justify-between">
                        <span className="flex items-center gap-2 capitalize">
                          <span className="size-2.5 rounded-full" style={{ background: item.fill }} />
                          {upgradesChartConfig[item.name].label}
                        </span>
                        <span className="tabular-nums">{item.value}%</span>
                      </li>
                    ))}
                  </ul>
                )}
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="justify-center">
          <Badge variant="outline" className="text-xs">
            <TrendingUp className="mr-1 h-3 w-3" />
            Trend: +{data?.upgrades?.trend ?? 7.5}%
          </Badge>
        </CardFooter>
      </Card>
    </div>
  );
}
