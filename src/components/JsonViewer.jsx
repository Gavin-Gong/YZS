import React from "react";
import RJV from "react-json-view";
import _ from "lodash";
import "./JsonViewer.scss";
import { message } from "antd";
import { Button, Input, Textarea } from "@geist-ui/react";

const CACHE_KEY = "JSON_CACHE";
export default class JsonViewer extends React.Component {
  state = {
    form: {
      jsonStr: "",
      parsePath: "data.value",
      getPath: "data.value",
    },
    jsonStr: {},
  };
  componentDidMount() {
    try {
      // return;
      const storageStr = localStorage.getItem(CACHE_KEY) ?? "{}";
      const obj = JSON.parse(storageStr);
      console.log(obj);
      if (!_.isEmpty(obj)) {
        this.setState({
          form: {
            ...obj.conf,
          },
          jsonStr: obj.json,
        });
      }
    } catch (error) {}
  }
  onInputChange = (e) => {
    console.log(e);
    this.setState({
      form: {
        ...this.state.form,
        jsonStr: e.target.value,
      },
    });
  };
  onParsePathChange = (e) => {
    this.setState({
      form: {
        ...this.state.form,
        parsePath: e.target.value,
      },
    });
  };
  onGetPathChange = (e) => {
    this.setState({
      form: {
        ...this.state.form,
        getPath: e.target.value,
      },
    });
  };
  handleParse = () => {
    const { form } = this.state;
    console.log(form);
    try {
      let obj = JSON.parse(form.jsonStr);
      if (form.parsePath && form.parsePath.trim()) {
        let str = _.get(obj, form.parsePath);
        if (_.isString(str)) {
          try {
            let subObj = JSON.parse(str);
            _.set(obj, form.parsePath, subObj);
          } catch (error) {
            message.warn("解析路径下的字符串无法被解析成 json");
          }
        }
      }
      if (form.getPath && form.getPath.trim()) {
        const getRes = _.get(obj, form.getPath);
        if (_.isArray(getRes) || _.isObject(getRes)) {
          obj = getRes ?? obj;
        } else {
          message.warn("无法取到 get 路径下的属性或者其值不是数组和对象");
        }
      }
      this.setState({
        jsonStr: obj,
      });
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          conf: form,
          json: obj,
        })
      );
      console.log(obj);
    } catch (error) {
      message.error(`无法格式化 JSON ${error.message}`);
    }
  };
  handleClear = () => {
    this.setState({
      form: {
        ...this.state.form,
        jsonStr: "",
        parsePath: "data.value",
        getPath: "data.value",
      },
      jsonStr: {},
    });
  };
  render() {
    const {
      onInputChange,
      onParsePathChange,
      onGetPathChange,
      handleParse,
      handleClear,
    } = this;
    const { form, jsonStr } = this.state;
    return (
      <div className="json-viewer p-8 w-4/5 m-auto">
        <div className="flex">
          <Textarea
            value={form.jsonStr}
            onInput={onInputChange}
            rows={10}
            className="mr-5"
            width="calc(100% - 280px)"
            style={{ fontFamily: "monospace" }}
            placeholder="输入或者粘贴 JSON 字符串"
          />
          <div className="form-right">
            <div className="mb-4">
              <span className="inline-block mr-2">解析路径</span>
              <Input
                value={form.parsePath}
                onChange={onParsePathChange}
              ></Input>
            </div>
            <div>
              <span className="inline-block mr-2">get 路径</span>
              <Input value={form.getPath} onChange={onGetPathChange}></Input>
            </div>
          </div>
        </div>
        <div className="text-center my-5">
          <Button type="secondary" onClick={handleParse} className="ml-4" auto>
            格式化
          </Button>
          <Button onClick={handleClear} className="ml-4" auto>
            重置
          </Button>
        </div>
        <RJV
          src={jsonStr}
          iconStyle="circle"
          collapsed={4}
          displayDataTypes={false}
          name={null}
        />
      </div>
    );
  }
}
