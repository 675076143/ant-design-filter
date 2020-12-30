import { FunctionComponent } from "react";

export type FilterInstance = {
  reset: () => void;
};

export type FilterItemType = "Input" | "Search" | "Select" | "AutoComplete";

export type FilterItem = {
  key?: string;
  type: FilterItemType;
  title?: string;
  placeholder?: string;
  visible?: boolean;
  options?: [];
  selected?: boolean
}

export interface FilterProps {
  items?: Array<FilterItem>;
  onChange?: (e: any) => void;
  getInstance?: (e: FilterInstance) => void;
}

declare const Filter: FunctionComponent<FilterProps>;

export default Filter;
