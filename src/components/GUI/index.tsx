import { FC } from "react";
import { useDrawMachine } from "../../providers/global";
import { colors } from "../../utils/colors";

const widths = [5, 10, 15, 20];

const GUI: FC = () => {
  const [current, send] = useDrawMachine();
  const visible = current.matches("running.gui.visible");
  if (!visible) return null;
  return (
    <div className="guiContainer">
      <div className="gui">
        <div className="guiTools">
          <select
            value={current.context.color.hex}
            onChange={(event) => {
              const color = colors.find(
                ({ hex }) => event.target.value === hex
              );
              if (color) {
                send({
                  type: "CHANGE_COLOR",
                  color,
                });
              }
            }}
          >
            {colors.map((color) => (
              <option key={color.hex} value={color.hex}>
                {color.name}
              </option>
            ))}
          </select>
          <select
            value={current.context.strokeWidth}
            onChange={(event) => {
              send({
                type: "CHANGE_STROKE_WIDTH",
                width: parseInt(event.target.value, 10),
              });
            }}
          >
            {widths.map((width) => (
              <option key={width} value={width}>
                {width}
              </option>
            ))}
          </select>
        </div>
        <div className="guiTools">
          <div className="guiKey">Undo ⌫</div>
          <div className="guiKey">Toggle T</div>
        </div>
      </div>
    </div>
  );
};

export default GUI;
