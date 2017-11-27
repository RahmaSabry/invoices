package InvoicesBackend.services

import InvoicesBackend.entities.{Invoice,InvoiceUpdate}

import scala.concurrent.{ExecutionContext, Future}

class InvoiceService(implicit val executionContext: ExecutionContext) {

  var invoices = Vector.empty[Invoice]

  def createInvoice(invoice: Invoice): Future[Option[String]] = Future {
    invoices.find(_.id == invoice.id) match {
      case Some(q) => None // Conflict! id is already taken
      case None =>
        invoices = invoices :+ invoice
        Some(invoice.id)
    }
  }

  def getInvoice(id: String): Future[Option[Invoice]] = Future {
    invoices.find(_.id == id)
  }

  def updateInvoice(id: String, update: InvoiceUpdate): Future[Option[Invoice]] = {

    def updateEntity(invoice: Invoice): Invoice = {
      val clientName = update.clientName.getOrElse(invoice.clientName)
      val address = update.address.getOrElse(invoice.address)
      val date = update.date.getOrElse(invoice.date)
      val phoneNumber = update.phoneNumber.getOrElse(invoice.phoneNumber)
      val items = update.items.getOrElse(invoice.items)
      Invoice(id, clientName,address,date,phoneNumber,items)
    }

    getInvoice(id).flatMap { maybeInvoice =>
      maybeInvoice match {
        case None => Future { None }
        case Some(invoice) =>
          val updatedInvoice = updateEntity(invoice)
          deleteInvoice(id).flatMap { _ =>
            createInvoice(updatedInvoice).map(_ => Some(updatedInvoice))
          }
      }
    }
  }

  def deleteInvoice(id: String): Future[Unit] = Future {
    invoices = invoices.filterNot(_.id == id)
  }


}

