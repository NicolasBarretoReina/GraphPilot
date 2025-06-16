import sys
import pandas as pd
from sqlalchemy import create_engine, inspect
import numpy as np
from collections import Counter

# Configura la conexión a tu base de datos MySQL
user = 'root'
password = ''
host = 'localhost'
port = '3306'
database = 'automaticGraphics'

engine = create_engine(f'mysql+pymysql://{user}:{password}@{host}:{port}/{database}')
inspector = inspect(engine)

# Cargar el archivo Excel
archivo = sys.argv[1]
xlsx = pd.ExcelFile(archivo)

tabla_contador = 1

def limpiar_y_unificar_columnas(columnas):
    # Reemplaza NaN o vacíos por nombres genéricos y elimina espacios
    columnas = [f"columna_{i}" if pd.isna(c) or str(c).strip() == "" else str(c).strip().replace(" ", "_") for i, c in enumerate(columnas)]
    
    # Garantiza nombres únicos
    contador = Counter()
    columnas_unicas = []
    for col in columnas:
        if contador[col]:
            nuevo = f"{col}_{contador[col]}"
        else:
            nuevo = col
        columnas_unicas.append(nuevo)
        contador[col] += 1
    return columnas_unicas

# Procesar cada hoja
for nombre_hoja in xlsx.sheet_names:
    print(f"Procesando hoja: {nombre_hoja}")
    hoja = xlsx.parse(nombre_hoja, header=None)

    fila_inicio = None
    for i, fila in hoja.iterrows():
        if fila.notna().sum() >= 2:  # Considera un bloque si hay al menos 2 celdas no vacías
            if fila_inicio is None:
                fila_inicio = i
        elif fila_inicio is not None:
            # Fin del bloque de datos
            bloque = hoja.iloc[fila_inicio:i].dropna(how='all')
            fila_inicio = None

            if len(bloque) < 2:
                continue  # No hay suficientes filas para encabezado + datos

            bloque.columns = limpiar_y_unificar_columnas(bloque.iloc[0])
            bloque = bloque[1:]

            if bloque.empty:
                continue

            tabla_nombre = f"{nombre_hoja.lower().replace(' ', '_')}_bloque{tabla_contador}"
            tabla_contador += 1

            print(f"Inserción en tabla: {tabla_nombre}")

            # Verificar si la tabla existe
            tablas_existentes = inspector.get_table_names()
            if tabla_nombre not in tablas_existentes:
                bloque.to_sql(tabla_nombre, engine, index=False, if_exists='replace')
            else:
                with engine.begin() as conn:
                    for _, fila in bloque.iterrows():
                        condiciones = []
                        for col in bloque.columns:
                            if col.lower() in ['id', 'nDocumento', 'codigo']:
                                condiciones.append(f"{col} = '{fila[col]}'")

                        if condiciones:
                            condicion = " AND ".join(condiciones)
                            consulta = f"SELECT * FROM {tabla_nombre} WHERE {condicion}"
                            existe = pd.read_sql(consulta, engine)

                            if existe.empty:
                                fila.to_frame().T.to_sql(tabla_nombre, engine, index=False, if_exists='append')
                            else:
                                cambios = {}
                                for col in bloque.columns:
                                    if str(fila[col]) != str(existe.iloc[0][col]):
                                        cambios[col] = fila[col]
                                if cambios:
                                    set_clause = ", ".join([f"{k} = '{v}'" for k, v in cambios.items()])
                                    update = f"UPDATE {tabla_nombre} SET {set_clause} WHERE {condicion}"
                                    conn.execute(update)

    # Si quedó un bloque sin cerrar
    if fila_inicio is not None:
        bloque = hoja.iloc[fila_inicio:].dropna(how='all')
        if len(bloque) >= 2:
            bloque.columns = limpiar_y_unificar_columnas(bloque.iloc[0])
            bloque = bloque[1:]
            if not bloque.empty:
                tabla_nombre = f"{nombre_hoja.lower().replace(' ', '_')}_bloque{tabla_contador}"
                tabla_contador += 1
                bloque.to_sql(tabla_nombre, engine, index=False, if_exists='replace')

print("Procesamiento completado.")