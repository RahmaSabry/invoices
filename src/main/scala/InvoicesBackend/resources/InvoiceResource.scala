package InvoicesBackend.resources

import akka.http.scaladsl.server.Route
import InvoicesBackend.entities.{Invoice, InvoiceUpdate}
import InvoicesBackend.routing.MyResource
import InvoicesBackend.services.InvoiceService



trait InvoiceResource extends MyResource {

  val invoiceService: InvoiceService

  def invoiceRoutes: Route = {

      pathPrefix("invoices") {
        pathEnd {
          post {
            entity(as[Invoice]) { invoice =>
              completeWithLocationHeader(
                resourceId = invoiceService.createInvoice(invoice),
                ifDefinedStatus = 201, ifEmptyStatus = 409)
            }
          }
        } ~
          path(Segment) { id =>
            get {


              complete(invoiceService.getInvoice(id))

            } ~
              put {
                entity(as[InvoiceUpdate]) { update =>
                  complete(invoiceService.updateInvoice(id, update))
                }
              } ~
              delete {
                complete(invoiceService.deleteInvoice(id))
              }
          }

      }
    }

  }
