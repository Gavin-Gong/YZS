import React from "react";
import RJV from "react-json-view";
import './JsonViewer.scss';
import { Button } from "antd"

export default class JsonViewer extends React.Component {
  render() {
    return <div className="json-viewer">
      <div className="input mt-1 m-1">
        <Button> 转化 </Button>
      </div>
      <RJV />
    </div>
  }
}