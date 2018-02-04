package InvoicesBackend.resources

import InvoicesBackend.{InvoiceService, OK}
import akka.http.scaladsl.server.Route
import InvoicesBackend.entities._
import InvoicesBackend.routing.MyResource
import InvoicesBackend.services._
import akka.actor.{ActorSystem, Props}
import akka.http.scaladsl.model.HttpMethods._

import scala.concurrent.Future
import scala.util.{Failure, Success}
//import akka.http.scaladsl.model.StatusCodes.Success
import akka.http.scaladsl.model.HttpMethods
import akka.parboiled2.RuleTrace.Fail
import akka.util.Timeout
import ch.megard.akka.http.cors.scaladsl.settings.CorsSettings
import ch.megard.akka.http.cors.scaladsl.CorsDirectives._
import akka.pattern.ask

import scala.concurrent.duration._
import scala.collection.immutable.Seq

trait InvoiceResource extends MyResource {
  val userService:UserService
  val setting = CorsSettings.defaultSettings.copy(allowedMethods = Seq(GET, POST, HEAD, OPTIONS,HttpMethods.PUT,HttpMethods.DELETE))
  implicit val timeout = Timeout(3 seconds)
  val dataBaseService = ActorSystem("InvoiceSystem").actorOf(Props[InvoiceService], name = "dataBase")
  val slickTest=new SlickService()
  def invoiceRoutes: Route =cors(setting){
    pathPrefix("invoices") {
      pathEnd {
        post {
          entity(as[InvoiceWithItemsID]) { invoiceWithItemsID =>
            onSuccess(dataBaseService ? invoiceWithItemsID){
              case OK =>complete("ok")
            }
        }}~
          get {
            onSuccess(dataBaseService ? InvoiceWithItems) {
              case result:List[InvoiceWithItems]=>complete(result)
            }
          }
      } ~
        path(Segment) { id =>
          get {
            onSuccess(dataBaseService ? id.toInt) {
              case result : InvoiceWithItems =>complete(result)
            }
          } ~
            put {
              entity(as[InvoiceWithItemsID]) { invoiceWithItemsID =>
                  onSuccess(dataBaseService ? UpdateInvoice(id.toInt,invoiceWithItemsID)){
                    case OK=>complete("ok")
                  }
              }
            } ~
            delete {
              onSuccess(dataBaseService ? DeleteInvoice(id.toInt)){
                case OK=>complete("ok")
              }
            }
        }}~
      pathPrefix("items") {
        pathEnd {
          get {
            onSuccess(dataBaseService ? Item){
              case item:List[Item] =>
                complete(item)
            }
          }
        }
      }~
      pathPrefix("register") {
        pathEnd {
          post {
            entity(as[Users]) { user =>
              completeWithLocationHeader(
                resourceId = userService.register(user),
                ifDefinedStatus = 201, ifEmptyStatus = 409)
            }
          }
        }
      }~
      pathPrefix("login") {
        pathEnd {
          post {
            entity(as[LogIn]) { login =>
              complete(userService.authenticate(login.userName,login.password).status,userService.authenticate(login.userName,login.password).message)
            }
            }
          }
        }~
      pathPrefix("slick"){
        pathEnd{
          get {
            val result =slickTest.getAllInvoiceWithItems()
            result onComplete {
              case Success(list) =>println(list)
              case Failure(t) => println("An error has occurred: " + t.getMessage)
            }
            complete(result)
          }
        }~
        path(Segment) { id =>
          get {
//           val user= slickTest.getUser(id.toInt)
            val result=slickTest.getInvoiceWithItems(id.toInt)
            result onComplete {
              case Success(invoice) =>println(invoice)
              case Failure(t) => println("An error has occurred: " + t.getMessage)
            }
            complete(result)
          }

        }
      }
      }


}

