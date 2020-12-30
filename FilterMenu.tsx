import React, { FunctionComponent } from "react";
import { Dropdown, Button, Menu } from "antd";
import { CheckOutlined, DownOutlined } from "@ant-design/icons";
import { FilterItem } from "./index";
import "./style/index.css";

interface FilterMenuProps {
  items: Array<FilterItem>;
  onChange: (e: any) => void;
}

const FilterMenu: FunctionComponent<FilterMenuProps> = ({
  items,
  onChange,
}) => {
  const menu = (
    <Menu>
      {items.map(({ key = "", selected = false, title = "" }, index) => (
        <Menu.Item key={key} onClick={() => selected || onChange(index)}>
          {selected && <CheckOutlined />}
          {title}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <Button>
        筛选
        <DownOutlined />
      </Button>
    </Dropdown>
  );
};

export default FilterMenu;
