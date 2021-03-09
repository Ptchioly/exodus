import { writable } from 'svelte/store';

export const state = writable('loading');

export const setState = (newState) => {
  state.set(newState);
};

export const KEY = {};
