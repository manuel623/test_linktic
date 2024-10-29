using Microsoft.AspNetCore.Mvc;
using sistema_reservas_backend.Data;
using sistema_reservas_backend.Models;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace sistema_reservas_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServiciosController : ControllerBase
    {
        private readonly ReservasContext _context;

        public ServiciosController(ReservasContext context)
        {
            _context = context;
        }

        // Crea un nuevo servicio (protegido por token)
        [HttpPost("register")]
        [Authorize]
        public async Task<IActionResult> CreateServicio([FromBody] Servicio servicio)
        {
            if (servicio == null)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Servicio inválido"
                });
            }

            try
            {
                _context.Servicios.Add(servicio);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Servicio creado exitosamente",
                    service = servicio
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

        // Lista todos los servicios (protegido por token)
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetServicios()
        {
            try
            {
                var servicios = await _context.Servicios.ToListAsync();
                return Ok(new
                {
                    success = true,
                    message = "Servicios obtenidos con éxito",
                    services = servicios
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

        // Actualiza un servicio (protegido por token)
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateServicio(int id, [FromBody] Servicio servicio)
        {
            if (servicio == null)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Servicio inválido"
                });
            }

            try
            {
                var servicioExistente = await _context.Servicios.FindAsync(id);
                if (servicioExistente == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Servicio no encontrado"
                    });
                }

                servicioExistente.Nombre = servicio.Nombre;
                servicioExistente.Descripcion = servicio.Descripcion;
                servicioExistente.Precio = servicio.Precio;

                _context.Entry(servicioExistente).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Servicio actualizado exitosamente",
                    service = servicioExistente
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

        // Elimina un servicio (protegido por token)
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteServicio(int id)
        {
            try
            {
                var servicio = await _context.Servicios.FindAsync(id);
                if (servicio == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Servicio no encontrado"
                    });
                }

                _context.Servicios.Remove(servicio);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Servicio eliminado exitosamente"
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
    }
}
