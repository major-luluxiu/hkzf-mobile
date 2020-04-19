import React from 'react'

// 样式
import './index.scss'

class MyMap extends React.Component {
  render() {
    return <div className="map" id="map"></div>
  }

  componentDidMount() {
    // 创建百度地图
    var map = new window.BMap.Map('map')
    // 设置地图中心点
    var point = new window.BMap.Point(121.61895125119062, 31.040452304898167)
    // 初始化
    map.centerAndZoom(point, 15)
  }
}

export default MyMap
