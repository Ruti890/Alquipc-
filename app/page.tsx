"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calculator, FileText, User, Phone, Mail, Calendar, Monitor } from "lucide-react"

const PRECIO_DIA = 35000

interface ClientData {
  nombre: string
  idCliente: string
  telefono: string
  email: string
  servicio: number
  equipos: number
  diasIniciales: number
  diasAdicionales: number
}

interface FacturaData {
  valorInicial: number
  valorAdicional: number
  incrementoDomicilio: number
  descuentoEstablecimiento: number
  total: number
}

export default function AlquipcDashboard() {
  const [clientData, setClientData] = useState<ClientData>({
    nombre: "",
    idCliente: "",
    telefono: "",
    email: "",
    servicio: 0,
    equipos: 2,
    diasIniciales: 1,
    diasAdicionales: 0,
  })

  const [factura, setFactura] = useState<FacturaData | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const servicios = {
    1: "Dentro de la Ciudad",
    2: "Fuera de la Ciudad",
    3: "Dentro del Establecimiento",
  }
const validarNombre = (nombre: string) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombre.trim())
const validarTelefono = (telefono: string) => /^\d{10}$/.test(telefono)
const validarEmail = (email: string) => /^[\w.-]+@[\w.-]+\.\w+$/.test(email)

const formatearMoneda = (valor: number) => {
  return `$${valor.toLocaleString("es-CO")}`
}

