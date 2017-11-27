
package InvoicesBackend

import scala.concurrent.ExecutionContext

import akka.http.scaladsl.server.Route

import InvoicesBackend.resources.InvoiceResource
import InvoicesBackend.services.InvoiceService

trait RestInterface extends Resources {

  implicit def executionContext: ExecutionContext

  lazy val invoiceService = new InvoiceService

  val routes: Route = invoiceRoutes

}

trait Resources extends InvoiceResource