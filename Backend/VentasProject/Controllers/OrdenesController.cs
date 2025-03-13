using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VentasProject.Data.Repositories;
using VentasProject.Models;

namespace VentasProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdenesController : ControllerBase
    {
        private readonly IOrdenRepository _repository;

        public OrdenesController(IOrdenRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        [Authorize(Roles = "Admin, User")]
        public async Task<IActionResult> GetOrdenes([FromQuery] int nroOrden = 0, [FromQuery] string cliente = "", [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var (ordenes, totalCount) = await _repository.GetOrdenes(nroOrden, cliente, pageNumber, pageSize);
            var response = new
            {
                Data = ordenes,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
            return Ok(response);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin, User")]
        public async Task<IActionResult> GetOrdenById(int id)
        {
            var orden = await _repository.GetOrdenById(id);
            if (orden == null)
            {
                return NotFound();
            }
            else
            {
                var lista = await _repository.GetOrdenDetalleById(id);
                orden.Detalles = lista;
            }

            return Ok(orden);
        }

        [HttpPost]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> CreateOrden(Orden orden)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (orden.Detalles == null || !orden.Detalles.Any())
                return BadRequest("La orden debe tener detalles.");

            foreach (var detalle in orden.Detalles)
            {
                if (detalle.Cantidad <= 0 || detalle.PrecioUnitario <= 0)
                {
                    ModelState.AddModelError("Detalles", "La cantidad y el precio unitario deben ser mayores que 0.");
                    return BadRequest(ModelState);
                }
            }

            try
            {
                await _repository.CreateOrden(orden);
                return CreatedAtAction(nameof(GetOrdenById), new { id = orden.Id }, orden);
            }
            catch (InvalidOperationException ex)
            {
                ModelState.AddModelError("Orden", ex.Message);
                return BadRequest(ModelState);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin, User")]
        public async Task<IActionResult> DeleteOrden(int id)
        {
            await _repository.DeleteOrden(id);
            return NoContent();
        }
    }
}
