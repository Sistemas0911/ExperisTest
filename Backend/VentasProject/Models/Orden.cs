using System.Xml.Serialization;

namespace VentasProject.Models
{
    public class Orden
    {
        public int Id { get; set; }
        public string FechaCreacion { get; set; }
        public string Cliente { get; set; }
        public decimal Total { get; set; }
        public ICollection<OrdenDetalle> Detalles { get; set; } = new List<OrdenDetalle>();

        public string DetalleXml
        {
            get
            {
                if (Detalles == null || !Detalles.Any())
                    return null;

                var serializer = new XmlSerializer(typeof(List<OrdenDetalle>));
                using (var writer = new StringWriter())
                {
                    serializer.Serialize(writer, Detalles.ToList());
                    return writer.ToString();
                }
            }
        }

        public decimal getTotal()
        {
            return Detalles.Sum(d => d.Subtotal);
        }
    }
}
