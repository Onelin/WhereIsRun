
import { Layout } from 'antd'

import Sider from '../layouts/sider'
import Header from '../layouts/header'
import Container from '../layouts/container'
import Footer from '../layouts/footer'

export default () => (
  <Layout style={{ minHeight: '100vh' }}>
    <Sider />
    <Layout>
      <Header />
      <Container />
      <Footer />
    </Layout>
  </Layout>
)