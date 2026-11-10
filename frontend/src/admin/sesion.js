// El token se guarda en sessionStorage: dura mientras la pestaña esté abierta.
const CLAVE = 'cactea_token'

export const obtenerToken = () => sessionStorage.getItem(CLAVE)
export const guardarToken = (token) => sessionStorage.setItem(CLAVE, token)
export const borrarToken = () => sessionStorage.removeItem(CLAVE)
