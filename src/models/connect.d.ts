import { CodeModelState } from './code';
import { SaveModelState } from './save';
import { EffectsCommandMap, EffectType } from 'dva';
import { AnyAction, Action } from 'redux';

export interface ConnectState {
  code: CodeModelState;
  save: SaveModelState;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: ConnectState) => T) => T },
) => void;

export type EffectWithType = [(
  effects: EffectsCommandMap & { select: <T>(func: (state: ConnectState) => T) => T },
) => void, {
  type: EffectType,
}];

export type Reducer<S = any, A extends Action = AnyAction> = (
  state: S,
  action: A
) => S