using VentasProject.Models;

namespace VentasProject.Data.Repositories
{
    public interface IOrdenRepository
    {
        Task<(IEnumerable<Orden> Ordenes, int TotalCount)> GetOrdenes(int nroOrden, string cliente, int pageNumber, int pageSize);
        Task<Orden> GetOrdenById(int id);
        Task<List<OrdenDetalle>> GetOrdenDetalleById(int id);
        Task CreateOrden(Orden orden);
        Task DeleteOrden(int id);
        Task<bool> ValidarClienteFecha(string cliente, string fecha);
    }
}
