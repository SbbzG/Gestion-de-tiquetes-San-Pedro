import Header from "../components/Header"
import Footer from "../components/Footer"

function AppLayout({ headerVariant = "compact", children }) {
  return (
    <>
      <Header variant={headerVariant} />
      {children}
      <Footer />
    </>
  )
}

export default AppLayout

