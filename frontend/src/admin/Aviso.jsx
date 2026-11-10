function Aviso({ texto }) {
  if (!texto) return null
  return (
    <p className="aviso" role="status">
      {texto}
    </p>
  )
}

export default Aviso
