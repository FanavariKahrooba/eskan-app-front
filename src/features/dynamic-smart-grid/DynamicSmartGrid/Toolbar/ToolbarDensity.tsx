import type { DynamicGridDensity } from "../DynamicSmartGrid.types";
import { useDynamicSmartGridContext } from "../DynamicSmartGrid.context";

const densities: Array<{
  value: DynamicGridDensity;
  label: string;
}> = [
  {
    value: "compact",
    label: "فشرده",
  },
  {
    value: "comfortable",
    label: "معمولی",
  },
  {
    value: "spacious",
    label: "باز",
  },
];

export function ToolbarDensity() {
  const grid = useDynamicSmartGridContext();

  return (
    <select
      className="dsg-select"
      value={grid.density}
      onChange={(event) =>
        grid.setDensity(event.target.value as DynamicGridDensity)
      }
      title="تراکم نمایش"
    >
      {densities.map((density) => (
        <option key={density.value} value={density.value}>
          {density.label}
        </option>
      ))}
    </select>
  );
}
