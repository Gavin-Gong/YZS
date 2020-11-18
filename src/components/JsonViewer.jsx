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
    console.log()
    console.log(form)
    try {
      let obj = JSON.parse(form.jsonStr)
      if (form.parsePath && form.parsePath.trim()) {
        let str = _.get(obj, form.parsePath)
        let subObj = JSON.parse(str)
        _.set(obj, form.parsePath,  subObj)
        console.log(obj)
        this.setState({
          jsonStr: _.get(obj, form.getPath, {})
        })
      }
    } catch (error) {
      message.error(error.message)
    }
  }
  render() {
    const { onInputChange, onParsePathChange, onGetPathChange, handleParse } = this
    const { form, jsonStr } = this.state
    return <div className="json-viewer p-8">
      <div className="flex">
        <TextArea value={form.jsonStr} onInput={onInputChange} rows={10} className="mr-5" style={{width: '70%'}}/>
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
      </div>
      <RJV src={jsonStr} iconStyle="circle" collapsed={4} displayDataTypes={false}/>
    </div>
  }
}