using System.ComponentModel.DataAnnotations;
using System.Xml.Serialization;

namespace VentasProject.Models
{
    public class OrdenDetalle
    {
        public int Id { get; set; }
        public int OrdenId { get; set; }
        [Required(ErrorMessage = "El producto es obligatorio.")]
        public string Producto { get; set; }
        [Range(1, int.MaxValue, ErrorMessage = "La cantidad debe ser mayor que 0.")]
        public int Cantidad { get; set; }
        [Range(0.01, double.MaxValue, ErrorMessage = "El precio unitario debe ser mayor que 0.")]
        public decimal PrecioUnitario { get; set; }
        private decimal _Subtotal;
        public decimal Subtotal
        {
            get
            {
                return Cantidad * PrecioUnitario;
            }
            set
            {
                _Subtotal = value;
            }
        }
    }
}
