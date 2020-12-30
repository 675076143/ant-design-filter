import React from "react";
import { Tag } from "antd";
import "./style/index.css";

const SelectedTags =  ({ items, onChange }) => {
  const defaultRender = ({ title, value }) => `${title}: ${value}`;

  return items.map(
    (item, index) =>
      item.selected && (
        <Tag
          key={item.key}
          className="ant-desigin-filter-selected-tag"
          closable
          onClose={() => {
            // 清除value
            const newItem = [...items];
            newItem[index].value = null;
            newItem[index].selected = false;
            onChange(newItem);
          }}
          onClick={() => {
            // 清除选中状态并设为正在编辑
            const newItem = [...items];
            newItem[index].selected = false;
            newItem[index].editing = true;
            onChange(newItem, index);
          }}
        >
          {defaultRender(item)}
        </Tag>
      )
  );
};

export default SelectedTags;
