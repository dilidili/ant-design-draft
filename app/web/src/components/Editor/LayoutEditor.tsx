import React from 'react';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect.d';
import { FormLayout } from '@/models/preview';
import { Motion, spring } from 'react-motion';
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

const springSetting1 = { stiffness: 180, damping: 10 };
const springSetting2 = { stiffness: 120, damping: 17 };

class LayoutEditor extends React.Component<LayoutEditorProps, {
  lastPress: number,
  isPressed: boolean,
  mouseCircleDelta: number[],
  mouseXY: number[],
}> {
  state = {
    lastPress: -1,
    isPressed: false,
    mouseCircleDelta: [0, 0],
    mouseXY: [0, 0],
  }

  componentDidMount() {
    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('touchend', this.handleMouseUp);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  };

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('touchend', this.handleMouseUp);
  }

  handleMouseMove = ({ pageX, pageY }: MouseEvent | Touch) => {
    const { lastPress, isPressed, mouseCircleDelta: [dx, dy] } = this.state;
    const { dispatch } = this.props;

    if (isPressed) {
      const mouseXY = [pageX - dx, pageY - dy];
      const row = Math.max(Math.floor(mouseXY[1] / (RowHeight + RowMargin)), 0);
      const col = clamp(Math.floor(mouseXY[0] * 24 / ContentWidth), 0, 24);

      // resort form items.
      dispatch({
        type: 'preview/changeFormItemLayout',
        payload: {
          key: lastPress,
          row: row,
          offsetAbs: col,
        },
      })

      this.setState({ mouseXY });
    }
  }

  handleMouseUp = () => {
    this.setState({isPressed: false, mouseCircleDelta: [0, 0]});
  }

  handleMouseDown = (key: number, [pressX, pressY]: [number, number], { pageX, pageY }: React.MouseEvent | React.Touch) => {
    this.setState({
      lastPress: key,
      isPressed: true,
      mouseCircleDelta: [pageX - pressX, pageY - pressY],
      mouseXY: [pressX, pressY],
    });
  }

  handleTouchStart = (key: number, pressLocation: [number, number], evt: React.TouchEvent) => {
    this.handleMouseDown(key, pressLocation, evt.touches[0]);
  }

  handleTouchMove = (evt: TouchEvent) => {
    evt.preventDefault();
    this.handleMouseMove(evt.touches[0]);
  }

  render() {
    const { formLayout } = this.props;
    const { lastPress, isPressed, mouseXY } = this.state;

    return (
      <div className={styles.container}>
        <div className={styles.content}>
          {formLayout.map(layout => {
            let style, x: number, y: number;
            const isPressedLayout = layout.row === lastPress && isPressed;

            if (isPressedLayout) {
              [x, y] = mouseXY;
            } else {
              x = layout.offsetAbs / 24 * ContentWidth;
              y = layout.row * (RowHeight + RowMargin);
            }

            style = {
              translateX: spring(x, springSetting2),
              translateY: spring(y, springSetting2),
              scale: spring(1, springSetting1),
            };

            return (
              <Motion key={layout.key} style={style}>
                {({ translateX, translateY, scale }) => {
                  return (
                    <div
                      onMouseDown={(evt) => this.handleMouseDown(layout.row, [x, y], evt)}
                      onTouchStart={(evt) => this.handleTouchStart(layout.row, [x, y], evt)}
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