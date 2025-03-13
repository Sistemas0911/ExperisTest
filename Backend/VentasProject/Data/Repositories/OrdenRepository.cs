using Microsoft.Data.SqlClient;
using System.Data;
using VentasProject.Models;

namespace VentasProject.Data.Repositories
{
    public class OrdenRepository : IOrdenRepository
    {
        private readonly DatabaseContext _context;

        public OrdenRepository(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<(IEnumerable<Orden> Ordenes, int TotalCount)> GetOrdenes(int nroOrden, string cliente, int pageNumber, int pageSize)
        {
            var ordenes = new List<Orden>();
            int totalCount = 0;

            using (var connection = _context.GetConnection())
            {
                await connection.OpenAsync();

                var query = "usp_ObtenerOrdenesPaginado";

                using (var command = new SqlCommand(query, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    //                   @NroOrden int,
                    //@Cliente varchar(150),
                    command.Parameters.AddWithValue("@pNroOrden", nroOrden);
                    command.Parameters.AddWithValue("@pCliente", cliente);
                    command.Parameters.AddWithValue("@pOffset", (pageNumber - 1) * pageSize);
                    command.Parameters.AddWithValue("@pPageSize", pageSize);

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var orden = new Orden
                            {
                                Id = reader.GetInt32(0),
                                FechaCreacion = reader.GetString(1),
                                Cliente = reader.GetString(2),
                                Total = reader.GetDecimal(3)
                            };
                            ordenes.Add(orden);
                        }

                        if (await reader.NextResultAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                totalCount = reader.GetInt32(0);
                            }
                        }
                    }
                }
            }

            return (ordenes, totalCount);
        }

        public async Task<Orden> GetOrdenById(int id)
        {
            var orden = new Orden();
            using (var connection = _context.GetConnection())
            {
                await connection.OpenAsync();

                var query = "usp_ObtenerOrdenxId";

                using (var command = new SqlCommand(query, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@pNroOrden", id);

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            orden.Id = reader.GetInt32(0);
                            orden.FechaCreacion = reader.GetString(1);
                            orden.Cliente = reader.GetString(2);
                            orden.Total = reader.GetDecimal(3);

                            return orden;
                        }
                    }
                }
            }

            return null;
        }

        public async Task<List<OrdenDetalle>> GetOrdenDetalleById(int id)
        {
            var ordenDetalleLista = new List<OrdenDetalle>();
            OrdenDetalle ordenDetalle = null;

            using (var connection = _context.GetConnection())
            {
                await connection.OpenAsync();

                var query = "usp_ObtenerDetalleOrdenxId";

                using (var command = new SqlCommand(query, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@pNroOrden", id);

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            ordenDetalle = new OrdenDetalle();

                            ordenDetalle.Id = reader.GetInt32(0);
                            ordenDetalle.OrdenId = reader.GetInt32(1);
                            ordenDetalle.Producto = reader.GetString(2);
                            ordenDetalle.Cantidad = reader.GetInt32(3);
                            ordenDetalle.PrecioUnitario = reader.GetDecimal(4);
                            ordenDetalle.Subtotal = reader.GetDecimal(5);


                            ordenDetalleLista.Add(ordenDetalle);
                        }
                        return ordenDetalleLista;
                    }
                }
            }

            return null;
        }

        public async Task CreateOrden(Orden orden)
        {
            if (await ValidarClienteFecha(orden.Cliente, orden.FechaCreacion))
            {
                throw new InvalidOperationException("Ya existe una orden con el mismo cliente y fecha.");
            }

            using (var connection = _context.GetConnection())
            {
                await connection.OpenAsync();

                var query = "usp_InsertarOrden";

                using (var command = new SqlCommand(query, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@pCliente", orden.Cliente);
                    command.Parameters.AddWithValue("@pFechaCreacion", orden.FechaCreacion);
                    command.Parameters.AddWithValue("@pDetalleOrden", orden.DetalleXml);
                    command.Parameters.AddWithValue("@pTotal", orden.getTotal());


                    var ordenId = await command.ExecuteScalarAsync();
                    orden.Id = Convert.ToInt32(ordenId);
                }
            }
        }

        public async Task DeleteOrden(int id)
        {
            using (var connection = _context.GetConnection())
            {
                await connection.OpenAsync();

                var query = "usp_EliminarOrden";

                using (var command = new SqlCommand(query, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@pNroOrden", id);
                    await command.ExecuteNonQueryAsync();
                }
            }
        }

        public async Task<bool> ValidarClienteFecha(string cliente, string fecha)
        {
            using (var connection = _context.GetConnection())
            {
                await connection.OpenAsync();

                var query = "usp_ValidarOrdenClienteFecha";

                using (var command = new SqlCommand(query, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@pCliente", cliente);
                    command.Parameters.AddWithValue("@pFechaCreacion", fecha);

                    var cantidad = (int)await command.ExecuteScalarAsync();
                    return cantidad > 0;
                }
            }
        }
    }
}
