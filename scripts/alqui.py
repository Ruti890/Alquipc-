import re
import sys
import traceback
from pathlib import Path
import datetime

PRECIO_DIA = 35000
OUTPUT_DIR = Path("salidas")
OUTPUT_DIR.mkdir(exist_ok=True)

def validar_nombre(nombre):
    return len(nombre.strip()) > 0

def validar_telefono(telefono):
    return telefono.isdigit() and len(telefono) == 10

def validar_email(email):
    patron = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(patron, email) is not None

def calcular_factura(servicio, equipos, dias_iniciales, dias_adicionales):
    valor_inicial = equipos * dias_iniciales * PRECIO_DIA
    valor_adicional = equipos * dias_adicionales * PRECIO_DIA

    # Descuento por días adicionales (2% sobre el total de días adicionales)
    descuento_adicional = valor_adicional * 0.02
    valor_adicional -= descuento_adicional

    incremento_domicilio = 0
    descuento_establecimiento = 0

    if servicio == 2:  # Fuera de la ciudad
        incremento_domicilio = (valor_inicial + valor_adicional) * 0.05
    elif servicio == 3:  # Dentro del establecimiento
        descuento_establecimiento = (valor_inicial + valor_adicional) * 0.05

    total = valor_inicial + valor_adicional + incremento_domicilio - descuento_establecimiento

    return valor_inicial, valor_adicional, incremento_domicilio, descuento_establecimiento, total

def formatear_moneda(valor):
    # Formato de miles con puntos (ej: $1.234.567)
    return "${:,.0f}".format(valor).replace(",", ".")

def main():
    print("\nBienvenido estimado cliente a 'ALQUIPC'")
    print("****************************************\n")

    # Entrada de datos
    while True:
        nombre = input("Nombre Cliente: ").strip()
        if validar_nombre(nombre):
            break
        print("WARNING: El nombre no puede estar vacío.")

    while True:
        id_cliente = input("Id Cliente: ").strip()
        if id_cliente.isdigit():
            id_cliente = int(id_cliente)
            break
        print("WARNING: El Id debe ser numérico.")

    while True:
        telefono = input("Teléfono Cliente : ").strip()
        if validar_telefono(telefono):
            break
        print("WARNING: El teléfono debe tener 10 dígitos numéricos.")

    while True:
        email = input("E-mail Cliente: ").strip()
        if validar_email(email):
            break
        print("WARNING: El correo no es válido. Formato ejemplo: usuario@dominio.com")

    print("\nTipos de servicios ofrecidos")
    print("[1] Dentro de la Ciudad")
    print("[2] Fuera de la Ciudad")
    print("[3] Dentro del Establecimiento")

    while True:
        try:
            servicio = int(input("Tipo de servicio tomado por el cliente: "))
            if servicio in [1, 2, 3]:
                break
            else:
                print("WARNING: Opción inválida. Ingrese 1, 2 o 3.")
        except ValueError:
            print("WARNING: Debe ingresar un número (1, 2 o 3).")

    while True:
        try:
            equipos = int(input("Número de equipos que desea alquilar  "))
            if equipos >= 2:
                break
            else:
                print("WARNING: Debe alquilar al menos 2 equipos.")
        except ValueError:
            print("WARNING: Debe ingresar un número válido.")

    while True:
        try:
            dias_iniciales = int(input("Número de días que desea tomar el alquiler: "))
            if dias_iniciales > 0:
                break
            else:
                print("WARNING: Debe ser mayor a 0.")
        except ValueError:
            print("WARNING: Debe ingresar un número válido.")

    while True:
        try:
            dias_adicionales = int(input("Número de días adicionales que toma el alquiler: "))
            if dias_adicionales >= 0:
                break
            else:
                print("WARNING: No puede ser negativo.")
        except ValueError:
            print("WARNING: Debe ingresar un número válido.")

    # Calcular factura
    valor_inicial, valor_adicional, inc_domicilio, desc_establecimiento, total = calcular_factura(
        servicio, equipos, dias_iniciales, dias_adicionales
    )

    servicios_txt = {1: "Dentro de la Ciudad", 2: "Fuera de la Ciudad", 3: "Dentro del Establecimiento"}

    print("\n---------------------------------------------")
    print("\t\t'ALQUIPC'")
    print("---------------------------------------------")
    print(f"Cliente: {nombre}")
    print(f"Id_Cliente: {id_cliente}")
    print(f"Teléfono: {telefono}")
    print(f"E-mail: {email}")
    print("---------------------------------------------")
    print(f"Tipo de servicio: {servicios_txt[servicio]}")
    print(f"Número de Equipos: {equipos}")
    print(f"No. de Días Iniciales: {dias_iniciales}")
    print(f"Valor Alquiler: {formatear_moneda(valor_inicial)}")
    print(f"No. de Días adicionales: {dias_adicionales}")
    print(f"Valor Días adicionales (descontados 2%): {formatear_moneda(valor_adicional)}")
    if inc_domicilio > 0:
        print(f"Valor Domicilio (+5%): {formatear_moneda(inc_domicilio)}")
    if desc_establecimiento > 0:
        print(f"Descuento Establecimiento (-5%): {formatear_moneda(desc_establecimiento)}")
    print("---------------------------------------------")
    print(f"TOTAL A PAGAR: {formatear_moneda(total)}")
    print("---------------------------------------------")
    print("Factura generada por ALQUIPC")
    print("Gracias por utilizar nuestros servicios.\n")

if __name__ == "__main__":
    try:
        main()
    except Exception:
        # guardar log para inspección
        now = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        logfile = OUTPUT_DIR / f"error_{now}.log"
        with open(logfile, "w", encoding="utf-8") as fh:
            fh.write("TRACEBACK (most recent call last):\n")
            traceback.print_exc(file=fh)
        print("Ha ocurrido un error inesperado. Se guardó un registro en:", logfile)
    finally:
        # Evitar que la ventana .exe se cierre inmediatamente
        try:
            input("Presiona ENTER para salir...")
        except Exception:
            pass
