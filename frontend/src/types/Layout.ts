export type NavigationState = 'home' | 'signIn' | 'signUp' | 'loading';

export type BarEvent = 'logout' | 'settings' | 'update' | 'tgBot';

export type HeaderBarItem = {
  component: any;
  position: 'left' | 'right';
  event?: BarEvent;
  props?: any;
};

export type Button = {
  label: string;
  onclick: () => any;
  dataAut: string;
};
