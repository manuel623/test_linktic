using System;

namespace sistema_reservas_backend.Models
{
    public class Servicio
    {
        public int Id { get; set; }
        public string? Nombre { get; set; }
        public string? Descripcion { get; set; }
        public decimal? Precio { get; set; }
    }

}
