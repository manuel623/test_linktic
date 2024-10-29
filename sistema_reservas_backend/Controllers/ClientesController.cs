using Microsoft.AspNetCore.Mvc;
using sistema_reservas_backend.Data;
using sistema_reservas_backend.Models;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization; 

namespace sistema_reservas_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientesController : ControllerBase
    {
        private readonly ReservasContext _context;

        public ClientesController(ReservasContext context)
        {
            _context = context;
        }

        // Registra un nuevo cliente (protegido por token)
        [HttpPost("register")]
        [Authorize]
        public async Task<IActionResult> RegisterCliente([FromBody] Cliente cliente)
        {
            if (cliente == null)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Cliente inválido"
                });
            }

            try
            {
                _context.Clientes.Add(cliente);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Cliente registrado exitosamente",
                    client = cliente
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

        // Lista todos los clientes (protegido por token)
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetClientes()
        {
            try
            {
                var clientes = await _context.Clientes.ToListAsync();
                return Ok(new
                {
                    success = true,
                    message = "Clientes obtenidos con éxito",
                    clients = clientes
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

        // Actualiza un cliente (protegido por token)
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateCliente(int id, [FromBody] Cliente cliente)
        {
            try
            {
                var clienteExistente = await _context.Clientes.FindAsync(id);
                if (clienteExistente == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Cliente no encontrado"
                    });
                }

                clienteExistente.Nombre = cliente.Nombre;
                clienteExistente.Email = cliente.Email;
                clienteExistente.Telefono = cliente.Telefono;
                clienteExistente.FechaRegistro = cliente.FechaRegistro;

                _context.Entry(clienteExistente).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Cliente actualizado exitosamente",
                    client = clienteExistente
                });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClienteExists(id))
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Cliente no encontrado"
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

        // Elimina un cliente (protegido por token)
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteCliente(int id)
        {
            try
            {
                var cliente = await _context.Clientes.FindAsync(id);
                if (cliente == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Cliente no encontrado"
                    });
                }

                _context.Clientes.Remove(cliente);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Cliente eliminado exitosamente"
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

        // Método auxiliar para verificar si el cliente existe
        private bool ClienteExists(int id)
        {
            return _context.Clientes.Any(e => e.Id == id);
        }
    }
}
