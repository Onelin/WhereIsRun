import { Layout, Menu } from 'antd';
import { UploadOutlined, UserOutlined, VideoCameraOutlined, ToolTwoTone } from '@ant-design/icons';
import React, { useState } from 'react';
import ClassNames from 'classnames';
import Image from '../images/小红脸蛋儿.jpg'

import '../styles/sider.less'

const { Sider } = Layout;

const SiderComponet = () => {
  const [isShowTitle, setShowTitle] = useState(true);
  const [message, setMessage] = useState('');
  return (
    <Sider
        breakpoint="lg"
        collapsible={true}
        onCollapse={(collapsed: any, type: any) => {
          console.log(collapsed, type);
          setShowTitle(!isShowTitle)
        }}
      >
        <div className={ClassNames("logo", { 'jc': !isShowTitle })}>
          {<span className={ClassNames({ 'ml-6': isShowTitle })}>{React.createElement(ToolTwoTone)}</span>}
          {isShowTitle && <span className={ClassNames({ 'title': isShowTitle })}>王哪儿跑</span>}
          <img src={Image} width={30} height={30} onClick={() => {
            //测试动态 import 代码切割
            import('../utils/common').then((text: any) => {
              setMessage(text.default());
            })
          }} alt="" />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['4']}
          items={[UserOutlined, VideoCameraOutlined, UploadOutlined, UserOutlined].map(
            (icon: any, index: number) => ({
              key: String(index + 1),
              icon: React.createElement(icon),
              label: `nav ${index + 1}`,
            }),
          )}
        />
    </Sider>
  )
}

export default SiderComponet