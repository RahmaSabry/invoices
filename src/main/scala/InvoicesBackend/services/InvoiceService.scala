package InvoicesBackend

import InvoicesBackend.entities._
import akka.actor.Actor
import io.getquill.{CamelCase, H2JdbcContext}
import akka.event.Logging
import akka.http.scaladsl.model.StatusCodes.Success

import scala.concurrent.{ExecutionContext, Future}
case object OK

class InvoiceService extends Actor{
  lazy val ctx = new H2JdbcContext(CamelCase, "db")
  import ctx._
  val log = Logging(context.system, this)
  def receive={
    case invoiceWithItemsID:InvoiceWithItemsID=>
      log.info("newInvoice")
      sender() ! newInvoice(invoiceWithItemsID)
    case  id:Int=> {
      val invoice = getInvoiceWithItems(id)
      sender() ! invoice
    }
    case InvoiceWithItems=>{
      log.info("get invoice")
      sender() ! getAllInvoiceWithItems
    }
    case Item =>
      log.info("get items")
      sender() ! getItems
    case update:UpdateInvoice =>
      log.info("updateInvoice")
      sender() ! updateInvoice(update)
    case delete:DeleteInvoice=>
      log.info("Delete invoice")
      sender() ! deleteInvoice(delete.invoiceID)
  }

  def newInvoice(invoiceWithItemsID: InvoiceWithItemsID) = {
    val insertInvoiceQ = quote(query[Invoice].insert(lift(invoiceWithItemsID.invoice)).returning(_.invoiceID))
    val invoiceID=ctx.run(insertInvoiceQ)
  invoiceWithItemsID.itemsID.map(itemID=>ctx.run(query[ItemInvoice].insert(ItemInvoice(lift(invoiceID), lift(itemID)))))
    OK
  }
  def updateInvoice(updateInvoice: UpdateInvoice)={
    val updateInvoiceQ = quote(query[Invoice].filter(_.invoiceID==lift(updateInvoice.invoiceID)).update(lift(updateInvoice.invoiceWithItemsID.invoice)))
    ctx.run(updateInvoiceQ)
    ctx.run(query[ItemInvoice].filter( _.invoiceID== lift(updateInvoice.invoiceID)).delete)
    if(updateInvoice.invoiceWithItemsID.itemsID.nonEmpty){updateInvoice.invoiceWithItemsID.itemsID.map(itemID=>ctx.run(query[ItemInvoice].insert(ItemInvoice(lift(updateInvoice.invoiceID), lift(itemID)))))}
    OK
  }
  def getInvoiceWithItems(invoiceId: Long) ={
    val q1 = quote {
      query[Invoice].join(query[ItemInvoice]).on((i, ii) => i.invoiceID == ii.invoiceID)
        .join(query[Item]).on((x, y) => x._2.itemID == y.itemID)
        .filter { case ((invoice, _), _) => invoice.invoiceID == lift(invoiceId) }
    }
    val result = ctx.run(q1)
    val invoiceWithItems: Map[Invoice, List[Item]] = result.groupBy {
      case ((invoice, _), _) => invoice
    } map {
      case (invoice: Invoice, groupBy) => (invoice, groupBy.map(_._2))
    }
    val invoice = invoiceWithItems.keySet.toList(0)
    val items: List[Item] =invoiceWithItems(invoice)
    InvoiceWithItems(invoice,items)
  }
  def getAllInvoiceWithItems: List[InvoiceWithItems] = {
    val q1 = quote {
      query[Invoice].join(query[ItemInvoice]).on((i, ii) => i.invoiceID == ii.invoiceID)
        .join(query[Item]).on((x, y) => x._2.itemID == y.itemID)
    }
    val result1: List[((Invoice, ItemInvoice), Item)] = ctx.run(q1)
    val xx: Map[Invoice, List[Item]] = result1.groupBy {
      case ((invoice, _), _) => invoice
    } map { case (invoice: Invoice, groupBy) => (invoice, groupBy.map(_._2))}

    val invoices: List[InvoiceWithItems] =xx.keySet.toList.map(invoice=>InvoiceWithItems(invoice,xx(invoice)))
    invoices
  }
  def deleteInvoice(invoiceID:Long)={
    ctx.run(query[Invoice].filter(_.invoiceID==lift(invoiceID)).delete)
    ctx.run(query[ItemInvoice].filter( _.invoiceID== lift(invoiceID)).delete)
    OK
  }
  def getItems: List[Item] ={
    val itemsQ=quote{query[Item]}
    ctx.run(itemsQ)
  }
}
