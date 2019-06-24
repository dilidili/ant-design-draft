import { CodeModelState } from './code';
import { EffectsCommandMap, EffectType } from 'dva';
import { AnyAction } from 'redux';

export interface ConnectState {
  code: CodeModelState;
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

export type Reducer<S> = (state: S, action: AnyAction) => S;