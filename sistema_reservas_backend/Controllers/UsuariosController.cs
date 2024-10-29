using Microsoft.AspNetCore.Mvc;
using sistema_reservas_backend.Data;
using sistema_reservas_backend.Models;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace sistema_reservas_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly ReservasContext _context;

        public UsuariosController(ReservasContext context)
        {
            _context = context;
        }

        // Iniciar sesión
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel login)
        {
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == login.Email);

            // Verifica si el usuario no existe
            if (usuario == null)
            {
                return Unauthorized(new
                {
                    success = false,
                    message = "El correo electrónico no está registrado."
                });
            }

            // Verifica si la contraseña es incorrecta
            if (!BCrypt.Net.BCrypt.Verify(login.Password, usuario.Password))
            {
                return Unauthorized(new
                {
                    success = false,
                    message = "La contraseña es incorrecta."
                });
            }

            // Crea el token JWT
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes("ASecretKeyThatHasExactly32CharactersForHMACSHA256");
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim(ClaimTypes.Name, usuario.Id.ToString()) }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new
            {
                success = true,
                message = "Inicio de sesión exitoso.",
                token = tokenString,
                user = new
                {
                    nombre = usuario.Nombre,
                    email = usuario.Email,
                }
            });
        }

        // Registra un nuevo usuario (protegido por token)
        [HttpPost("register")]
        [Authorize]
        public async Task<IActionResult> RegisterUsuario([FromBody] Usuario usuario)
        {
            if (usuario == null)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Usuario inválido"
                });
            }

            try
            {
                // Encripta la contraseña antes de guardarla
                usuario.Password = BCrypt.Net.BCrypt.HashPassword(usuario.Password);

                _context.Usuarios.Add(usuario);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Usuario registrado exitosamente",
                    user = usuario
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error: " + ex.Message
                });
            }
        }

        // Lista todos los usuarios (protegido por token)
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetUsuarios()
        {
            try
            {
                var usuarios = await _context.Usuarios.ToListAsync();
                return Ok(new
                {
                    success = true,
                    message = "Usuarios obtenidos con éxito",
                    users = usuarios
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error: " + ex.Message
                });
            }
        }

        // Actualiza un usuario (protegido por token)
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateUsuario(int id, [FromBody] Usuario usuario)
        {
            try
            {
                var usuarioExistente = await _context.Usuarios.FindAsync(id);
                if (usuarioExistente == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Usuario no encontrado"
                    });
                }

                usuarioExistente.Nombre = usuario.Nombre;
                usuarioExistente.Email = usuario.Email;

                // Si la contraseña ha sido proporcionada, se encripta nuevamente
                if (!string.IsNullOrEmpty(usuario.Password))
                {
                    usuarioExistente.Password = BCrypt.Net.BCrypt.HashPassword(usuario.Password);
                }

                _context.Entry(usuarioExistente).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Usuario actualizado exitosamente",
                    user = usuarioExistente
                });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsuarioExists(id))
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Usuario no encontrado"
                    });
                }
                else
                {
                    throw;
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error: " + ex.Message
                });
            }
        }

        // Elimina un usuario (protegido por token)
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            try
            {
                var usuario = await _context.Usuarios.FindAsync(id);
                if (usuario == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Usuario no encontrado"
                    });
                }

                _context.Usuarios.Remove(usuario);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Usuario eliminado exitosamente"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error: " + ex.Message
                });
            }
        }

        // Método auxiliar para verificar si el usuario existe
        private bool UsuarioExists(int id)
        {
            return _context.Usuarios.Any(e => e.Id == id);
        }
    }
}
