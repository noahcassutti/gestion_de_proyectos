export function generarArchivoCsv(
  encabezados: string[],
  filas: any[][],
): string {
  const filasFormateadas = filas.map((fila) => {
    const celdasProcesadas = fila.map((celda) => {
      if (celda === null || celda === undefined || celda === '') {
        return '"N/A"';
      }

      const celdaString = String(celda).replace(/"/g, '""');
      return `"${celdaString}"`;
    });

    return celdasProcesadas.join(',');
  });

  return '\uFEFF' + [encabezados.join(','), ...filasFormateadas].join('\n');
}
