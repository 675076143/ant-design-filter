import React, { FunctionComponent } from "react";
import { Tag } from "antd";
import "./style/index.css";

import { FilterItem } from "./index";

interface SelectedTagsProps {
  items: Array<FilterItem>;
  onChange: (items: Array<FilterItem>, index?: number) => void;
}

const SelectedTags: FunctionComponent<SelectedTagsProps> = ({
  items,
  onChange,
}) => {
  const defaultRender = (item: FilterItem) => {
    const { title, value } = item;
    return `${title}: ${value}`;
  };
  return (
    <div id="selected-tag">
      {items?.map(
        (item, index) =>
          item.selected && (
            <Tag
              key={item.key}
              className="ant-desigin-filter-selected-tag"
              closable
              onClose={() => {
                // 清除value
                const newItems = [...items];
                newItems[index].value = null;
                newItems[index].selected = false;
                onChange(newItems);
              }}
              onClick={() => {
                // 清除选中状态并设为正在编辑
                const newItems = [...items];
                newItems[index].selected = false;
                newItems[index].editing = true;
                onChange(newItems, index);
              }}
            >
              {defaultRender(item)}
            </Tag>
          )
      )}
    </div>
  );
};

export default SelectedTags;
