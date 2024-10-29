using System;
using System.Collections.Generic;

namespace sistema_reservas_backend.Models
{
    public class Cliente
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty; 
        public string Email { get; set; } = string.Empty; 
        public string Telefono { get; set; } = string.Empty; 
        public DateTime FechaRegistro { get; set; } = DateTime.Now;

        public List<Reserva> Reservas { get; set; } = new List<Reserva>();
    }
}
