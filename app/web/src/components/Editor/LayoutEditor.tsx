import React from 'react';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect.d';
import { FormLayout } from '@/models/preview';
import { Motion, spring, OpaqueConfig } from 'react-motion';
import styles from './LayoutEditor.less';
import { Dispatch } from 'redux';

interface LayoutEditorProps {
  formLayout: FormLayout[],
  dispatch: Dispatch,
};

const RowHeight = 30;
const RowMargin = 10;
const ContentWidth = 430;

const allColors = [
  '#EF767A', '#456990', '#49BEAA', '#49DCB1', '#EEB868', '#EF767A', '#456990',
  '#49BEAA', '#49DCB1', '#EEB868', '#EF767A',
];

function clamp(n: number, min: number, max: number) {
  return Math.max(Math.min(n, max), min);
}

type FormItemStyle = {
  translateX: OpaqueConfig,
  translateY: OpaqueConfig,
  scale: OpaqueConfig,
  x: number,
  y: number,
}

type PositonMap = {
  [rowKey: string]: [number, number],
}

const springSetting1 = { stiffness: 180, damping: 10 };
const springSetting2 = { stiffness: 120, damping: 17 };

class LayoutEditor extends React.Component<LayoutEditorProps, {
  lastPressRow: number,
  isPressed: boolean,
  mouseCircleDelta: PositonMap,
  mouseXY: PositonMap,
}> {
  state = {
    lastPressRow: -1,
    isPressed: false,
    mouseCircleDelta: {} as PositonMap,
    mouseXY: {} as PositonMap,
  }

  componentDidMount() {
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  };

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }

  handleMouseMove = ({ pageX, pageY }: MouseEvent | Touch) => {
    const { lastPressRow, isPressed, mouseCircleDelta } = this.state;
    const { dispatch } = this.props;

    if (isPressed) {
      let lastMouseXY: [number, number] = [0, 0];
      const mouseXY = Object.keys(mouseCircleDelta).reduce((r, key) => {
        const [dx, dy] = mouseCircleDelta[key];
        r[key] = [pageX - dx, pageY - dy];

        lastMouseXY = r[key];

        return r;
      }, {} as PositonMap);

      const row = Math.max(Math.floor(lastMouseXY[1] / (RowHeight + RowMargin)), 0);
      if (row !== lastPressRow) {
        dispatch({
          type: 'preview/switchFormItemRow',
          payload: {
            lastRow: lastPressRow,
            row: row,
          },
        })

        this.setState({ lastPressRow: row });
      }

      this.setState({ mouseXY });
    }
  }

  handleMouseUp = () => {
    this.setState({ isPressed: false, mouseCircleDelta: {}, mouseXY: {}, lastPressRow: -1 });
  }

  handleMouseDown = (row: number, layouts: FormLayout[], motionStyles: FormItemStyle[], { pageX, pageY }: React.MouseEvent | React.Touch) => {
    const selectedLayouts = layouts.filter(v => v.row === row);

    this.setState({
      lastPressRow: row,
      isPressed: true,
      mouseCircleDelta: selectedLayouts.reduce((r, v) => {
        const index = layouts.findIndex(w => v === w);
        r[v.key] = [pageX - motionStyles[index].x, pageY - motionStyles[index].y];
        return r;
      }, {} as PositonMap),
      mouseXY: selectedLayouts.reduce((r, v) => {
        const index = layouts.findIndex(w => v === w);
        r[v.key] = [motionStyles[index].x, motionStyles[index].y];
        return r;
      }, {} as PositonMap),
    });
  }

  render() {
    const { formLayout } = this.props;
    const { isPressed, mouseXY } = this.state;

    const motionStyles = formLayout.map(layout => {
      let style: FormItemStyle, x: number, y: number, scale = 1;
      const isPressedLayout = !!mouseXY[layout.key] && isPressed;

      if (isPressedLayout) {
        [x, y] = mouseXY[layout.key];
        scale = 1.05;
      } else {
        x = layout.offsetAbs / 24 * ContentWidth;
        y = layout.row * (RowHeight + RowMargin);
      }

      style = {
        translateX: spring(x, springSetting2),
        translateY: spring(y, springSetting2),
        scale: spring(scale, springSetting1),
        x: x,
        y: y,
      };

      return style;
    })

    return (
      <div className={styles.container}>
        <div className={styles.content}>
          {formLayout.map((layout, index) => {
            return (
              <Motion key={layout.key} style={motionStyles[index]}>
                {({ translateX, translateY, scale }) => {
                  return (
                    <div
                      onMouseDown={(evt) => this.handleMouseDown(layout.row, formLayout, motionStyles, evt)}
                      style={{
                        width: `${100 / 24 * layout.span}%`,
                        height: RowHeight,
                        backgroundColor: allColors[layout.key % allColors.length],
                        WebkitTransform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
                        transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
                      }}
                    />
                  )
                }}
              </Motion>
            )
          })}
        </div>
      </div>
    );
  }
}

export default connect((state: ConnectState) => {
  return {
    formLayout: state.preview.formLayout,
  }
})(LayoutEditor);