const calcularFactura = () => {
  const newErrors: Record<string, string> = {}

  if (!validarNombre(clientData.nombre)) {
    newErrors.nombre = "El nombre no puede estar vacío ni contener números"
  }
  if (!clientData.idCliente || !clientData.idCliente.match(/^\d+$/)) {
    newErrors.idCliente = "El ID debe ser numérico"
  }
  if (!validarTelefono(clientData.telefono)) {
    newErrors.telefono = "El teléfono debe tener 10 dígitos"
  }
  if (!validarEmail(clientData.email)) {
    newErrors.email = "Email inválido"
  }
  if (clientData.servicio === 0) {
    newErrors.servicio = "Seleccione un tipo de servicio"
  }
  if (clientData.equipos < 2) {
    newErrors.equipos = "Mínimo 2 equipos"
  }
  if (clientData.diasIniciales < 1) {
    newErrors.diasIniciales = "Mínimo 1 día"
  }

  setErrors(newErrors)

  if (Object.keys(newErrors).length > 0) {
    return
  }

  const valorInicial = clientData.equipos * clientData.diasIniciales * PRECIO_DIA

  // Usar valor estándar de 3500 para días adicionales
  let valorAdicional = clientData.equipos * clientData.diasAdicionales * 3500

  // Descuento 2% en días adicionales
  const descuentoAdicional = valorAdicional * 0.02
  valorAdicional -= descuentoAdicional

  let incrementoDomicilio = 0
  let descuentoEstablecimiento = 0

  if (clientData.servicio === 2) {
    // Fuera de la ciudad
    incrementoDomicilio = (valorInicial + valorAdicional) * 0.05
  } else if (clientData.servicio === 3) {
    // Dentro del establecimiento
    descuentoEstablecimiento = (valorInicial + valorAdicional) * 0.05
  }

  const total = valorInicial + valorAdicional + incrementoDomicilio - descuentoEstablecimiento

  setFactura({
    valorInicial,
    valorAdicional,
    incrementoDomicilio,
    descuentoEstablecimiento,
    total,
  })
}

  const limpiarFormulario = () => {
    setClientData({
      nombre: "",
      idCliente: "",
      telefono: "",
      email: "",
      servicio: 0,
      equipos: 2,
      diasIniciales: 1,
      diasAdicionales: 0,
    })
    setFactura(null)
    setErrors({})
  }

  return (
    <div className="dark min-h-screen bg-gradient-to-br from-primary/5 via-black to-chart-2/5 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <Monitor className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
              ALQUIPC
            </h1>
          </div>
          <p className="text-black text-lg font-medium">Sistema de Facturación para Alquiler de Equipos</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario de Cliente */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <span className="text-black">Datos del Cliente</span>
              </CardTitle>
              <CardDescription className="text-black">
                Ingrese la información del cliente y detalles del alquiler
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre" className="text-black">
                    Nombre Cliente
                  </Label>
                  <Input
                    id="nombre"
                    value={clientData.nombre}
                    onChange={(e) => setClientData({ ...clientData, nombre: e.target.value })}
                    className={errors.nombre ? "border-destructive" : ""}
                  />
                  {errors.nombre && <p className="text-sm text-destructive">{errors.nombre}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idCliente" className="text-black">
                    ID Cliente
                  </Label>
                  <Input
                    id="idCliente"
                    value={clientData.idCliente}
                    onChange={(e) => setClientData({ ...clientData, idCliente: e.target.value })}
                    className={errors.idCliente ? "border-destructive" : ""}
                  />
                  {errors.idCliente && <p className="text-sm text-destructive">{errors.idCliente}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefono" className="flex items-center gap-2 text-black">
                    <Phone className="h-4 w-4" />
                    Teléfono
                  </Label>
                  <Input
                    id="telefono"
                    value={clientData.telefono}
                    onChange={(e) => setClientData({ ...clientData, telefono: e.target.value })}
                    className={errors.telefono ? "border-destructive" : ""}
                    placeholder="3001234567"
                  />
                  {errors.telefono && <p className="text-sm text-destructive">{errors.telefono}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-black">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={clientData.email}
                    onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                    className={errors.email ? "border-destructive" : ""}
                    placeholder="cliente@email.com"
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-black">Detalles del Servicio</h3>

                <div className="space-y-2">
                  <Label htmlFor="servicio" className="text-black">
                    Tipo de Servicio
                  </Label>
                  <Select
                    value={clientData.servicio.toString()}
                    onValueChange={(value) => setClientData({ ...clientData, servicio: Number.parseInt(value) })}
                  >
                    <SelectTrigger className={errors.servicio ? "border-destructive" : ""}>
                      <SelectValue placeholder="Seleccione el tipo de servicio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Dentro de la Ciudad</SelectItem>
                      <SelectItem value="2">Fuera de la Ciudad (+5%)</SelectItem>
                      <SelectItem value="3">Dentro del Establecimiento (-5%)</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.servicio && <p className="text-sm text-destructive">{errors.servicio}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="equipos" className="text-black">
                      Equipos
                    </Label>
                    <Input
                      id="equipos"
                      type="number"
                      min="2"
                      value={clientData.equipos}
                      onChange={(e) => setClientData({ ...clientData, equipos: Number.parseInt(e.target.value) || 2 })}
                      className={errors.equipos ? "border-destructive" : ""}
                    />
                    {errors.equipos && <p className="text-sm text-destructive">{errors.equipos}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diasIniciales" className="flex items-center gap-2 text-black">
                      <Calendar className="h-4 w-4" />
                      Días Iniciales
                    </Label>
                    <Input
                      id="diasIniciales"
                      type="number"
                      min="1"
                      value={clientData.diasIniciales}
                      onChange={(e) =>
                        setClientData({ ...clientData, diasIniciales: Number.parseInt(e.target.value) || 1 })
                      }
                      className={errors.diasIniciales ? "border-destructive" : ""}
                    />
                    {errors.diasIniciales && <p className="text-sm text-destructive">{errors.diasIniciales}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diasAdicionales" className="text-black">
                      Días Adicionales
                    </Label>
                    <Input
                      id="diasAdicionales"
                      type="number"
                      min="0"
                      value={clientData.diasAdicionales}
                      onChange={(e) =>
                        setClientData({ ...clientData, diasAdicionales: Number.parseInt(e.target.value) || 0 })
                      }
                    />
                    <p className="text-xs text-white">Descuento 2% aplicado</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={calcularFactura} className="flex-1 flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Generar Factura
                </Button>
                <Button variant="outline" onClick={limpiarFormulario}>
                  Limpiar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Factura */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <span className="text-black">Factura Generada</span>
              </CardTitle>
              <CardDescription className="text-black">Resumen detallado del alquiler y costos</CardDescription>
            </CardHeader>
            <CardContent>
              {factura ? (
                <div className="space-y-6">
                  {/* Información del Cliente */}
                  <div className="bg-gradient-to-r from-primary to-chart-2 p-4 rounded-lg">
                    <div className="bg-black/80 backdrop-blur-sm p-4 rounded-lg space-y-3">
                      <div className="text-center">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                          ALQUIPC
                        </h2>
                        <p className="text-sm text-white">Factura de Alquiler</p>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-white">Cliente:</p>
                          <p className="text-white">{clientData.nombre}</p>
                        </div>
                        <div>
                          <p className="font-medium text-white">ID:</p>
                          <p className="text-white">{clientData.idCliente}</p>
                        </div>
                        <div>
                          <p className="font-medium text-white">Teléfono:</p>
                          <p className="text-white">{clientData.telefono}</p>
                        </div>
                        <div>
                          <p className="font-medium text-white">Email:</p>
                          <p className="text-white break-all">{clientData.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detalles del Servicio */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-black">Tipo de Servicio:</span>
                      <Badge variant="secondary">{servicios[clientData.servicio as keyof typeof servicios]}</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-medium text-black">Equipos:</span>
                      <span className="text-black">{clientData.equipos}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Cálculos */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-black">Valor Alquiler ({clientData.diasIniciales} días):</span>
                      <span className="font-mono text-black">{formatearMoneda(factura.valorInicial)}</span>
                    </div>

                    {clientData.diasAdicionales > 0 && (
                      <div className="flex justify-between">
                        <span className="text-black">Días Adicionales ({clientData.diasAdicionales}) con 2% desc:</span>
                        <span className="font-mono text-black">{formatearMoneda(factura.valorAdicional)}</span>
                      </div>
                    )}

                    {factura.incrementoDomicilio > 0 && (
                      <div className="flex justify-between text-black">
                        <span>Valor del Domicilio (+5%):</span>
                        <span className="font-mono">+{formatearMoneda(factura.incrementoDomicilio)}</span>
                      </div>
                    )}

                    {factura.descuentoEstablecimiento > 0 && (
                      <div className="flex justify-between text-black">
                        <span>Descuento Establecimiento (-5%):</span>
                        <span className="font-mono">-{formatearMoneda(factura.descuentoEstablecimiento)}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Total */}
                  <div className="bg-gradient-to-r from-primary to-chart-2 p-4 rounded-lg">
                    <div className="bg-black/80 backdrop-blur-sm p-4 rounded-lg">
                      <div className="flex justify-between items-center text-xl font-bold">
                        <span className="text-white">TOTAL A PAGAR:</span>
                        <span className="text-white font-mono">{formatearMoneda(factura.total)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-sm text-black">
                    <p>Factura generada por ALQUIPC</p>
                    <p>Gracias por utilizar nuestros servicios</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-black">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Complete el formulario y haga clic en "Generar Factura"</p>
                  <p className="text-sm mt-2">para ver el resumen detallado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                  <Calculator className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-black">Precio por Día</p>
                  <p className="text-2xl font-bold text-black">{formatearMoneda(PRECIO_DIA)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-chart-2/10 border border-chart-2/20">
                  <Monitor className="h-6 w-6 text-chart-2" />
                </div>
                <div>
                  <p className="text-sm text-black">Equipos Mínimos</p>
                  <p className="text-2xl font-bold text-black">2</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-chart-3/10 border border-chart-3/20">
                  <FileText className="h-6 w-6 text-chart-3" />
                </div>
                <div>
                  <p className="text-sm text-black">Descuento Días Extra</p>
                  <p className="text-2xl font-bold text-black">2%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
