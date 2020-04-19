import React from 'react'
import { Link } from 'react-router-dom'
class NoMatch extends React.Component {
  render() {
    return (
      <div>
        哦豁! 网址不对哟 <Link to="/home">去首页看看嘛</Link>
      </div>
    )
  }
}

export default NoMatch
