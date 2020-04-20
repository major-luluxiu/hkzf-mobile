import React from 'react'
import { NavBar, Icon, Toast } from 'antd-mobile'
import axios from 'axios'
import { getCurrentCity, setCity } from 'utils/city'
import { List, AutoSizer } from 'react-virtualized'

import 'react-virtualized/styles.css'
import './index.scss'

// 包含再热门城市中的才能点击
const HOT = ['北京', '上海', '广州', '深圳']

class City extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cityObj: {},
      cityOrder: [],
      currentLight: 0,
    }
    this.listRef = React.createRef()
  }
  render() {
    return (
      <div className="city-list">
        {/* 头部 */}
        <NavBar
          mode="dark"
          icon={<Icon type="left" />}
          onLeftClick={() => this.props.history.go(-1)}
        >
          城市
        </NavBar>
        {/* 长列表 */}
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              rowCount={this.state.cityOrder.length}
              rowHeight={this.caclHeight.bind(this)}
              rowRenderer={this.rowRenderer.bind(this)}
              width={width}
              onRowsRendered={this.onRowsRendered.bind(this)}
              ref={this.listRef}
              scrollToAlignment="start"
            />
          )}
        </AutoSizer>
        {/* 右侧索引条 */}
        <ul className="city-index">
          {this.state.cityOrder.map((item, index) => (
            <li
              className="city-index-item"
              key={item}
              onClick={this.showCity.bind(this, index)}
            >
              <span
                className={
                  index === this.state.currentLight ? 'index-active' : ''
                }
              >
                {item === 'hot' ? '热' : item.toUpperCase()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  componentDidMount() {
    this.getCitys()
  }

  // 获取城市列表
  async getCitys() {
    const res = await axios.get('http://localhost:8080/area/city?level=1')
    const { body, status } = res.data
    if (status === 200) {
      const { cityObj, cityOrder } = this.parseCity(body)

      // 添加热门城市
      const hots = await axios.get('http://localhost:8080/area/hot')
      cityOrder.unshift('hot')
      cityObj.hot = hots.data.body

      // 处理当前定位城市,优先从本地获取
      cityOrder.unshift('#')
      const city = await getCurrentCity()
      cityObj['#'] = [city]
      this.setState(
        {
          cityObj,
          cityOrder,
        },
        () => this.listRef.current.measureAllRows()
      )
    }
  }

  // 城市数据处理
  parseCity(body) {
    const cityObj = {}

    body.forEach((item) => {
      const short = item.short.slice(0, 1)
      if (short in cityObj) {
        cityObj[short].push(item)
      } else {
        cityObj[short] = [item]
      }
    })

    // 得到城市的首字母
    const cityOrder = Object.keys(cityObj).sort()
    // 将结果返回
    return {
      cityObj,
      cityOrder,
    }
  }

  //渲染列表
  rowRenderer({ key, index, style }) {
    // 把要渲染的数据剔出来
    const short = this.state.cityOrder[index]
    const citys = this.state.cityObj[short]

    return (
      <div key={key} style={style} className="city-item">
        <div className="title">{this.parseShort(short)} </div>
        {citys.map((item) => (
          <div
            key={item.value}
            className="name"
            onClick={this.clickCity.bind(this, item)}
          >
            {item.label}
          </div>
        ))}
      </div>
    )
  }

  // 城市首字母的转换
  parseShort(short) {
    if (short === '#') {
      return '当前定位'
    } else if (short === 'hot') {
      return '热门城市'
    } else {
      return short.toUpperCase()
    }
  }

  // 动态计算每一行的高度
  caclHeight({ index }) {
    const title = this.state.cityOrder[index]
    const city = this.state.cityObj[title]
    return 36 + city.length * 50
  }

  // 滑动时对应的索引高亮, 每次滚动都会执行 为了性能 只有让startIndex变化时才更新state
  onRowsRendered({ startIndex }) {
    if (startIndex !== this.state.currentLight) {
      this.setState({
        currentLight: startIndex,
      })
    }
  }

  // 点击索引 对应的城市跳到顶部 需要调用list组件的方法
  showCity(index) {
    this.listRef.current.scrollToRow(index)
  }

  // 点击城市 保存本地并跳转回首页
  clickCity(city) {
    if (HOT.includes(city.label)) {
      setCity(city)
      this.props.history.go(-1)
    } else {
      Toast.info('该城市目前没有房源')
    }
  }
}

export default City
