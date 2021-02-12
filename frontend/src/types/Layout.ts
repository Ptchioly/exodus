export type NavigationState =
  | 'home'
  | 'signIn'
  | 'signUp'
  | 'loading'
  | 'waiting';

export type Validator = (value: string) => boolean;
