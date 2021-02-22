package InvoicesBackend

import scala.concurrent.ExecutionContext
import akka.http.scaladsl.server.Route
import InvoicesBackend.resources.InvoiceResource
import InvoicesBackend.services.UserService

trait RestInterface extends InvoiceResource {
  implicit def executionContext: ExecutionContext
  lazy val invoiceService = new InvoiceService()
  lazy val userService = new UserService()
  val routes: Route = invoiceRoutes
}
