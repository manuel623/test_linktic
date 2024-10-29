using System;

namespace sistema_reservas_backend.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty; 
        public DateTime FechaCreacion { get; set; } = DateTime.Now;

        public Usuario(int id, string nombre, string email, string password) 
        {
            Id = id;
            Nombre = nombre;
            Email = email;
            Password = password;
            FechaCreacion = DateTime.Now;
        }
    }


}
