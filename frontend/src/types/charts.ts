export type LabelPosition =
  | 'in-left'
  | 'in-center'
  | 'in-right'
  | 'out-top-left'
  | 'out-top-center'
  | 'out-top-right'
  | 'out-bottom-left'
  | 'out-bottom-center'
  | 'out-bottom-right';

export type Bar = {
  value: number;
  limits: string[];
  background: string;
  label: string;
  labelPosition?: LabelPosition;
  detailedLabel?: string;
  class?: string;
};

export type Limit = {
  name: string;
  value: number;
  color: string;
  draggable?: boolean;
  class?: string;
  overlapStyle?: 'stripes' | '';
  visible?: 'hover' | 'static';
};

export type StackedBars = {
  maxValue: number;
  conf?: { [k: string]: any };
  bars: Bar[];
  limits: Limit[];
  class?: string;
};
