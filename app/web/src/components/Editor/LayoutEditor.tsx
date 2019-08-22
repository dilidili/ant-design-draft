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
  width: OpaqueConfig,
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
  lastPressLeftResize: number,
  lastPressRightResize: number,
  mouseLeftResizeDelta: number,
  mouseLeftResizeX: number,
  mouseRightResizeDelta: number,
  mouseRightResizeX: number,
  isPressed: boolean,
  mouseCircleDelta: PositonMap,
  mouseXY: PositonMap,
}> {
  state = {
    lastPressRow: -1,
    lastPressLeftResize: -1,
    lastPressRightResize: -1,
    mouseLeftResizeX: 0,
    mouseLeftResizeDelta: 0,
    mouseRightResizeX: 0,
    mouseRightResizeDelta: 0,
    isPressed: false,
    mouseCircleDelta: {} as PositonMap,
    mouseXY: {} as PositonMap,
  }

  componentDidMount() {
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mousemove', this.handleLeftResizeMouseMove);
    window.addEventListener('mousemove', this.handleRightResizeMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  };

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mousemove', this.handleLeftResizeMouseMove);
    window.removeEventListener('mousemove', this.handleRightResizeMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }

  handleMouseMove = ({ pageX, pageY }: MouseEvent | Touch) => {
    const { lastPressRow, isPressed, mouseCircleDelta } = this.state;
    const { dispatch } = this.props;

    if (isPressed && lastPressRow > -1) {
      let lastMouseXY: [number, number] = [0, 0];
      const mouseXY = Object.keys(mouseCircleDelta).reduce((r, key) => {
        const [dx, dy] = mouseCircleDelta[key];
        r[key] = [pageX - dx, pageY - dy];
        lastMouseXY = r[key];

        return r;
      }, {} as PositonMap);

      const row = Math.max(Math.floor(lastMouseXY[1] / (RowHeight + RowMargin) + 1 / 2), 0);
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

  handleLeftResizeMouseMove = ({ pageX }: MouseEvent) => {
    const { isPressed, mouseLeftResizeDelta } = this.state;

    if (isPressed) {
      const mouseLeftResizeX = pageX - mouseLeftResizeDelta;
      this.setState({ mouseLeftResizeX });
    }
  }

  handleRightResizeMouseMove = ({ pageX }: MouseEvent) => {
    const { isPressed, mouseRightResizeDelta } = this.state;

    if (isPressed) {
      const mouseRightResizeX = pageX - mouseRightResizeDelta;
      this.setState({ mouseRightResizeX });
    }
  }

  handleMouseUp = () => {
    const { isPressed, lastPressLeftResize, mouseLeftResizeX, lastPressRightResize, mouseRightResizeX } = this.state;
    const { dispatch } = this.props;

    if (isPressed && lastPressLeftResize > -1) {
      const col = clamp(Math.floor(mouseLeftResizeX * 24 / ContentWidth), 0, 24);

      dispatch({
        type: 'preview/changeFormItemOffset',
        payload: {
          key: lastPressLeftResize,
          leftAbsOffset: col,
        },
      });
    }

    if (isPressed && lastPressRightResize > -1) {
      const span = Math.floor(mouseRightResizeX * 24 / ContentWidth);

      dispatch({
        type: 'preview/changeFormItemOffset',
        payload: {
          key: lastPressRightResize,
          rightAbsOffset: span,
        },
      });
    }

    this.setState({ isPressed: false, mouseCircleDelta: {}, mouseXY: {}, lastPressRow: -1, lastPressLeftResize: -1, lastPressRightResize: -1, mouseLeftResizeX: 0, mouseRightResizeX: 0, mouseLeftResizeDelta: 0, mouseRightResizeDelta: 0 });
  }

  handleMouseDownLeftResize = (key: number, pressX: number, { pageX }: React.MouseEvent) => {
    this.setState({
      isPressed: true,
      lastPressLeftResize: key,
      mouseLeftResizeDelta: pageX - pressX,
      mouseLeftResizeX: pressX,
    });
  }

  handleMouseDownRightResize = (key: number, width: number, { pageX }: React.MouseEvent) => {
    this.setState({
      isPressed: true,
      lastPressRightResize: key,
      mouseRightResizeDelta: pageX - width,
      mouseRightResizeX: width,
    });
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
    const { isPressed, mouseXY, mouseLeftResizeX, lastPressLeftResize, mouseRightResizeX, lastPressRightResize } = this.state;

    const motionStyles = formLayout.map(layout => {
      let style: FormItemStyle, x: number, y: number, scale = 1;
      let width = 100 / 24 * layout.span;

      if (!!mouseXY[layout.key] && isPressed) {
        [x, y] = mouseXY[layout.key];
        scale = 1.05;
      } else if (lastPressLeftResize === layout.key && isPressed) {
        const originalX = layout.offsetAbs / 24 * ContentWidth;
        x = mouseLeftResizeX;
        y = layout.row * (RowHeight + RowMargin);
        width = (originalX - x) * 100 / ContentWidth + width;
      } else if (lastPressRightResize === layout.key && isPressed) {
        x = layout.offsetAbs / 24 * ContentWidth;
        y = layout.row * (RowHeight + RowMargin);
        width = mouseRightResizeX * 100 / ContentWidth ;
      } else {
        x = layout.offsetAbs / 24 * ContentWidth;
        y = layout.row * (RowHeight + RowMargin);
      }

      style = {
        translateX: spring(x, springSetting2),
        translateY: spring(y, springSetting2),
        scale: spring(scale, springSetting1),
        width: spring(width, springSetting2),
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
                {({ translateX, translateY, scale, x, width }) => {
                  return (
                    <div
                      onMouseDown={(evt) => this.handleMouseDown(layout.row, formLayout, motionStyles, evt)}
                      style={{
                        height: RowHeight,
                        width: `${width}%`,
                        backgroundColor: allColors[layout.key % allColors.length],
                        WebkitTransform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
                        transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
                        zIndex: scale > 1 ? 1 : 0,
                      }}
                    >
                      {layout.offsetAbs > 0 ? <div
                        className={styles.leftResize}
                        onMouseDown={(evt) => {
                          evt.stopPropagation();
                          this.handleMouseDownLeftResize(layout.key, x, evt);
                        }}
                      /> : null}

                      {layout.span > 0 ? <div
                        className={styles.rightResize}
                        onMouseDown={(evt) => {
                          evt.stopPropagation();
                          this.handleMouseDownRightResize(layout.key, width / 100 * ContentWidth, evt);
                        }}
                      /> : null}
                    </div>
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