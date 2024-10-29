using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace sistema_reservas_backend.Models
{
    public class Reserva
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Cliente")]
        public int ClienteId { get; set; }
        public Cliente? Cliente { get; set; } 

        [ForeignKey("Servicio")]
        public int ServicioId { get; set; }
        public Servicio? Servicio { get; set; }

        public DateTime FechaReserva { get; set; }

        public string Estado { get; set; } = string.Empty;
    }


}
