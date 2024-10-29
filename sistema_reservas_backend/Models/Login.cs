using System;

namespace sistema_reservas_backend.Models
{
    public class LoginModel
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }

}
