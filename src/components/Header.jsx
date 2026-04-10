function Header({ variant = "hero" }) {

  return (

    <header className={variant === "compact" ? "header--compact" : "header--hero"}>
         <h1>ADMINISTRACION DE TIQUETES - SAN PEDRO</h1>
    </header>

  )
}

export default Header