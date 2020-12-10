import React from "react";
import RJV from "react-json-view";
import _ from "lodash";
import "./JsonViewer.scss";
import { message } from "antd";
import { Button, Input, Textarea } from "@geist-ui/react";
import MonacoEditor from 'react-monaco-editor';

const CACHE_KEY = "JSON_CACHE";
export default class JsonViewer extends React.Component {
  editor = null
  state = {
    jsonStr: '',
    form: {
      parsePath: 'data.value'
    }
  };
  componentDidMount() {
    try {
      // return;
      const storageStr = localStorage.getItem(CACHE_KEY) ?? "{}";
      const obj = JSON.parse(storageStr);
      console.log(obj);
      this.setState({
        jsonStr: _.isString(obj.json) ? obj.json : JSON.stringify(obj.json, null , 2)
      })
      
    } catch (error) {}
  };
  handleParse = () => {
    const { jsonStr, form} = this.state;
    console.log(jsonStr);
    // return
    try {
      let obj = JSON.parse(jsonStr);
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
      // if (form.getPath && form.getPath.trim()) {
      //   const getRes = _.get(obj, form.getPath);
      //   if (_.isArray(getRes) || _.isObject(getRes)) {
      //     obj = getRes ?? obj;
      //   } else {
      //     message.warn("无法取到 get 路径下的属性或者其值不是数组和对象");
      //   }
      // }
      this.setState({
        jsonStr: JSON.stringify(obj, null, 4),
      }, () => {
        this.editor.setScrollLeft(0)
        this.editor.setPosition({lineNumber: 1, column: 1}); 
        this.editor.focus()
      });
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          conf: form,
          json: JSON.stringify(obj, null, 4),
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
      jsonStr: '',
    });
    this.editor.focus();
  };
  editorDidMount = (editor, monaco) => {
    console.log('editorDidMount', editor);
    this.editor = editor
    editor.focus();
  }
  onEditorChange = (v) => {
    this.setState({
      jsonStr: v
    })
    console.log('change', v)
  }
  render() {
    const {
      onEditorChange,
      handleParse,
      handleClear,
      editorDidMount
    } = this;
    const { form, jsonStr } = this.state;
    return (
      <div className="json-viewer p-8 w-4/5 m-auto">
        <MonacoEditor
          height="calc(100vh - 250px)"
          language="json"
          theme="vs"
          options={{
            minimap: {
              enabled: false
            },
            inDiffEditor: true
          }}
          value={jsonStr}
          onChange={onEditorChange}
          editorDidMount={editorDidMount}
        />
        <div className="text-center my-5">
          <Button type="secondary" onClick={handleParse} className="ml-4" auto>
            格式化
          </Button>
          <Button onClick={handleClear} className="ml-4" auto>
            重置
          </Button>
        </div>
      </div>
    );
  }
}
