Create Database OrdenesDB

GO

Use OrdenesDB

GO

Create Table Ordenes
(
Id int identity primary key,
FechaCreacion datetime,
Cliente varchar(150),
Total decimal(18,2)
)

go

Create Table OrdenDetalle(
	Id int identity primary key,
	OrdenId int,
	Producto varchar(100),
	Cantidad int,
	PrecioUnitario decimal(18,2),
	SubTotal decimal(18,2)
)

GO

Create Procedure usp_ObtenerOrdenesPaginado
(
 @pNroOrden int,
 @pCliente varchar(150),
 @pOffset int,
 @pPageSize int
)
As
Begin

SELECT Id, Convert(varchar(20),FechaCreacion,103) FechaCreacion, Cliente, Total
FROM Ordenes
Where 
Id=(Case When @pNroOrden=0 Then Id Else @pNroOrden End) And
Cliente like (Case When @pCliente='' Then Cliente Else @pCliente+'%' End)
ORDER BY Id
OFFSET @pOffset ROWS
FETCH NEXT @pPageSize ROWS ONLY

SELECT Count(*)
FROM Ordenes
Where 
Id=(Case When @pNroOrden=0 Then Id Else @pNroOrden End) And
Cliente like (Case When @pCliente='' Then Cliente Else @pCliente+'%' End)

End

GO

Create Procedure usp_ObtenerOrdenxId
(
 @pNroOrden int
)
As
Begin

SELECT Id, Convert(varchar(20),FechaCreacion,103) FechaCreacion, Cliente, Total
FROM Ordenes
Where Id=@pNroOrden

End

GO

Create Procedure usp_ObtenerDetalleOrdenxId
(
@pNroOrden int
)
As
Begin

Select Id, OrdenId, Producto, Cantidad, PrecioUnitario, ISNULL(Subtotal,0) Subtotal
FROM OrdenDetalle
Where OrdenId=@pNroOrden

End

GO

Create Procedure usp_InsertarOrden
(
@pCliente varchar(150),
@pFechaCreacion varchar(20),
@pDetalleOrden xml,
@pTotal decimal(18,2)
)
As
Begin
	
	IF OBJECT_ID('tempdb..#DetalleOrden') IS NOT NULL
	BEGIN
		Drop Table #DetalleOrden
	END

	declare @vOrdenId int
	declare @vTabla table(
		Producto varchar(100),
		Cantidad int,
		PrecioUnitario decimal(18,2),
		SubTotal decimal(18,2) 
	)

	Insert Into Ordenes (FechaCreacion,Cliente,Total) values (@pFechaCreacion,@pCliente,@pTotal)

	set @vOrdenId=Scope_Identity()
	
	if @vOrdenId IS NOT NULL
	BEGIN 

		SELECT 
		T.Item.value('Producto[1]','NVARCHAR(100)') AS Producto,
		T.Item.value('Cantidad[1]','INT') AS Cantidad,
		T.Item.value('PrecioUnitario[1]','DECIMAL(18,2)') AS PrecioUnitario,
		T.Item.value('Subtotal[1]','DECIMAL(18,2)') AS SubTotal
		INTO #DetalleOrden
		FROM @pDetalleOrden.nodes('//ArrayOfOrdenDetalle/OrdenDetalle') as T(Item)

		Insert Into OrdenDetalle (OrdenId,Producto,Cantidad,PrecioUnitario,SubTotal)
		Select @vOrdenId,Producto,Cantidad,PrecioUnitario,SubTotal From #DetalleOrden

		Select @vOrdenId
	END
	ELSE
	BEGIN

		Select 0
		
	END
End

GO

Create Procedure usp_EliminarOrden
(
 @pNroOrden int
)
As
Begin

Delete From OrdenDetalle Where OrdenId=@pNroOrden
Delete From Ordenes Where Id=@pNroOrden

End

GO

Create Procedure usp_ValidarOrdenClienteFecha
(
 @pCliente varchar(150),
 @pFechaCreacion varchar(20)
)
As
Begin

SELECT COUNT(*)
            FROM Ordenes
            WHERE Cliente = @pCliente AND FechaCreacion = @pFechaCreacion

End