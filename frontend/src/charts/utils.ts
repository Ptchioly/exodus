import type { StackedBars, LabelPosition } from '../types/charts';

export const staticValues = {
  mainBgColor: '#c7d2fe',
  previousBgColor: '#a5b4fc',
  currentBgColor: '#6366f1',
  limitColor: '#A04343',
  detailedSpace: 70,
  valueString: '₴${value}',
};

export const generateChartData = (
  maxValue: number,
  limit: number,
  previous: number,
  current: number
): StackedBars => {
  const currentBar = {
    value: Math.round(current),
    limits: ['current'],
    background: staticValues.currentBgColor,
    labelPosition: 'in-left' as LabelPosition,
    label: staticValues.valueString,
    detailedLabel: staticValues.valueString,
  };

  const previousBar = {
    ...currentBar,
    value: Math.round(previous),
    limits: ['previous'],
    background: staticValues.previousBgColor,
  };

  const previousLimit = {
    name: 'previous',
    value: limit,
    color: staticValues.limitColor,
    visible: 'static' as 'static' | 'hover',
    overlapStyle: 'stripes' as '' | 'stripes',
  };

  const currentLimit = {
    ...previousLimit,
    name: 'current',
    draggable: true,
  };

  return {
    maxValue,
    conf: {
      background: staticValues.mainBgColor,
      detailedSpace: staticValues.detailedSpace,
    },
    bars: [previousBar, currentBar],
    limits: [previousLimit, currentLimit],
  };
};

// export const staticValues = {
//   mainBgColor: '#E7F4EC',
//   previousBgColor: '#A6D6D1',
//   currentBgColor: '#2F9E9E',
//   limitColor: '#A04343',
//   detailedSpace: 70,
//   valueString: '₴${value}',
// };
