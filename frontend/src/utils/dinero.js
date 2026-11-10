// Convierte un número en un precio con dos decimales: 2.5 -> "$2.50".
export const dinero = (numero) => `$${Number(numero).toFixed(2)}`
