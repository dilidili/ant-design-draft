import { CodeModelState } from './code';
import { SaveModelState } from './save';
import { EffectsCommandMap, EffectType } from 'dva';
import { AnyAction } from 'redux';

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
