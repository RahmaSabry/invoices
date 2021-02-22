package InvoicesBackend.entities

case class InvoiceUpdate(clientName: Option[String], address: Option[String],date:Option[String],phoneNumber:Option[String],items:Option[Array[Item]])

