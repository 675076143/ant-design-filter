import React, { useState, useEffect, FunctionComponent } from "react";
import {
  Form,
  Button,
  Tag,
  AutoComplete as AntdAutoComplete,
  Select as AntdSelect,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Menu from "./FilterMenu";
import SelectedTags from "./SelectedTags";
import { FilterProps } from './index';
import "./style/index.css";

const FormItem = Form.Item;
const { Option } = AntdSelect;


const Filter: FunctionComponent<FilterProps> = (props) => {
  const { onChange, getInstance, items: propItems } = props;
  const [form] = Form.useForm();
  const { getFieldValue } = form;
  const [items, setItems] = useState(
    propItems?.filter((i) => i.visible === undefined || i.visible) ?? []
  );
  const [currentEditItemIndex, setCurrentEditItemIndex] = useState(-1);
  const [optionsForAutoComplate, setOptionsForAutoComplate] = useState({
    [currentEditItemIndex]: [],
  });
  const [plusBtnDisable, setPlusBtnDisable] = useState(false)

  const renderMethodOfEachType = {
    Input: () => <></>,

    Search: () => <></>,

    Select: ({ title = "", placeholder = "", options = [] }) => {
      return (
        <AntdSelect
          placeholder={placeholder || title}
          style={{ minWidth: "150px", maxWidth: "200px" }}
        >
          {options.map((i) => (
            <Option key={i} value={i}>
              {i}
            </Option>
          ))}
        </AntdSelect>
      );
    },

    AutoComplete: (
      { title = "", placeholder = "", options = [] },
      index: number
    ) => {
      return (
        <AntdAutoComplete
          style={{ width: 150 }}
          placeholder={placeholder || title}
          allowClear
          onSearch={async (value) => {
            if (typeof options === "function") {
              // @ts-ignore
              const res = await dataSource(value);
              // @ts-ignore
              const newDataSourceForAutoComplate = { ...options };
              newDataSourceForAutoComplate[index] = res;
              setOptionsForAutoComplate(newDataSourceForAutoComplate);
            }
          }}
          options={
            typeof options === "object"
              ? options
              : optionsForAutoComplate?.[index]
          }
        />
      );
    },
  };

  const renderEditorFrame = (editItemIndex = -1) => {
    let renderItemIndex = currentEditItemIndex;
    if (editItemIndex !== -1) {
      renderItemIndex = editItemIndex;
    }
    if (renderItemIndex === -1) return null;
    const type = items[renderItemIndex]?.type;
    if (!type) return null;

    const options = items.map(
      ({ title, selected, key }, index) =>
        (!selected || editItemIndex !== -1) && ( // 非选中状态下或主动编辑下均渲染options
          <Option key={key} value={index}>
            {title}
          </Option>
        )
    );
    return (
      <Tag
        closable
        onClose={() => {
          setCurrentEditItemIndex(-1);
          setItems(items.map((i) => ({ ...i, editing: false })));
          setPlusBtnDisable(false)
        }}
        className="ant-design-filter-tag"
      >
        <AntdSelect
          style={{ minWidth: "150px", width: "100%", marginRight: 10 }}
          value={renderItemIndex}
          onChange={setCurrentEditItemIndex}
        >
          {options}
        </AntdSelect>
        <Form
          form={form}
          onValuesChange={(changedValue) => {
            if(changedValue[currentEditItemIndex]){
              setPlusBtnDisable(false)
            }else{
              setPlusBtnDisable(true)
            }
          }}
        >
          <FormItem
            name={renderItemIndex}
            style={{ margin: "0px", marginRight: 5 }}
            initialValue={items[renderItemIndex]?.value}
          >
            {renderMethodOfEachType?.[type]?.(
              items[renderItemIndex],
              renderItemIndex
            )}
          </FormItem>
        </Form>
      </Tag>
    );
  };

  useEffect(() => {
    if (!items.find((i) => i?.editing)) {
      // 有正在编辑的则不触发onChange
      onChange?.(
        items
          .filter((i) => i.selected)
          .map(({ key, value }) => ({ key, value }))
      );
    }
  }, [items, onChange]);

  useEffect(() => {
    getInstance?.({
      reset: () => {
        setItems(items.map((i) => ({ ...i, selected: false, value: null })));
        setCurrentEditItemIndex(-1);
      },
    });
  }, [getInstance, items]);

  console.log(getFieldValue(`${currentEditItemIndex}`));
  return (
    <div className="ant-desigin-filter-body">
      <Menu items={items} onChange={setCurrentEditItemIndex} />
      <SelectedTags
        items={items}
        onChange={(_items = [], _editItemsIndex = -1) => {
          if (_editItemsIndex !== -1) {
            setCurrentEditItemIndex(_editItemsIndex);
          }
          setItems(_items);
        }}
      />
      {renderEditorFrame()}
      <Button
        style={{marginLeft:5}}
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          if (currentEditItemIndex === -1) {
            // 非编辑状态下，选中第一个未被筛选的条件
            setCurrentEditItemIndex(items.findIndex((i) => !i.selected));
            setPlusBtnDisable(true)
          } else {
            // 编辑状态下，移除当前编辑项并保存编辑数值
            setCurrentEditItemIndex(-1);
            items[currentEditItemIndex].value = getFieldValue(
              `${currentEditItemIndex}`
            );
            items[currentEditItemIndex].selected = true;
            setItems(items.map((i) => ({ ...i, editing: false })));
          }
        }}
        disabled={plusBtnDisable}
      />
    </div>
  );
};

export default Filter;
