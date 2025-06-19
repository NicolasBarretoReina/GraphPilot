import sys
import pandas as pd
import numpy as np
from sqlalchemy import create_engine

# Conexión a MySQL
user = 'root'
password = ''
host = 'localhost'
port = '3306'
database = 'automaticGraphics'
engine = create_engine(f'mysql+pymysql://{user}:{password}@{host}:{port}/{database}')

# Leer archivo Excel desde argumento
archivo = sys.argv[1]
excel = pd.ExcelFile(archivo)

tabla_contador = 1

def limpiar_columnas(fila):
    columnas = []
    for i, val in enumerate(fila):
        if pd.isna(val) or str(val).strip() == '':
            columnas.append(f'columna_{i}')
        else:
            columnas.append(str(val).strip().replace(" ", "_"))
    # Evita duplicados
    columnas_unicas = []
    usados = {}
    for col in columnas:
        if col in usados:
            usados[col] += 1
            col = f"{col}_{usados[col]}"
        else:
            usados[col] = 0
        columnas_unicas.append(col)
    return columnas_unicas

def es_fila_valida(fila):
    no_nulos = fila.dropna()
    return len(no_nulos) >= 2

for nombre_hoja in excel.sheet_names:
    print(f"\nProcesando hoja: {nombre_hoja}")
    hoja = excel.parse(nombre_hoja, header=None)

    fila_inicio = None
    for i, fila in hoja.iterrows():
        if es_fila_valida(fila):
            if fila_inicio is None:
                fila_inicio = i
        elif fila_inicio is not None:
            bloque = hoja.iloc[fila_inicio:i].dropna(how='all')
            if len(bloque) < 2:
                fila_inicio = None
                continue

            encabezado = limpiar_columnas(bloque.iloc[0])
            datos = bloque.iloc[1:]
            datos.columns = encabezado
            datos = datos.dropna(axis=1, how='all')  # 💡 Eliminar columnas completamente vacías

            tabla_nombre = f"{nombre_hoja.lower().replace(' ', '_')}_bloque{tabla_contador}"
            print(f"Insertando en tabla: {tabla_nombre}")
            datos.to_sql(tabla_nombre, engine, index=False, if_exists='replace')

            tabla_contador += 1
            fila_inicio = None

    # Último bloque si existe
    if fila_inicio is not None:
        bloque = hoja.iloc[fila_inicio:].dropna(how='all')
        if len(bloque) >= 2:
            encabezado = limpiar_columnas(bloque.iloc[0])
            datos = bloque.iloc[1:]
            datos.columns = encabezado
            datos = datos.dropna(axis=1, how='all')  # 💡 También aquí

            tabla_nombre = f"{nombre_hoja.lower().replace(' ', '_')}_bloque{tabla_contador}"
            print(f"Insertando en tabla: {tabla_nombre}")
            datos.to_sql(tabla_nombre, engine, index=False, if_exists='replace')

            tabla_contador += 1

print("\n Procesamiento completado.")