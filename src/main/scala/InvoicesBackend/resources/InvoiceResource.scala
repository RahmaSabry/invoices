package InvoicesBackend.resources

import akka.http.scaladsl.server.Route
import InvoicesBackend.entities.{Invoice, InvoiceUpdate}
import InvoicesBackend.routing.MyResource
import InvoicesBackend.services.InvoiceService
import akka.http.scaladsl.model.HttpMethods._
import akka.http.scaladsl.model.HttpMethods
import ch.megard.akka.http.cors.scaladsl.settings.CorsSettings
import ch.megard.akka.http.cors.scaladsl.CorsDirectives._

import scala.collection.immutable.Seq

trait InvoiceResource extends MyResource {

  val invoiceService: InvoiceService
  val setting = CorsSettings.defaultSettings.copy(allowedMethods = Seq(GET, POST, HEAD, OPTIONS,HttpMethods.PUT,HttpMethods.DELETE))
  def invoiceRoutes: Route =cors(setting){
    pathPrefix("invoices") {
      pathEnd {
        post {
          entity(as[Invoice]) { invoice =>
            completeWithLocationHeader(
              resourceId = invoiceService.createInvoice(invoice),
              ifDefinedStatus = 201, ifEmptyStatus = 409)
          }
        }~
          get{
            complete(invoiceService.invoices)
          }
      } ~
        path(Segment) { id =>
          get {
            complete(invoiceService.getInvoice(id.toInt))
          } ~
            put {
              entity(as[InvoiceUpdate]) { update =>
                complete(invoiceService.updateInvoice(id.toInt, update))
              }
            } ~
            delete {
              complete(invoiceService.deleteInvoice(id.toInt))
            }
        }

    }
  }

}
