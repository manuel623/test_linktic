using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sistema_reservas_backend.Data;
using sistema_reservas_backend.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace sistema_reservas_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservasController : ControllerBase
    {
        private readonly ReservasContext _context;

        public ReservasController(ReservasContext context)
        {
            _context = context;
        }

        // Lista todas las reservas (protegido por token)
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetReservas()
        {
            try
            {
                var reservas = await _context.Reservas
                    .Include(r => r.Cliente)
                    .Include(r => r.Servicio)
                    .Select(r => new
                    {
                        r.Id,
                        ClienteNombre = r.Cliente.Nombre,
                        ServicioNombre = r.Servicio.Nombre,
                        r.FechaReserva,
                        r.Estado
                    })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    message = "Reservas obtenidas con éxito",
                    reservas
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

        // Crea nuevas reservas (protegido por token)
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateReserva([FromBody] Reserva reserva)
        {
            if (reserva == null)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Reserva inválida"
                });
            }

            try
            {
                _context.Reservas.Add(reserva);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Reserva creada exitosamente",
                    reserva
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

        // Actualiza las reservas (protegido por token)
        [HttpPut("{id}")]
        [Authorize] 
        public async Task<IActionResult> UpdateReserva(int id, [FromBody] Reserva reserva)
        {
            try
            {
                var reservaExistente = await _context.Reservas.FindAsync(id);
                if (reservaExistente == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Reserva no encontrada"
                    });
                }

                reservaExistente.FechaReserva = reserva.FechaReserva;
                reservaExistente.Estado = reserva.Estado;
                reservaExistente.ClienteId = reserva.ClienteId;
                reservaExistente.ServicioId = reserva.ServicioId;

                _context.Entry(reservaExistente).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Reserva actualizada exitosamente",
                    reserva = reservaExistente
                });
            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error de concurrencia al actualizar la reserva"
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

        // Elimina reservas (protegido por token)
        [HttpDelete("{id}")]
        [Authorize] 
        public async Task<IActionResult> DeleteReserva(int id)
        {
            try
            {
                var reserva = await _context.Reservas.FindAsync(id);
                if (reserva == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Reserva no encontrada"
                    });
                }

                _context.Reservas.Remove(reserva);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Reserva eliminada exitosamente"
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

        // Método auxiliar para verificar si la reserva existe
        private bool ReservaExists(int id)
        {
            return _context.Reservas.Any(e => e.Id == id);
        }
    }
}
