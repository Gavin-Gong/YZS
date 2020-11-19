import React from "react";
import RJV from "react-json-view";
import _ from "lodash";
import './JsonViewer.scss';
import { Button, Input, message } from "antd"

const { TextArea } = Input
export default class JsonViewer extends React.Component {
  state = {
    form: {
      jsonStr: null,
      parsePath: 'data.value',
      getPath: 'data.value',
    },
    jsonStr: {}
  }
  onInputChange = (e) => {
    console.log(e)
    this.setState({
      form: {
        ...this.state.form,
        jsonStr: e.target.value,
      }
    })
  }
  onParsePathChange = (e) => {
    this.setState({
      form: {
        ...this.state.form,
        parsePath: e.target.value,
      }
    })
  }
  onGetPathChange = (e) => {
    this.setState({
      form: {
        ...this.state.form,
        getPath: e.target.value,
      }
    })
  }
  handleParse = () => {
    const { form } = this.state
    console.log(form)
    try {
      let obj = JSON.parse(form.jsonStr)
      if (form.parsePath && form.parsePath.trim()) {
        let str = _.get(obj, form.parsePath)
        if (_.isString(str)) {
          try {
            let subObj = JSON.parse(str)
            _.set(obj, form.parsePath,  subObj)
          } catch (error) {
            message.warn("parse path下的字符串无法被解析成 json")
          }
        }
      }
      if (form.getPath && form.getPath.trim()) {
        const getRes = _.get(obj, form.getPath)
        if(_.isArray(getRes) || _.isObject(getRes)) {
          obj = getRes ?? obj
        } else {
          message.warn("无法取到get path下的属性或者其值不是数组和对象")
        }
      }
      this.setState({
        jsonStr: obj
      })
      console.log(obj)
    } catch (error) {
      message.error(error.message)
    }
  }
  handleClear = () => {
    this.setState({
      form: {
        ...this.state.form,
        jsonStr: null,
      },
      jsonStr: {}
    })
  }
  render() {
    const { onInputChange, onParsePathChange, onGetPathChange, handleParse, handleClear } = this
    const { form, jsonStr } = this.state
    return <div className="json-viewer p-8">
      <div className="flex">
        <TextArea value={form.jsonStr} onInput={onInputChange} rows={10} className="mr-5" style={{width: '70%', fontFamily: 'monospace'}}/>
        <div className="form-right">
          <div>
            <span>parse path</span>
            <Input value={form.parsePath} onChange={onParsePathChange}></Input>
          </div>
          <div>
            <span>get path</span>
            <Input value={form.getPath} onChange={onGetPathChange}></Input>
          </div>
        </div>
      </div>
      <div className="text-center my-5">
        <Button type="primary" onClick={handleParse}> Parse </Button>
        <Button onClick={handleClear} className="ml-4"> Clear </Button>
      </div>
      <RJV src={jsonStr} iconStyle="circle" collapsed={4} displayDataTypes={false} name={null}/>
    </div>
  }
}