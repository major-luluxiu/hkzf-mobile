import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

// antd-mobile
import { TabBar } from 'antd-mobile'

// 子组件
import Index from './Index/index.js'
import House from './House'
import News from './News'
import Profile from './Profile'
import NoMatch from '../NoMatch'

// 样式
import './index.scss'

// 标签栏数据
const tabItemList = [
  {
    title: '首页',
    key: '首页',
    icon: 'iconfont icon-ind',
    selectedIcon: 'iconfont icon-ind',
    selected: '/home/index',
    onPress: {
      selected: '/home/index',
      route: '/home/index',
    },
  },
  {
    title: '找房',
    key: '找房',
    icon: 'iconfont icon-findHouse',
    selectedIcon: 'iconfont icon-findHouse',
    selected: '/home/house',
    onPress: {
      selected: '/home/house',
      route: '/home/house',
    },
  },
  {
    title: '资讯',
    key: '资讯',
    icon: 'iconfont icon-infom',
    selectedIcon: 'iconfont icon-infom',
    selected: '/home/news',
    onPress: {
      selected: '/home/news',
      route: '/home/news',
    },
  },
  {
    title: '我的',
    key: '我的',
    icon: 'iconfont icon-my',
    selectedIcon: 'iconfont icon-my',
    selected: '/home/profile',
    onPress: {
      selected: '/home/profile',
      route: '/home/profile',
    },
  },
]

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: this.props.location.pathname,
    }
  }
  render() {
    return (
      <div className="home">
        <div className="tabBar">
          <TabBar
            // 未选中的字体颜色
            unselectedTintColor="#949494"
            // 点击的字体颜色
            tintColor="#33A3F4"
            // 背景色
            barTintColor="pink"
          >
            {tabItemList.map((item) => (
              <TabBar.Item
                title={item.title}
                key={item.key}
                icon={<span className={`iconfont ${item.icon}`}></span>}
                selectedIcon={
                  <span className={`iconfont$ ${item.selectedIcon}`}></span>
                }
                selected={this.state.selectedTab === item.selected}
                onPress={() => {
                  this.setState({
                    selectedTab: item.onPress.selected,
                  })
                  // 点击跳转路由
                  this.props.history.push(item.onPress.route)
                }}
              ></TabBar.Item>
            ))}
          </TabBar>
        </div>
        {/* 嵌套路由配置 */}
        <Switch>
          <Redirect exact from="/home" to="/home/index"></Redirect>
          <Route path="/home/index" component={Index}></Route>
          <Route path="/home/house" component={House}></Route>
          <Route path="/home/news" component={News}></Route>
          <Route path="/home/profile" component={Profile}></Route>
          <Route component={NoMatch}></Route>
        </Switch>
      </div>
    )
  }

  // 地址更新修改高亮
  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.setState({
        selectedTab: this.props.location.pathname,
      })
    }
  }
}

export default Home
