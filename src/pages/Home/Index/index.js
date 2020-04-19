import React from 'react'
import { Carousel, Flex, Grid } from 'antd-mobile'
import axios from 'axios'
import Nav1 from 'assets/images/nav-1.png'
import Nav2 from 'assets/images/nav-2.png'
import Nav3 from 'assets/images/nav-3.png'
import Nav4 from 'assets/images/nav-4.png'

// 样式导入
import './index.scss'

// 导航的数据
const navList = [
  { title: '整租', img: Nav1, path: '/home/house' },
  { title: '合租', img: Nav2, path: '/home/house' },
  { title: '地图找房', img: Nav3, path: '/map' },
  { title: '去出租', img: Nav4, path: '/rent' },
]

class Index extends React.Component {
  state = {
    // 轮播图
    carouselList: [],
    // 轮播图默认高度
    imgHeight: (212 / 375) * window.innerWidth,
    // 租房小组
    groupList: [],
    // 资讯
    newsList: [],
    myCity: {
      label: '北京',
      value: '',
    },
  }
  render() {
    return (
      <div className="index">
        {/* 给carousel包个容器 并把默认高度给这个容器 这样就不会出现抖动的现象 */}
        <div style={{ height: this.state.imgHeight }} className="carousel">
          {/* 渲染轮播图 */}
          {this.renderCarousel()}
          {/* 渲染搜索功能 */}
          <div className="search">{this.renderSearch()}</div>
        </div>
        {/* 导航菜单 */}
        <div className="nav">{this.renderNav()}</div>
        {/* 租房小组 */}
        <div className="group">{this.renderGroup()} </div>
        {/* 最新资讯 */}
        <div className="message">{this.renderNews()}</div>
      </div>
    )
  }

  // dom挂载钩子
  componentDidMount() {
    // 获取轮播图
    this.getCarousel()

    // 获取定位
    var myCity = new window.BMap.LocalCity()
    myCity.get(async (result) => {
      const res = await axios.get('http://localhost:8080/area/info', {
        params: {
          name: result.name,
        },
      })
      const { body, status } = res.data

      if (status === 200) {
        this.setState(
          {
            myCity: body,
          },
          () => {
            // 获取到定位的地址后再获取小组信息和资讯
            // 租房小组
            this.getGroup()
            // 最新资讯
            this.getNews()
          }
        )
      }
    })
  }

  // 获取轮播图
  async getCarousel() {
    const res = await axios.get('http://localhost:8080/home/swiper')
    const { body, status } = res.data
    if (status === 200) {
      this.setState({
        carouselList: body,
      })
    }
  }

  // 渲染轮播图
  renderCarousel() {
    if (this.state.carouselList.length === 0) {
      return null
    } else {
      return (
        <Carousel
          // 自动播放
          autoplay={true}
          // 无线循环
          infinite={true}
          // 切换间隔
          autoplayInterval={1800}
          // 图片切换前会显示来自哪里要到何处
          // beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
          // 切换成功后显示到了哪里
          // afterChange={(index) => console.log('slide to', index)}
        >
          {this.state.carouselList.map((item) => (
            <a
              key={item.id}
              href="http://www.alipay.com"
              style={{
                display: 'inline-block',
                width: '100%',
              }}
            >
              <img
                src={`http://localhost:8080${item.imgSrc}`}
                alt={item.alt}
                style={{ width: '100%', verticalAlign: 'top' }}
                onLoad={() => {
                  // fire window resize event to change height
                  window.dispatchEvent(new Event('resize'))
                  this.setState({ imgHeight: 'auto' })
                }}
              />
            </a>
          ))}
        </Carousel>
      )
    }
  }

  // 获取租房小组
  async getGroup() {
    const res = await axios.get('http://localhost:8080/home/groups', {
      params: {
        area: this.state.myCity.value,
      },
    })
    const { status, body } = res.data
    if (status === 200) {
      this.setState({
        groupList: body,
      })
    }
  }
  // 渲染租房小组
  renderGroup() {
    return (
      <>
        {/* 标题 */}
        <h4 className="group-title">
          租房小组
          <span className="more">更多</span>
        </h4>
        {/* 内容 */}
        <div className="content">
          <Grid
            data={this.state.groupList}
            columnNum={2}
            square={false}
            hasLine={false}
            renderItem={(el) => (
              <Flex className="group-item" justify="around">
                <div className="desc">
                  <p className="title">{el.title}</p>
                  <span className="info">{el.desc} </span>
                </div>
                <img src={'http://localhost:8080' + el.imgSrc} alt="" />
              </Flex>
            )}
          />
        </div>
      </>
    )
  }
  // 渲染导航条
  renderNav() {
    return (
      <Flex>
        {navList.map((item) => (
          <Flex.Item
            key={item.title}
            onClick={() => {
              this.props.history.push(item.path)
            }}
          >
            <img src={item.img} alt="" />
            <p>{item.title}</p>
          </Flex.Item>
        ))}
      </Flex>
    )
  }
  // 获取资讯
  async getNews() {
    const res = await axios.get('http://localhost:8080/home/news', {
      params: {
        area: this.state.myCity.value,
      },
    })
    const { status, body } = res.data
    if (status === 200) {
      this.setState({
        newsList: body,
      })
    }
  }
  // 渲染资讯
  renderNews() {
    return (
      <>
        <h3 className="group-title">最新资讯</h3>
        {this.state.newsList.map((item) => (
          <div className="news-item" key={item.id}>
            <div className="imgwrap">
              <img
                className="img"
                src={'http://localhost:8080' + item.imgSrc}
                alt=""
              />
            </div>
            <Flex className="content" direction="column" justify="between">
              <h3 className="title">{item.title}</h3>
              <Flex className="info" justify="between">
                <span>{item.from}</span>
                <span>{item.date}</span>
              </Flex>
            </Flex>
          </div>
        ))}
      </>
    )
  }

  // 渲染搜索功能
  renderSearch() {
    return (
      <Flex className="search-box">
        <Flex className="search-form">
          <div
            className="location"
            onClick={() => this.props.history.push('/city')}
          >
            <span className="name">{this.state.myCity.label}</span>
            <i className="iconfont icon-arrow"> </i>
          </div>
          <div className="search-input">
            <i className="iconfont icon-seach" />
            <span className="text">请输入小区地址</span>
          </div>
        </Flex>
        {/* 地图小图标 */}
        <i
          className="iconfont icon-map"
          onClick={() => this.props.history.push('/map')}
        />
      </Flex>
    )
  }
}

export default Index
