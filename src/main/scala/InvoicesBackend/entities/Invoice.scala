package InvoicesBackend.entities

case class Invoice(invoiceID: Long, clientName: String, address: String,date:String,phoneNumber:String )
case class InvoiceWithItemsID(invoice: Invoice,itemsID:List[Int])
case class InvoiceWithItems(invoice: Invoice,items:Seq[Item])
case class InvoiceWithItemsOption(invoice: Invoice,items:Seq[Option[Item]])
case class ItemInvoice(invoiceID:Long,itemID:Long)
case class UpdateInvoice(invoiceID:Long,invoiceWithItemsID: InvoiceWithItemsID)
case class DeleteInvoice(invoiceID:Long)